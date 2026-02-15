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
  EXPLOSION_MS,
  MAX_EFFECT_SECONDS,
  POWERUP_SIZE,
  POWERUP_META,
  POWERUP_RESPAWN_MS,
  POWERUP_TYPES,
  REFRESH_SPAWN_MS,
  TILE_SIZE,
  type BaseTileCount,
  type MaxBounces,
  type RoundDurationSeconds,
  type SpeedMultiplier
} from "../game/constants";
import { dictionaryLocale, LANGUAGE_OPTIONS, type LanguageCode, UI_TEXT } from "../game/i18n";
import { isRealWord, makePowerUp, makeTile, updateMovingEntity, wildcardCandidates } from "../game/logic";
import type { Letter, PowerUp, PowerUpKind, SubmittedWord, Tile, TrayTile } from "../game/types";
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
  onOpenOptions: () => void;
};

export function GameBoard({
  language,
  roundSeconds,
  baseTileCount,
  speedMultiplier,
  maxBounces,
  onOpenOptions
}: GameBoardProps) {
  const t = UI_TEXT[language];

  const idRef = useRef(1);
  const frameRef = useRef<number | null>(null);
  const tickRef = useRef(0);
  const powerUpRespawnAtRef = useRef(0);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const validateSeqRef = useRef(0);
  const mountedRef = useRef(false);

  const [tiles, setTiles] = useState<Tile[]>(() =>
    Array.from({ length: BASE_TILE_COUNT }, () => makeTile(idRef.current++, language, speedMultiplier))
  );
  const [tray, setTray] = useState<TrayTile[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState(t.initialStatus);
  const [submittedWords, setSubmittedWords] = useState<SubmittedWord[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [wordValidation, setWordValidation] = useState<"too-short" | "checking" | "valid" | "invalid">(
    "too-short"
  );
  const [timeLeft, setTimeLeft] = useState(roundSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const [powerUp, setPowerUp] = useState<PowerUp | null>(() =>
    makePowerUp(idRef.current++, "bomb", speedMultiplier)
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [explosionPulse, setExplosionPulse] = useState(false);

  const [multiplierLeft, setMultiplierLeft] = useState(0);
  const [freezeLeft, setFreezeLeft] = useState(0);
  const [shieldLeft, setShieldLeft] = useState(0);
  const [slowLeft, setSlowLeft] = useState(0);
  const [magnetLeft, setMagnetLeft] = useState(0);
  const [doubleWordLeft, setDoubleWordLeft] = useState(0);
  const [lockLetterCharges, setLockLetterCharges] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);

  const isMultiplierActive = multiplierLeft > 0;
  const isFrozen = freezeLeft > 0;
  const isShieldActive = shieldLeft > 0;
  const isSlowActive = slowLeft > 0;
  const isMagnetActive = magnetLeft > 0;
  const isDoubleWordReady = doubleWordLeft > 0;

  const activeTileTarget = isMultiplierActive ? baseTileCount * 2 : baseTileCount;
  const powerUpLabelByKind = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(POWERUP_META).map(([kind, meta]) => [kind, meta.label])
      ) as Record<PowerUpKind, string>,
    []
  );

  function resetRoundState(resetScore: boolean) {
    idRef.current = 1;
    tickRef.current = 0;
    powerUpRespawnAtRef.current = 0;
    pointerRef.current = null;

    setTiles(Array.from({ length: baseTileCount }, () => makeTile(idRef.current++, language, speedMultiplier)));
    setTray([]);
    setIsChecking(false);
    setTimeLeft(roundSeconds);
    setIsRunning(true);
    setIsPaused(false);
    setPowerUp(makePowerUp(idRef.current++, "bomb", speedMultiplier));
    setIsRefreshing(false);
    setExplosionPulse(false);

    setMultiplierLeft(0);
    setFreezeLeft(0);
    setShieldLeft(0);
    setSlowLeft(0);
    setMagnetLeft(0);
    setDoubleWordLeft(0);
    setLockLetterCharges(0);
    setLockLeft(0);

    if (resetScore) {
      setScore(0);
      setSubmittedWords([]);
    }

    setStatus(UI_TEXT[language].initialStatus);
  }

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    resetRoundState(true);
  }, [language, roundSeconds, baseTileCount, speedMultiplier, maxBounces]);

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
      const dt = dtBase * speedFactor;

      setTiles((prevTiles) => {
        const nextTiles = prevTiles
          .map((tile) => {
            let candidate: Tile = tile;

            if (isMagnetActive && pointerRef.current && tile.state !== "exiting") {
              const centerX = tile.x + TILE_SIZE / 2;
              const centerY = tile.y + TILE_SIZE / 2;
              const dx = pointerRef.current.x - centerX;
              const dy = pointerRef.current.y - centerY;
              const dist = Math.hypot(dx, dy) || 1;
              const accel = 230 * dt;
              candidate = {
                ...tile,
                vx: tile.vx + (dx / dist) * accel,
                vy: tile.vy + (dy / dist) * accel
              };
            }

            return updateMovingEntity(candidate, TILE_SIZE, dt, maxBounces);
          })
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
          powerUpRespawnAtRef.current = now + POWERUP_RESPAWN_MS;
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
    isMagnetActive,
    maxBounces,
    speedMultiplier,
    language
  ]);

  useEffect(() => {
    if (!isRunning || isPaused) return undefined;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setStatus(t.timeUpStatus);
          return 0;
        }
        return prev - 1;
      });

      setMultiplierLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setFreezeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setShieldLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setSlowLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setMagnetLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setDoubleWordLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setLockLeft((prev) => {
        if (prev <= 0) return 0;
        const next = prev - 1;
        if (next === 0) setLockLetterCharges(0);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, t.timeUpStatus]);

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

  const trayWord = useMemo(() => tray.map((tile) => tile.char).join(""), [tray]);
  const trayScore = useMemo(() => tray.reduce((sum, tile) => sum + tile.value, 0), [tray]);
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
    if (isShieldActive) effects.push(`${t.effectShield} ${shieldLeft}s`);
    if (isSlowActive) effects.push(`${t.effectSlow} ${slowLeft}s`);
    if (isMagnetActive) effects.push(`${t.effectMagnet} ${magnetLeft}s`);
    if (isDoubleWordReady) effects.push(`${t.effectDoubleWord} ${doubleWordLeft}s`);
    if (lockLetterCharges > 0) effects.push(`${t.effectLock} x${lockLetterCharges} ${lockLeft}s`);
    return effects;
  }, [
    isMultiplierActive,
    multiplierLeft,
    isFrozen,
    freezeLeft,
    isShieldActive,
    shieldLeft,
    isSlowActive,
    slowLeft,
    isMagnetActive,
    magnetLeft,
    isDoubleWordReady,
    doubleWordLeft,
    lockLetterCharges,
    lockLeft,
    t.effectX2,
    t.effectFreeze,
    t.effectShield,
    t.effectSlow,
    t.effectMagnet,
    t.effectDoubleWord,
    t.effectLock
  ]);

  function collectTile(tileId: number) {
    if (!isRunning || isPaused || isRefreshing) return;
    const shouldLock = lockLetterCharges > 0;

    setTiles((prev) => {
      const found = prev.find((tile) => tile.id === tileId);
      if (!found) return prev;

      setTray((old) => [
        ...old,
        {
          char: found.char,
          value: found.value,
          id: found.id,
          locked: shouldLock
        }
      ]);

      if (shouldLock) {
        setLockLetterCharges((charges) => Math.max(charges - 1, 0));
      }

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
      const isValid = await isRealWord(candidate.toLowerCase(), dictionaryLocale(language));
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

    let awardedPoints = trayScore;
    let messageSuffix = "";
    if (isDoubleWordReady) {
      awardedPoints *= 2;
      messageSuffix = " with Double Word";
      setDoubleWordLeft(0);
    }

    setScore((prev) => prev + awardedPoints);
    setSubmittedWords((prev) => [
      ...prev,
      { word: resolvedWord.toLocaleUpperCase(language), points: awardedPoints }
    ]);
    setTray([]);
    setStatus(t.statusGreatWord(resolvedWord.toLocaleUpperCase(language), awardedPoints, messageSuffix));
  }

  function removeLastFromTray() {
    if (!isRunning || isPaused || isRefreshing || isShieldActive) return;

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
    if (!isRunning || isPaused || isRefreshing || isShieldActive) return;
    setTray((prev) => prev.filter((tile) => tile.locked));
  }

  function replaceTilesByPredicate(predicate: (tile: Tile) => boolean) {
    setTiles((prev) =>
      prev.map((tile) => {
        if (!predicate(tile)) return tile;
        return makeTile(idRef.current++, language, speedMultiplier);
      })
    );
  }

  function activatePowerUp(event: SyntheticEvent) {
    stopEvent(event);
    if (!isRunning || isPaused || isRefreshing || !powerUp) return;

    const { kind } = powerUp;
    setPowerUp(null);
    powerUpRespawnAtRef.current = performance.now() + POWERUP_RESPAWN_MS;
    const capDuration = (seconds: number) => Math.min(seconds, MAX_EFFECT_SECONDS);

    if (kind === "bomb") {
      setTiles([]);
      setIsRefreshing(true);
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

    if (kind === "shield") {
      setShieldLeft(capDuration(POWERUP_META.shield.durationSeconds ?? 10));
      setStatus(t.powerUpActivated.shield);
      return;
    }

    if (kind === "wild") {
      setTray((prev) => [...prev, { id: idRef.current++, char: "*", value: 0, wildcard: true }]);
      setStatus(t.powerUpActivated.wild);
      return;
    }

    if (kind === "reroll") {
      replaceTilesByPredicate((tile) => tile.value === 1);
      setStatus(t.powerUpActivated.reroll);
      return;
    }

    if (kind === "slow") {
      setSlowLeft(capDuration(POWERUP_META.slow.durationSeconds ?? 8));
      setStatus(t.powerUpActivated.slow);
      return;
    }

    if (kind === "double") {
      setDoubleWordLeft(MAX_EFFECT_SECONDS);
      setStatus(t.powerUpActivated.double);
      return;
    }

    if (kind === "magnet") {
      setMagnetLeft(capDuration(POWERUP_META.magnet.durationSeconds ?? 8));
      setStatus(t.powerUpActivated.magnet);
      return;
    }

    if (kind === "extra-time") {
      setTimeLeft((prev) => prev + 10);
      setStatus(t.powerUpActivated["extra-time"]);
      return;
    }

    if (kind === "lock") {
      setLockLetterCharges((prev) => prev + 1);
      setLockLeft(MAX_EFFECT_SECONDS);
      setStatus(t.powerUpActivated.lock);
      return;
    }

    replaceTilesByPredicate((tile) => tile.value >= 8);
    setStatus(t.powerUpActivated.purge);
  }

  function restartRound() {
    resetRoundState(false);
    setIsMenuOpen(false);
    setIsHelpModalOpen(false);
  }

  function startNewGame() {
    resetRoundState(true);
    setIsMenuOpen(false);
    setIsHelpModalOpen(false);
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
        powerUpLabelByKind={powerUpLabelByKind}
        powerUpHelpByKind={t.powerUpHelp}
        onClose={() => setIsHelpModalOpen(false)}
        labels={{
          title: t.helpTitle,
          howToTitle: t.helpHowToTitle,
          lineBuildWords: t.helpLineBuildWords,
          lineTapLetters: t.helpLineTapLetters,
          lineSubmitValid: t.helpLineSubmitValid,
          linePowerUps: t.helpLinePowerUps,
          powerUpsTitle: t.helpPowerUpsTitle,
          close: t.closeHelp
        }}
      />

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
            setIsHelpModalOpen(true);
            setIsMenuOpen(false);
          }}
          onRestartRound={() => {
            restartRound();
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
            restartRound: t.restartRound,
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
            onCollectTile={collectTile}
            onActivatePowerUp={activatePowerUp}
            onPointerMove={handleFieldPointerMove}
            onPointerLeave={handleFieldPointerLeave}
            powerUpHelpByKind={t.powerUpHelp}
            powerUpLabelByKind={powerUpLabelByKind}
          />
          <p className="status statusUnderBoard">{status}</p>
        </section>

        <section className="rightColumn">
          <GameHud
            score={score}
            timeLeft={timeLeft}
            letterCount={tiles.length}
            targetCount={activeTileTarget}
            languageLabel={LANGUAGE_OPTIONS.find((option) => option.code === language)?.label ?? language}
            labels={{
              totalScore: t.totalScore,
              timeLeft: t.timeLeft,
              flyingLetters: t.flyingLetters,
              target: t.target,
              language: t.language
            }}
          />

          <GameSidePanel
            tray={tray}
            trayWord={trayWord}
            trayScore={trayScore}
            isChecking={isChecking}
            submitDisabled={!canSubmit}
            isRunning={isRunning}
            isRefreshing={isRefreshing || isPaused}
            isShieldActive={isShieldActive}
            activeEffects={activeEffects}
            submittedWords={submittedWords}
            onSubmitWord={submitWord}
            onBackspace={removeLastFromTray}
            onClear={clearTray}
            onRestart={restartRound}
            labels={{
              trayPlaceholder: t.trayPlaceholder,
              wordPoints: t.wordPoints,
              submitWord: t.submitWord,
              checking: t.checking,
              backspace: t.backspace,
              clear: t.clear,
              restartRound: t.restartRound,
              playAgain: t.playAgain,
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
