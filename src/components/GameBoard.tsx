import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent
} from "react";

import {
  BASE_TILE_COUNT,
  COMBO_BONUS_STEP,
  COMBO_MAX_MULTIPLIER,
  COMBO_WINDOW_SECONDS,
  EXPLOSION_MS,
  MAX_EFFECT_SECONDS,
  POWERUP_SIZE,
  POWERUP_META,
  POWERUP_TYPES,
  REFRESH_SPAWN_MS,
  ROUND_PACE_STEP,
  TILE_SIZE,
  type BaseTileCount,
  type MaxBounces,
  type RoundDurationSeconds,
  type SpeedMultiplier
} from "../game/constants";
import { LANGUAGE_OPTIONS, type LanguageCode, UI_TEXT } from "../game/i18n";
import { isRealWord, makePowerUp, makeTile, updateMovingEntity, wildcardCandidates } from "../game/logic";
import type { Letter, PowerUp, SubmittedWord, Tile, TrayTile } from "../game/types";
import { GameField } from "./GameField";
import { GameHud } from "./GameHud";
import { GameMenu } from "./GameMenu";
import { GameSidePanel } from "./GameSidePanel";
import { HelpModal } from "./HelpModal";

function stopEvent(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

type RoundGoalConfig = {
  score: number;
};

function rollGoalConfig(round: number): RoundGoalConfig {
  return {
    score: 45 + (round - 1) * 15
  };
}

function wordLengthBonus(length: number): number {
  if (length <= 4) return 0;
  return 2 ** (length - 4);
}

type GameBoardProps = {
  language: LanguageCode;
  roundSeconds: RoundDurationSeconds;
  baseTileCount: BaseTileCount;
  speedMultiplier: SpeedMultiplier;
  maxBounces: MaxBounces;
  powerUpRespawnMs: number;
  onOpenOptions: () => void;
};

export function GameBoard({
  language,
  roundSeconds,
  baseTileCount,
  speedMultiplier,
  maxBounces,
  powerUpRespawnMs,
  onOpenOptions
}: GameBoardProps) {
  const t = UI_TEXT[language];

  const idRef = useRef(1);
  const frameRef = useRef<number | null>(null);
  const tickRef = useRef(0);
  const feedbackIdRef = useRef(1);
  const powerUpRespawnAtRef = useRef(0);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const validateSeqRef = useRef(0);
  const mountedRef = useRef(false);

  const [tiles, setTiles] = useState<Tile[]>(() =>
    Array.from({ length: BASE_TILE_COUNT }, () => makeTile(idRef.current++, language, speedMultiplier))
  );
  const [tray, setTray] = useState<TrayTile[]>([]);
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [status, setStatus] = useState(t.initialStatus);
  const [submittedWords, setSubmittedWords] = useState<SubmittedWord[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [wordValidation, setWordValidation] = useState<"too-short" | "checking" | "valid" | "invalid">(
    "too-short"
  );
  const [timeLeft, setTimeLeft] = useState<number>(roundSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isBetweenRounds, setIsBetweenRounds] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [canAdvanceRound, setCanAdvanceRound] = useState(false);
  const [roundScoreStart, setRoundScoreStart] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [comboWindowLeft, setComboWindowLeft] = useState(0);
  const [comboPulse, setComboPulse] = useState(false);
  const [feedbackBursts, setFeedbackBursts] = useState<
    Array<{ id: number; text: string; tone: "score" | "combo" | "bonus" }>
  >([]);

  const [powerUp, setPowerUp] = useState<PowerUp | null>(() =>
    makePowerUp(idRef.current++, "bomb", speedMultiplier)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [explosionPulse, setExplosionPulse] = useState(false);

  const [multiplierLeft, setMultiplierLeft] = useState(0);
  const [freezeLeft, setFreezeLeft] = useState(0);
  const [wallLeft, setWallLeft] = useState(0);
  const [slowLeft, setSlowLeft] = useState(0);

  const isMultiplierActive = multiplierLeft > 0;
  const isFrozen = freezeLeft > 0;
  const isWallActive = wallLeft > 0;
  const isSlowActive = slowLeft > 0;
  const roundPaceMultiplier = 1 + (currentRound - 1) * ROUND_PACE_STEP;
  const effectivePowerUpRespawnMs = Math.max(650, Math.round(powerUpRespawnMs / roundPaceMultiplier));

  const activeTileTarget = isMultiplierActive ? baseTileCount * 2 : baseTileCount;
  const [goalConfig, setGoalConfig] = useState<RoundGoalConfig>(() => rollGoalConfig(1));

  const roundScore = Math.max(0, score - roundScoreStart);
  const roundGoals = useMemo(
    () => [
      {
        label: t.goalScore(goalConfig.score),
        detail: `${roundScore}/${goalConfig.score}`,
        done: roundScore >= goalConfig.score
      }
    ],
    [goalConfig, roundScore, t]
  );
  function pushFeedbackBurst(text: string, tone: "score" | "combo" | "bonus", lifetimeMs = 900) {
    const id = feedbackIdRef.current++;
    setFeedbackBursts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setFeedbackBursts((prev) => prev.filter((entry) => entry.id !== id));
    }, lifetimeMs);
  }

  function resetRoundState(resetScore: boolean, roundNumber = currentRound) {
    const nextScoreStart = resetScore ? 0 : score;
    idRef.current = 1;
    tickRef.current = 0;
    powerUpRespawnAtRef.current = 0;
    pointerRef.current = null;

    setTiles(Array.from({ length: baseTileCount }, () => makeTile(idRef.current++, language, speedMultiplier)));
    setTray([]);
    setSubmittedWords([]);
    setRoundScoreStart(nextScoreStart);
    setGoalConfig(rollGoalConfig(roundNumber));
    setCanAdvanceRound(false);
    setIsGameOver(false);
    setComboMultiplier(1);
    setComboWindowLeft(0);
    setComboPulse(false);
    setFeedbackBursts([]);
    setIsChecking(false);
    setTimeLeft(roundSeconds);
    setIsRunning(true);
    setIsPaused(false);
    setPowerUp(makePowerUp(idRef.current++, "bomb", speedMultiplier));
    setIsRefreshing(false);
    setExplosionPulse(false);

    setMultiplierLeft(0);
    setFreezeLeft(0);
    setWallLeft(0);
    setSlowLeft(0);

    if (resetScore) {
      setScore(0);
      setCurrentRound(1);
      setGoalConfig(rollGoalConfig(1));
      setIsBetweenRounds(false);
      setIsGameOver(false);
    }

    setStatus(UI_TEXT[language].initialStatus);
  }

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    resetRoundState(true);
  }, [language, roundSeconds, baseTileCount, speedMultiplier, maxBounces, powerUpRespawnMs]);

  useEffect(() => {
    const loop = (now: number) => {
      if (!tickRef.current) tickRef.current = now;
      const dtBase = Math.min(0.05, (now - tickRef.current) / 1000);
      tickRef.current = now;

      if (!isRunning || isPaused) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      const speedFactor = isFrozen ? 0 : isSlowActive ? 0.45 : 1;
      const dt = dtBase * speedFactor * roundPaceMultiplier;
      const tileMaxBounces = isWallActive ? Number.MAX_SAFE_INTEGER : maxBounces;

      setTiles((prevTiles) => {
        const nextTiles = prevTiles
          .map((tile) => updateMovingEntity(tile, TILE_SIZE, dt, tileMaxBounces))
          .filter((value): value is Tile => value !== null);

        while (!isRefreshing && nextTiles.length < activeTileTarget) {
          nextTiles.push(makeTile(idRef.current++, language, speedMultiplier));
        }

        return nextTiles;
      });

      setPowerUp((prevPowerUp) => {
        if (!prevPowerUp) {
          if (!isRefreshing && now >= powerUpRespawnAtRef.current) {
            return makePowerUp(idRef.current++, undefined, speedMultiplier);
          }
          return prevPowerUp;
        }

        const moved = updateMovingEntity(prevPowerUp, POWERUP_SIZE, dt, maxBounces);
        if (!moved) {
          powerUpRespawnAtRef.current = now + effectivePowerUpRespawnMs;
          return null;
        }
        return moved;
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [
    isRunning,
    isPaused,
    isRefreshing,
    activeTileTarget,
    isFrozen,
    isSlowActive,
    isWallActive,
    maxBounces,
    effectivePowerUpRespawnMs,
    speedMultiplier,
    language,
    roundPaceMultiplier
  ]);

  useEffect(() => {
    if (!isRunning || isPaused) return undefined;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const scoreGoalMet = roundScore >= goalConfig.score;
          setCanAdvanceRound(scoreGoalMet);

          setIsRunning(false);
          setIsPaused(true);
          setIsBetweenRounds(scoreGoalMet);
          setIsGameOver(!scoreGoalMet);
          setStatus(scoreGoalMet ? `${t.round} ${currentRound} ${t.timeUpStatus}` : t.statusScoreRequired(goalConfig.score));
          return 0;
        }
        return prev - 1;
      });

      setComboWindowLeft((prev) => {
        if (prev <= 0) return 0;
        const next = prev - 1;
        if (next === 0) setComboMultiplier(1);
        return next;
      });
      setMultiplierLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setFreezeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setWallLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setSlowLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    isPaused,
    t.timeUpStatus,
    t.statusScoreRequired,
    t.round,
    currentRound,
    goalConfig,
    roundScore
  ]);

  useEffect(() => {
    if (!isRunning || !isRefreshing) return undefined;
    const interval = setInterval(() => {
      setTiles((prev) => {
        if (prev.length >= activeTileTarget) return prev;
        return [...prev, makeTile(idRef.current++, language, speedMultiplier)];
      });
    }, REFRESH_SPAWN_MS);
    return () => clearInterval(interval);
  }, [isRunning, isRefreshing, activeTileTarget, language, speedMultiplier]);

  useEffect(() => {
    if (!isRefreshing || tiles.length < activeTileTarget) return;
    setIsRefreshing(false);
    powerUpRespawnAtRef.current = performance.now() + 250;
    setStatus(t.bombRefreshComplete);
  }, [isRefreshing, tiles.length, activeTileTarget, t.bombRefreshComplete]);

  useEffect(() => {
    if (!explosionPulse) return undefined;
    const timeout = setTimeout(() => setExplosionPulse(false), EXPLOSION_MS);
    return () => clearTimeout(timeout);
  }, [explosionPulse]);

  const trayBaseScore = useMemo(
    () => tray.reduce((sum, tile) => sum + tile.value * (tile.letterMultiplier ?? 1), 0),
    [tray]
  );
  const trayWordMultiplier = useMemo(
    () => tray.reduce((product, tile) => product * (tile.wordMultiplier ?? 1), 1),
    [tray]
  );
  const trayLengthBonus = useMemo(() => wordLengthBonus(tray.length), [tray.length]);
  const trayScore = useMemo(
    () => (trayBaseScore + trayLengthBonus) * trayWordMultiplier,
    [trayBaseScore, trayLengthBonus, trayWordMultiplier]
  );
  const canSubmit = isRunning && !isPaused && !isRefreshing && !isChecking && wordValidation === "valid";

  useEffect(() => {
    if (!isRunning || isRefreshing || tray.length < 4) {
      setWordValidation("too-short");
      return;
    }

    setWordValidation("checking");
    const seq = ++validateSeqRef.current;
    const timeout = setTimeout(async () => {
      const chars = tray.map((tile) => tile.char);
      const resolvedWord = await resolveSubmittedWord(chars);
      if (validateSeqRef.current !== seq) return;
      setWordValidation(resolvedWord ? "valid" : "invalid");
    }, 220);

    return () => clearTimeout(timeout);
  }, [tray, isRunning, isRefreshing, language]);

  const activeEffects = useMemo(() => {
    const effects: string[] = [];
    if (isMultiplierActive) effects.push(`${t.effectX2} ${multiplierLeft}s`);
    if (isFrozen) effects.push(`${t.effectFreeze} ${freezeLeft}s`);
    if (isWallActive) effects.push(`${t.effectWall} ${wallLeft}s`);
    if (isSlowActive) effects.push(`${t.effectSlow} ${slowLeft}s`);
    return effects;
  }, [
    isMultiplierActive,
    multiplierLeft,
    isFrozen,
    freezeLeft,
    isWallActive,
    wallLeft,
    isSlowActive,
    slowLeft,
    t.effectX2,
    t.effectFreeze,
    t.effectWall,
    t.effectSlow
  ]);

  function collectTile(tileId: number) {
    if (!isRunning || isPaused || isRefreshing) return;

    setTiles((prev) => {
      const found = prev.find((tile) => tile.id === tileId);
      if (!found) return prev;

      setTray((old) => [
        ...old,
        {
          char: found.char,
          value: found.value,
          id: found.id,
          letterMultiplier: found.letterMultiplier,
          wordMultiplier: found.wordMultiplier
        }
      ]);

      const nextTiles = prev.filter((tile) => tile.id !== tileId);
      if (nextTiles.length < activeTileTarget) {
        nextTiles.push(makeTile(idRef.current++, language, speedMultiplier));
      }
      return nextTiles;
    });
  }

  async function resolveSubmittedWord(chars: Array<Letter | "*">): Promise<string | null> {
    const candidates = wildcardCandidates(chars, language);
    if (candidates.length === 0) return null;

    for (const candidate of candidates) {
      const isValid = await isRealWord(candidate.toLowerCase(), language);
      if (isValid) return candidate;
    }

    return null;
  }

  async function submitWord() {
    if (isChecking || !isRunning || isPaused || isRefreshing) return;
    if (tray.length < 4) {
      setStatus(t.wordMin4);
      return;
    }
    if (wordValidation !== "valid") {
      setStatus(t.trayInvalid);
      return;
    }

    const chars = tray.map((tile) => tile.char);

    setIsChecking(true);
    setStatus(t.statusChecking(chars.join("").toLowerCase()));
    const resolvedWord = await resolveSubmittedWord(chars);
    setIsChecking(false);

    if (!resolvedWord) {
      setStatus(t.noValidWord);
      return;
    }

    let awardedPoints = (trayBaseScore + wordLengthBonus(resolvedWord.length)) * trayWordMultiplier;
    let messageSuffix = "";
    const nextComboMultiplier =
      comboWindowLeft > 0
        ? Math.min(COMBO_MAX_MULTIPLIER, comboMultiplier + COMBO_BONUS_STEP)
        : 1;
    awardedPoints = Math.round(awardedPoints * nextComboMultiplier);
    setComboMultiplier(nextComboMultiplier);
    setComboWindowLeft(COMBO_WINDOW_SECONDS);
    if (nextComboMultiplier > comboMultiplier) {
      setComboPulse(true);
      pushFeedbackBurst(`x${nextComboMultiplier.toFixed(2)}`, "combo", 800);
    }
    if (nextComboMultiplier > 1) {
      messageSuffix += t.comboSuffix(nextComboMultiplier);
    }

    setScore((prev) => prev + awardedPoints);
    pushFeedbackBurst(`+${awardedPoints}`, "score");
    setSubmittedWords((prev) => [
      ...prev,
      { word: resolvedWord.toLocaleUpperCase(language), points: awardedPoints }
    ]);
    setTray([]);
    setStatus(t.statusGreatWord(resolvedWord.toLocaleUpperCase(language), awardedPoints, messageSuffix));
  }

  useEffect(() => {
    if (!comboPulse) return undefined;
    const timeout = setTimeout(() => setComboPulse(false), 260);
    return () => clearTimeout(timeout);
  }, [comboPulse]);

  function removeLastFromTray() {
    if (!isRunning || isPaused || isRefreshing) return;

    setTray((prev) => {
      for (let index = prev.length - 1; index >= 0; index -= 1) {
        if (!prev[index].locked) {
          return [...prev.slice(0, index), ...prev.slice(index + 1)];
        }
      }
      return prev;
    });
  }

  function clearTray() {
    if (!isRunning || isPaused || isRefreshing) return;
    setTray([]);
  }

  function activatePowerUp(event: SyntheticEvent) {
    stopEvent(event);
    if (!isRunning || isPaused || isRefreshing || !powerUp) return;

    const { kind } = powerUp;
    setPowerUp(null);
    powerUpRespawnAtRef.current = performance.now() + effectivePowerUpRespawnMs;
    const capDuration = (seconds: number) => Math.min(seconds, MAX_EFFECT_SECONDS);

    if (kind === "bomb") {
      setTiles((prev) => {
        if (prev.length === 0) return prev;
        const index = Math.floor(Math.random() * prev.length);
        const next = [...prev.slice(0, index), ...prev.slice(index + 1)];
        while (next.length < activeTileTarget) {
          next.push(makeTile(idRef.current++, language, speedMultiplier));
        }
        return next;
      });
      setExplosionPulse(true);
      setStatus(t.powerUpActivated.bomb);
      return;
    }

    if (kind === "multiplier") {
      setMultiplierLeft(capDuration(POWERUP_META.multiplier.durationSeconds ?? 12));
      setStatus(t.powerUpActivated.multiplier);
      return;
    }

    if (kind === "freeze") {
      setFreezeLeft(capDuration(POWERUP_META.freeze.durationSeconds ?? 5));
      setStatus(t.powerUpActivated.freeze);
      return;
    }

    if (kind === "wall") {
      setWallLeft(capDuration(POWERUP_META.wall.durationSeconds ?? 15));
      setStatus(t.powerUpActivated.wall);
      return;
    }

    if (kind === "slow") {
      setSlowLeft(capDuration(POWERUP_META.slow.durationSeconds ?? 8));
      setStatus(t.powerUpActivated.slow);
      return;
    }

    if (kind === "extra-time") {
      setTimeLeft((prev) => prev + 10);
      setStatus(t.powerUpActivated["extra-time"]);
      return;
    }

    setTimeLeft((prev) => prev + 15);
    setStatus(t.powerUpActivated["extra-time-15"]);
  }

  function restartRound() {
    if (isGameOver) {
      startNewGame();
      return;
    }
    resetRoundState(false);
    setIsMenuOpen(false);
    setIsHelpModalOpen(false);
    setIsBetweenRounds(false);
  }

  function startNewGame() {
    resetRoundState(true);
    setIsMenuOpen(false);
    setIsHelpModalOpen(false);
  }

  function startNextRound() {
    if (!canAdvanceRound) return;
    const nextRound = currentRound + 1;
    setCurrentRound(nextRound);
    setIsBetweenRounds(false);
    resetRoundState(false, nextRound);
  }

  function togglePauseResume() {
    if (!isRunning) return;
    setIsPaused((prev) => {
      const next = !prev;
      setStatus(next ? t.pausedStatus : t.initialStatus);
      return next;
    });
  }

  function handleFieldPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function handleFieldPointerLeave() {
    pointerRef.current = null;
  }

  return (
    <>
      <HelpModal
        isOpen={isHelpModalOpen}
        powerUpOrder={POWERUP_TYPES}
        powerUpHelpByKind={t.powerUpHelp}
        onClose={() => setIsHelpModalOpen(false)}
        labels={{
          title: t.helpTitle,
          howToTitle: t.helpHowToTitle,
          lineBuildWords: t.helpLineBuildWords,
          lineTapLetters: t.helpLineTapLetters,
          lineSubmitValid: t.helpLineSubmitValid,
          linePowerUps: t.helpLinePowerUps,
          scoringTitle: t.helpScoringTitle,
          lineBonusTiles: t.helpLineBonusTiles,
          lineWordMultiplierStack: t.helpLineWordMultiplierStack,
          roundsTitle: t.helpRoundsTitle,
          lineRoundsGoal: t.helpLineRoundsGoal,
          lineRoundsEnd: t.helpLineRoundsEnd,
          powerUpsTitle: t.helpPowerUpsTitle,
          close: t.closeHelp
        }}
      />

      {isBetweenRounds && (
        <div className="modalBackdrop" role="presentation">
          <section className="languageModal" role="dialog" aria-modal="true" aria-label={t.nextRound}>
            <h2>{canAdvanceRound ? t.nextRound : t.restartRound}</h2>
            <p>
              {canAdvanceRound ? `${t.round} ${currentRound + 1}` : t.statusScoreRequired(goalConfig.score)}
            </p>
            <p>{t.goalScore(goalConfig.score)}: {roundScore}/{goalConfig.score}</p>
            <button type="button" onClick={canAdvanceRound ? startNextRound : restartRound}>
              {canAdvanceRound ? t.nextRound : t.restartRound}
            </button>
          </section>
        </div>
      )}

      {isGameOver && (
        <div className="modalBackdrop" role="presentation">
          <section className="languageModal" role="dialog" aria-modal="true" aria-label={t.matchComplete}>
            <h2>{t.matchComplete}</h2>
            <p>{t.finalScore}: {score}</p>
            <p>{t.statusScoreRequired(goalConfig.score)}</p>
            <button type="button" onClick={startNewGame}>
              {t.playMatchAgain}
            </button>
          </section>
        </div>
      )}

      <section className="topBar">
        <h1>{t.title}</h1>
        <GameMenu
          isOpen={isMenuOpen}
          isPaused={isPaused}
          isRunning={isRunning}
          onToggle={() => setIsMenuOpen((prev) => !prev)}
          onPauseResume={togglePauseResume}
          onOpenOptions={() => {
            onOpenOptions();
            setIsMenuOpen(false);
          }}
          onOpenHelp={() => {
            if (isRunning && !isPaused) {
              setIsPaused(true);
              setStatus(t.pausedStatus);
            }
            setIsHelpModalOpen(true);
            setIsMenuOpen(false);
          }}
          onNewGame={startNewGame}
          labels={{
            menuButton: t.menuButton,
            menuTitle: t.menuTitle,
            options: t.options,
            help: t.help,
            pause: t.pause,
            resume: t.resume,
            newGame: t.newGame,
            closeMenu: t.closeMenu
          }}
        />
      </section>

      <section className="gameLayout">
        <section className="boardColumn">
          <GameField
            tiles={tiles}
            powerUp={powerUp}
            isRunning={isRunning}
            isRefreshing={isRefreshing || isPaused}
            explosionPulse={explosionPulse}
            feedbackBursts={feedbackBursts}
            onCollectTile={collectTile}
            onActivatePowerUp={activatePowerUp}
            onPointerMove={handleFieldPointerMove}
            onPointerLeave={handleFieldPointerLeave}
            powerUpHelpByKind={t.powerUpHelp}
          />
          <p className="status statusUnderBoard">{status}</p>
        </section>

        <section className="rightColumn">
          <GameHud
            roundScoreProgress={`${roundScore}/${goalConfig.score}`}
            totalScore={score}
            timeLeft={timeLeft}
            roundLabel={`${currentRound}`}
            comboLabel={comboWindowLeft > 0 ? `x${comboMultiplier.toFixed(2)} (${comboWindowLeft}s)` : "x1.00"}
            comboIsPulsing={comboPulse}
            letterCount={tiles.length}
            languageLabel={LANGUAGE_OPTIONS.find((option) => option.code === language)?.label ?? language}
            labels={{
              roundScore: t.roundScore,
              totalScore: t.totalScore,
              round: t.round,
              combo: t.combo,
              timeLeft: t.timeLeft,
              flyingLetters: t.flyingLetters,
              language: t.language
            }}
          />

          <GameSidePanel
            tray={tray}
            trayBaseScore={trayBaseScore}
            trayLengthBonus={trayLengthBonus}
            trayWordMultiplier={trayWordMultiplier}
            trayScore={trayScore}
            isChecking={isChecking}
            submitDisabled={!canSubmit}
            isRunning={isRunning}
            isRefreshing={isRefreshing || isPaused}
            activeEffects={activeEffects}
            submittedWords={submittedWords}
            onSubmitWord={submitWord}
            onBackspace={removeLastFromTray}
            onClear={clearTray}
            onRestart={startNewGame}
            labels={{
              trayPlaceholder: t.trayPlaceholder,
              wordPoints: t.wordPoints,
              submitWord: t.submitWord,
              checking: t.checking,
              backspace: t.backspace,
              clear: t.clear,
              restartRound: t.newGame,
              playAgain: t.newGame,
              acceptedWords: t.acceptedWords,
              noneYet: t.noneYet,
              effects: t.effects,
              noEffects: t.noEffects
            }}
          />
        </section>
      </section>
    </>
  );
}
