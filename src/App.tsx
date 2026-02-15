import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type SyntheticEvent
} from "react";

import { GameField } from "./components/GameField";
import { GameHud } from "./components/GameHud";
import { GameSidePanel } from "./components/GameSidePanel";
import {
  BASE_TILE_COUNT,
  EXPLOSION_MS,
  MAX_EFFECT_SECONDS,
  POWERUP_SIZE,
  POWERUP_META,
  POWERUP_RESPAWN_MS,
  REFRESH_SPAWN_MS,
  ROUND_SECONDS,
  TILE_SIZE
} from "./game/constants";
import {
  isRealWord,
  makePowerUp,
  makeTile,
  updateMovingEntity,
  wildcardCandidates
} from "./game/logic";
import type { Letter, PowerUp, SubmittedWord, Tile, TrayTile } from "./game/types";

function stopEvent(event: SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

export default function App() {
  const idRef = useRef(1);
  const frameRef = useRef<number | null>(null);
  const tickRef = useRef(0);
  const powerUpRespawnAtRef = useRef(0);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const validateSeqRef = useRef(0);

  const [tiles, setTiles] = useState<Tile[]>(() =>
    Array.from({ length: BASE_TILE_COUNT }, () => makeTile(idRef.current++))
  );
  const [tray, setTray] = useState<TrayTile[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Tap flying letters to build a word.");
  const [submittedWords, setSubmittedWords] = useState<SubmittedWord[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [wordValidation, setWordValidation] = useState<"too-short" | "checking" | "valid" | "invalid">(
    "too-short"
  );
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  const [powerUp, setPowerUp] = useState<PowerUp | null>(() => makePowerUp(idRef.current++, "bomb"));
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

  const activeTileTarget = isMultiplierActive ? BASE_TILE_COUNT * 2 : BASE_TILE_COUNT;

  useEffect(() => {
    const loop = (now: number) => {
      if (!tickRef.current) tickRef.current = now;
      const dtBase = Math.min(0.05, (now - tickRef.current) / 1000);
      tickRef.current = now;

      if (!isRunning) {
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

            return updateMovingEntity(candidate, TILE_SIZE, dt);
          })
          .filter((value): value is Tile => value !== null);

        while (!isRefreshing && nextTiles.length < activeTileTarget) {
          nextTiles.push(makeTile(idRef.current++));
        }

        return nextTiles;
      });

      setPowerUp((prevPowerUp) => {
        if (!prevPowerUp) {
          if (!isRefreshing && now >= powerUpRespawnAtRef.current) {
            return makePowerUp(idRef.current++);
          }
          return prevPowerUp;
        }

        const moved = updateMovingEntity(prevPowerUp, POWERUP_SIZE, dt);
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
  }, [isRunning, isRefreshing, activeTileTarget, isFrozen, isSlowActive, isMagnetActive]);

  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setStatus("Time is up. Submit again after restart.");
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
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || !isRefreshing) return undefined;
    const interval = setInterval(() => {
      setTiles((prev) => {
        if (prev.length >= activeTileTarget) return prev;
        return [...prev, makeTile(idRef.current++)];
      });
    }, REFRESH_SPAWN_MS);
    return () => clearInterval(interval);
  }, [isRunning, isRefreshing, activeTileTarget]);

  useEffect(() => {
    if (!isRefreshing || tiles.length < activeTileTarget) return;
    setIsRefreshing(false);
    powerUpRespawnAtRef.current = performance.now() + 250;
    setStatus("Bomb refresh complete.");
  }, [isRefreshing, tiles.length, activeTileTarget]);

  useEffect(() => {
    if (!explosionPulse) return undefined;
    const timeout = setTimeout(() => setExplosionPulse(false), EXPLOSION_MS);
    return () => clearTimeout(timeout);
  }, [explosionPulse]);

  const trayWord = useMemo(() => tray.map((tile) => tile.char).join(""), [tray]);
  const trayScore = useMemo(() => tray.reduce((sum, tile) => sum + tile.value, 0), [tray]);
  const canSubmit = isRunning && !isRefreshing && !isChecking && wordValidation === "valid";

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
  }, [tray, isRunning, isRefreshing]);

  const activeEffects = useMemo(() => {
    const effects: string[] = [];
    if (isMultiplierActive) effects.push(`x2 ${multiplierLeft}s`);
    if (isFrozen) effects.push(`Freeze ${freezeLeft}s`);
    if (isShieldActive) effects.push(`Shield ${shieldLeft}s`);
    if (isSlowActive) effects.push(`Slow ${slowLeft}s`);
    if (isMagnetActive) effects.push(`Magnet ${magnetLeft}s`);
    if (isDoubleWordReady) effects.push(`DoubleWord ${doubleWordLeft}s`);
    if (lockLetterCharges > 0) effects.push(`Lock x${lockLetterCharges} ${lockLeft}s`);
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
    lockLeft
  ]);

  function collectTile(tileId: number) {
    if (!isRunning || isRefreshing) return;
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
        nextTiles.push(makeTile(idRef.current++));
      }
      return nextTiles;
    });
  }

  async function resolveSubmittedWord(chars: Array<Letter | "*">): Promise<string | null> {
    const candidates = wildcardCandidates(chars);
    if (candidates.length === 0) return null;

    for (const candidate of candidates) {
      const isValid = await isRealWord(candidate.toLowerCase());
      if (isValid) return candidate;
    }

    return null;
  }

  async function submitWord() {
    if (isChecking || !isRunning || isRefreshing) return;
    if (tray.length < 4) {
      setStatus("Word must have at least 4 letters.");
      return;
    }
    if (wordValidation !== "valid") {
      setStatus("Current tray is not a valid word.");
      return;
    }

    const chars = tray.map((tile) => tile.char);

    setIsChecking(true);
    setStatus(`Checking "${chars.join("").toLowerCase()}"...`);
    const resolvedWord = await resolveSubmittedWord(chars);
    setIsChecking(false);

    if (!resolvedWord) {
      setStatus("No valid dictionary word for this letter set.");
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
    setSubmittedWords((prev) => [...prev, { word: resolvedWord.toUpperCase(), points: awardedPoints }]);
    setTray([]);
    setStatus(`Great word: ${resolvedWord.toUpperCase()} (+${awardedPoints})${messageSuffix}`);
  }

  function removeLastFromTray() {
    if (!isRunning || isRefreshing || isShieldActive) return;

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
    if (!isRunning || isRefreshing || isShieldActive) return;
    setTray((prev) => prev.filter((tile) => tile.locked));
  }

  function replaceTilesByPredicate(predicate: (tile: Tile) => boolean) {
    setTiles((prev) =>
      prev.map((tile) => {
        if (!predicate(tile)) return tile;
        return makeTile(idRef.current++);
      })
    );
  }

  function activatePowerUp(event: SyntheticEvent) {
    stopEvent(event);
    if (!isRunning || isRefreshing || !powerUp) return;

    const { kind } = powerUp;
    setPowerUp(null);
    powerUpRespawnAtRef.current = performance.now() + POWERUP_RESPAWN_MS;
    const capDuration = (seconds: number) => Math.min(seconds, MAX_EFFECT_SECONDS);

    if (kind === "bomb") {
      setTiles([]);
      setIsRefreshing(true);
      setExplosionPulse(true);
      setStatus("Bomb triggered. Refreshing letters...");
      return;
    }

    if (kind === "multiplier") {
      setMultiplierLeft(capDuration(POWERUP_META.multiplier.durationSeconds ?? 12));
      setStatus("x2 activated.");
      return;
    }

    if (kind === "freeze") {
      setFreezeLeft(capDuration(POWERUP_META.freeze.durationSeconds ?? 5));
      setStatus("Freeze activated.");
      return;
    }

    if (kind === "shield") {
      setShieldLeft(capDuration(POWERUP_META.shield.durationSeconds ?? 10));
      setStatus("Shield activated.");
      return;
    }

    if (kind === "wild") {
      setTray((prev) => [
        ...prev,
        { id: idRef.current++, char: "*", value: 0, wildcard: true }
      ]);
      setStatus("Wildcard added to tray.");
      return;
    }

    if (kind === "reroll") {
      replaceTilesByPredicate((tile) => tile.value === 1);
      setStatus("Rerolled low-value letters.");
      return;
    }

    if (kind === "slow") {
      setSlowLeft(capDuration(POWERUP_META.slow.durationSeconds ?? 8));
      setStatus("Slow Time activated.");
      return;
    }

    if (kind === "double") {
      setDoubleWordLeft(MAX_EFFECT_SECONDS);
      setStatus("Double Word ready for next valid submit.");
      return;
    }

    if (kind === "magnet") {
      setMagnetLeft(capDuration(POWERUP_META.magnet.durationSeconds ?? 8));
      setStatus("Magnet activated.");
      return;
    }

    if (kind === "extra-time") {
      setTimeLeft((prev) => prev + 10);
      setStatus("+10 seconds added.");
      return;
    }

    if (kind === "lock") {
      setLockLetterCharges((prev) => prev + 1);
      setLockLeft(MAX_EFFECT_SECONDS);
      setStatus("Lock charge added to next collected letter.");
      return;
    }

    replaceTilesByPredicate((tile) => tile.value >= 8);
    setStatus("Purged rare letters.");
  }

  function restartGame() {
    idRef.current = 1;
    tickRef.current = 0;
    powerUpRespawnAtRef.current = 0;
    pointerRef.current = null;

    setTiles(Array.from({ length: BASE_TILE_COUNT }, () => makeTile(idRef.current++)));
    setTray([]);
    setScore(0);
    setSubmittedWords([]);
    setIsChecking(false);
    setTimeLeft(ROUND_SECONDS);
    setIsRunning(true);
    setPowerUp(makePowerUp(idRef.current++, "bomb"));
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

    setStatus("Tap flying letters to build a word.");
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
    <main className="app">
      <h1>Scrabble Bounce</h1>
      <p className="status">{status}</p>

      <GameHud
        score={score}
        timeLeft={timeLeft}
        letterCount={tiles.length}
        targetCount={activeTileTarget}
        activeEffects={activeEffects}
      />

      <section className="gameLayout">
        <GameField
          tiles={tiles}
          powerUp={powerUp}
          isRunning={isRunning}
          isRefreshing={isRefreshing}
          explosionPulse={explosionPulse}
          onCollectTile={collectTile}
          onActivatePowerUp={activatePowerUp}
          onPointerMove={handleFieldPointerMove}
          onPointerLeave={handleFieldPointerLeave}
        />

        <GameSidePanel
          tray={tray}
          trayWord={trayWord}
          trayScore={trayScore}
          isChecking={isChecking}
          submitDisabled={!canSubmit}
          isRunning={isRunning}
          isRefreshing={isRefreshing}
          isShieldActive={isShieldActive}
          submittedWords={submittedWords}
          onSubmitWord={submitWord}
          onBackspace={removeLastFromTray}
          onClear={clearTray}
          onRestart={restartGame}
        />
      </section>
    </main>
  );
}
