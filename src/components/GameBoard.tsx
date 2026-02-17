import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from "react";

import {
  BASE_TILE_COUNT,
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
import { makePowerUp, makeTile, updateMovingEntity } from "../game/logic";
import { rollGoalConfig } from "../game/rounds";
import type { PowerUp, Tile } from "../game/types";
import { useWordTray } from "../hooks/useWordTray";
import { GameField } from "./GameField";
import { GameHud } from "./GameHud";
import { GameMenu } from "./GameMenu";
import { GameSidePanel } from "./GameSidePanel";
import { HelpModal } from "./HelpModal";

function stopEvent(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

type GameBoardProps = {
  language: LanguageCode;
  roundSeconds: RoundDurationSeconds;
  baseTileCount: BaseTileCount;
  speedMultiplier: SpeedMultiplier;
  maxBounces: MaxBounces;
  powerUpRespawnMs: number;
  isOptionsOpen: boolean;
  onOpenOptions: () => void;
};

export function GameBoard({
  language,
  roundSeconds,
  baseTileCount,
  speedMultiplier,
  maxBounces,
  powerUpRespawnMs,
  isOptionsOpen,
  onOpenOptions
}: GameBoardProps) {
  const t = UI_TEXT[language];

  const idRef = useRef(1);
  const frameRef = useRef<number | null>(null);
  const tickRef = useRef(0);
  const feedbackIdRef = useRef(1);
  const powerUpRespawnAtRef = useRef(0);
  const mountedRef = useRef(false);
  const optionsAutoPausedRef = useRef(false);

  const [tiles, setTiles] = useState<Tile[]>(() =>
    Array.from({ length: BASE_TILE_COUNT }, () => makeTile(idRef.current++, language, speedMultiplier))
  );
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [status, setStatus] = useState(t.initialStatus);
  const [timeLeft, setTimeLeft] = useState<number>(roundSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpAutoPaused, setHelpAutoPaused] = useState(false);
  const [isBetweenRounds, setIsBetweenRounds] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [canAdvanceRound, setCanAdvanceRound] = useState(false);
  const [roundScoreStart, setRoundScoreStart] = useState(0);
  const [feedbackBursts, setFeedbackBursts] = useState<
    Array<{ id: number; text: string; tone: "score" | "bonus" }>
  >([]);

  const [powerUp, setPowerUp] = useState<PowerUp | null>(() =>
    makePowerUp(idRef.current++, "bomb", speedMultiplier)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [explosionPulse, setExplosionPulse] = useState(false);

  const [freezeLeft, setFreezeLeft] = useState(0);
  const [wallLeft, setWallLeft] = useState(0);
  const [slowLeft, setSlowLeft] = useState(0);

  const isFrozen = freezeLeft > 0;
  const isWallActive = wallLeft > 0;
  const isSlowActive = slowLeft > 0;
  const isEffectivelyPaused = isPaused || isOptionsOpen;
  const roundPaceMultiplier = 1 + (currentRound - 1) * ROUND_PACE_STEP;
  const effectivePowerUpRespawnMs = Math.max(650, Math.round(powerUpRespawnMs / roundPaceMultiplier));

  const activeTileTarget = baseTileCount;
  const [goalConfig, setGoalConfig] = useState(() => rollGoalConfig(1));
  const nextRoundGoalScore = rollGoalConfig(currentRound + 1).score;

  const roundScore = Math.max(0, score - roundScoreStart);
  const {
    tray,
    submittedWords,
    isChecking,
    canSubmit,
    trayBaseScore,
    trayWordMultiplier,
    trayLengthBonus,
    trayScore,
    appendTile,
    removeLast,
    clear,
    submitWord,
    resetWordState
  } = useWordTray({
    language,
    isRunning,
    isPaused,
    isRefreshing,
    text: {
      wordMin4: t.wordMin4,
      trayInvalid: t.trayInvalid,
      noValidWord: t.noValidWord,
      statusChecking: t.statusChecking
    },
    onSetStatus: setStatus,
    onAddScore: (points) => setScore((previous) => previous + points),
    onWordAccepted: (wordUpper, points) => {
      pushFeedbackBurst(`+${points}`, "score");
      setStatus(t.statusGreatWord(wordUpper, points, ""));
    }
  });
  function pushFeedbackBurst(text: string, tone: "score" | "bonus", lifetimeMs = 900) {
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

    setTiles(Array.from({ length: baseTileCount }, () => makeTile(idRef.current++, language, speedMultiplier)));
    resetWordState();
    setRoundScoreStart(nextScoreStart);
    setGoalConfig(rollGoalConfig(roundNumber));
    setCanAdvanceRound(false);
    setIsGameOver(false);
    setFeedbackBursts([]);
    setTimeLeft(roundSeconds);
    setIsRunning(true);
    setIsPaused(false);
    setPowerUp(makePowerUp(idRef.current++, "bomb", speedMultiplier));
    setIsRefreshing(false);
    setExplosionPulse(false);

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

      if (!isRunning || isEffectivelyPaused) {
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
          if (!isRefreshing && !isFrozen && now >= powerUpRespawnAtRef.current) {
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
    isEffectivelyPaused,
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
    if (!isRunning || isEffectivelyPaused) return undefined;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (isFrozen) return prev;
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

      setFreezeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setWallLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setSlowLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    isEffectivelyPaused,
    isFrozen,
    t.timeUpStatus,
    t.statusScoreRequired,
    t.round,
    currentRound,
    goalConfig,
    roundScore
  ]);

  useEffect(() => {
    if (isOptionsOpen) {
      if (isRunning && !isPaused) {
        setIsPaused(true);
        setStatus(t.pausedStatus);
        optionsAutoPausedRef.current = true;
      } else {
        optionsAutoPausedRef.current = false;
      }
      return;
    }

    if (optionsAutoPausedRef.current && isRunning) {
      setIsPaused(false);
      setStatus(t.initialStatus);
    }
    optionsAutoPausedRef.current = false;
  }, [isOptionsOpen, isRunning, isPaused, t.pausedStatus, t.initialStatus]);

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
    setStatus(t.bombRefreshComplete);
  }, [isRefreshing, tiles.length, activeTileTarget, t.bombRefreshComplete]);

  useEffect(() => {
    if (!explosionPulse) return undefined;
    const timeout = setTimeout(() => setExplosionPulse(false), EXPLOSION_MS);
    return () => clearTimeout(timeout);
  }, [explosionPulse]);

  const activeEffects = useMemo(() => {
    const effects: string[] = [];
    if (isFrozen) effects.push(`${t.effectFreeze} ${freezeLeft}s`);
    if (isWallActive) effects.push(`${t.effectWall} ${wallLeft}s`);
    if (isSlowActive) effects.push(`${t.effectSlow} ${slowLeft}s`);
    return effects;
  }, [
    isFrozen,
    freezeLeft,
    isWallActive,
    wallLeft,
    isSlowActive,
    slowLeft,
    t.effectFreeze,
    t.effectWall,
    t.effectSlow
  ]);

  function collectTile(tileId: number) {
    if (!isRunning || isPaused || isRefreshing) return;

    setTiles((prev) => {
      const found = prev.find((tile) => tile.id === tileId);
      if (!found) return prev;
      appendTile(found);

      const nextTiles = prev.filter((tile) => tile.id !== tileId);
      if (nextTiles.length < activeTileTarget) {
        nextTiles.push(makeTile(idRef.current++, language, speedMultiplier));
      }
      return nextTiles;
    });
  }

  function activatePowerUp(event: SyntheticEvent) {
    stopEvent(event);
    if (!isRunning || isPaused || isRefreshing || !powerUp) return;

    const { kind } = powerUp;
    setPowerUp(null);
    powerUpRespawnAtRef.current = performance.now() + effectivePowerUpRespawnMs;
    const capDuration = (seconds: number) => Math.min(seconds, MAX_EFFECT_SECONDS);

    if (kind === "bomb") {
      setTiles([]);
      setIsRefreshing(true);
      setExplosionPulse(true);
      setStatus(t.powerUpActivated.bomb);
      return;
    }

    if (kind === "freeze") {
      const freezeSeconds = capDuration(POWERUP_META.freeze.durationSeconds ?? 5);
      setFreezeLeft(freezeSeconds);
      powerUpRespawnAtRef.current = Math.max(
        powerUpRespawnAtRef.current,
        performance.now() + freezeSeconds * 1000
      );
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

  function closeHelpModal() {
    setIsHelpModalOpen(false);
    if (helpAutoPaused && isRunning) {
      setIsPaused(false);
      setStatus(t.initialStatus);
    }
    setHelpAutoPaused(false);
  }

  return (
    <>
      <HelpModal
        isOpen={isHelpModalOpen}
        powerUpOrder={POWERUP_TYPES}
        powerUpHelpByKind={t.powerUpHelp}
        onClose={closeHelpModal}
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
          <section className="languageModal roundIntroModal" role="dialog" aria-modal="true" aria-label={t.nextRound}>
            <h2>{t.round} {currentRound + 1}</h2>
            <p>{t.goalScore(nextRoundGoalScore)}</p>
            <button type="button" onClick={startNextRound}>
              {t.startRound}
            </button>
          </section>
        </div>
      )}

      {isGameOver && (
        <div className="modalBackdrop" role="presentation">
          <section className="languageModal" role="dialog" aria-modal="true" aria-label={t.matchComplete}>
            <h2>{t.matchComplete}</h2>
            <p>{t.totalScore}: {score}</p>
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
              setHelpAutoPaused(true);
            } else {
              setHelpAutoPaused(false);
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
            isRefreshing={isRefreshing || isEffectivelyPaused}
            explosionPulse={explosionPulse}
            isFreezeActive={isFrozen}
            isWallActive={isWallActive}
            isSlowActive={isSlowActive}
            feedbackBursts={feedbackBursts}
            onCollectTile={collectTile}
            onActivatePowerUp={activatePowerUp}
            onPointerMove={() => {}}
            onPointerLeave={() => {}}
            powerUpHelpByKind={t.powerUpHelp}
          />
          <p className="status statusUnderBoard">{status}</p>
        </section>

        <section className="rightColumn">
          <GameHud
            roundScoreProgress={`${roundScore}/${goalConfig.score}`}
            roundGoalMet={roundScore >= goalConfig.score}
            totalScore={score}
            timeLeft={timeLeft}
            roundLabel={`${currentRound}`}
            letterCount={tiles.length}
            languageLabel={LANGUAGE_OPTIONS.find((option) => option.code === language)?.label ?? language}
            labels={{
              roundScore: t.roundScore,
              totalScore: t.totalScore,
              round: t.round,
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
            isRefreshing={isRefreshing || isEffectivelyPaused}
            activeEffects={activeEffects}
            submittedWords={submittedWords}
            onSubmitWord={submitWord}
            onBackspace={removeLast}
            onClear={clear}
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
