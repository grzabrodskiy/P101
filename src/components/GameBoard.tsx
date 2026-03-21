import { useEffect, useMemo, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";

import {
  BASE_TILE_COUNT,
  EXPLOSION_MS,
  FIELD_SIZE,
  MAX_EFFECT_SECONDS,
  POWERUP_SIZE,
  POWERUP_META,
  POWERUP_TYPES,
  REFRESH_SPAWN_MS,
  ROUND_PACE_STEP,
  SCRABBLE_VALUES,
  TILE_SIZE,
  type BaseTileCount,
  type MaxBounces,
  type RoundDurationSeconds,
  type SpeedMultiplier
} from "../game/constants";
import { type LanguageCode, UI_TEXT } from "../game/i18n";
import { makePowerUp, makeTile, updateMovingEntity } from "../game/logic";
import { rollGoalConfig } from "../game/rounds";
import type { PowerUp, Tile } from "../game/types";
import { useWordTray } from "../hooks/useWordTray";
import { GameField } from "./GameField";
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

type BoardTheme = {
  glowTop: string;
  glowBottom: string;
  gridLine: string;
  backgroundStart: string;
  backgroundMid: string;
  backgroundEnd: string;
};

type BackFaceTile = {
  id: number;
  char: string;
  value: number;
  left: number;
  top: number;
  toneClass: string;
};

const BOARD_THEMES: BoardTheme[] = [
  {
    glowTop: "rgba(244, 234, 208, 0.12)",
    glowBottom: "rgba(25, 56, 104, 0.46)",
    gridLine: "rgba(236, 220, 188, 0.06)",
    backgroundStart: "#4a628f",
    backgroundMid: "#314768",
    backgroundEnd: "#121a28"
  },
  {
    glowTop: "rgba(245, 224, 210, 0.11)",
    glowBottom: "rgba(104, 24, 42, 0.44)",
    gridLine: "rgba(238, 215, 198, 0.05)",
    backgroundStart: "#6a3344",
    backgroundMid: "#482433",
    backgroundEnd: "#1c0d16"
  },
  {
    glowTop: "rgba(236, 231, 216, 0.1)",
    glowBottom: "rgba(27, 79, 122, 0.42)",
    gridLine: "rgba(228, 223, 212, 0.05)",
    backgroundStart: "#34557d",
    backgroundMid: "#213a57",
    backgroundEnd: "#0d1523"
  },
  {
    glowTop: "rgba(246, 226, 191, 0.12)",
    glowBottom: "rgba(124, 66, 18, 0.44)",
    gridLine: "rgba(240, 214, 176, 0.05)",
    backgroundStart: "#72522d",
    backgroundMid: "#4f381d",
    backgroundEnd: "#211509"
  },
  {
    glowTop: "rgba(236, 222, 246, 0.11)",
    glowBottom: "rgba(69, 33, 104, 0.44)",
    gridLine: "rgba(229, 214, 239, 0.05)",
    backgroundStart: "#5a4778",
    backgroundMid: "#3b2d52",
    backgroundEnd: "#170f22"
  },
  {
    glowTop: "rgba(243, 232, 211, 0.11)",
    glowBottom: "rgba(19, 44, 90, 0.46)",
    gridLine: "rgba(236, 220, 188, 0.05)",
    backgroundStart: "#314b76",
    backgroundMid: "#203250",
    backgroundEnd: "#0d1522"
  }
];

function blendColor(from: [number, number, number], to: [number, number, number], amount: number) {
  const mix = Math.max(0, Math.min(1, amount));
  const [r1, g1, b1] = from;
  const [r2, g2, b2] = to;
  const r = Math.round(r1 + (r2 - r1) * mix);
  const g = Math.round(g1 + (g2 - g1) * mix);
  const b = Math.round(b1 + (b2 - b1) * mix);
  return `rgb(${r}, ${g}, ${b})`;
}

function createSeededRandom(seed: number) {
  let state = (seed + 1) * 2654435761;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function makeBackFaceTiles(seed: number): BackFaceTile[] {
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const rows = 9;
  const columns = 9;
  const padding = 12;
  const gapX = (FIELD_SIZE - padding * 2 - columns * TILE_SIZE) / (columns - 1);
  const gapY = (FIELD_SIZE - padding * 2 - rows * TILE_SIZE) / (rows - 1);
  const random = createSeededRandom(seed);

  return Array.from({ length: rows * columns }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const char = glyphs[Math.floor(random() * glyphs.length)] ?? "E";
    const toneRoll = random();
    const toneClass =
      toneRoll > 0.94
        ? "tile-triple-word"
        : toneRoll > 0.87
          ? "tile-triple-letter"
          : toneRoll > 0.72
            ? "tile-double-word"
            : toneRoll > 0.5
              ? "tile-double-letter"
              : "";

    return {
      id: index,
      char,
      value: SCRABBLE_VALUES[char as keyof typeof SCRABBLE_VALUES] ?? 1,
      left: ((padding + column * (TILE_SIZE + gapX)) / FIELD_SIZE) * 100,
      top: ((padding + row * (TILE_SIZE + gapY)) / FIELD_SIZE) * 100,
      toneClass
    };
  });
}

function pickNextBoardTheme(currentIndex: number) {
  const candidates = BOARD_THEMES
    .map((_, index) => index)
    .filter((index) => index !== currentIndex);

  return candidates[Math.floor(Math.random() * candidates.length)] ?? currentIndex;
}

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
  const menuAutoPausedRef = useRef(false);
  const optionsAutoPausedRef = useRef(false);
  const announcementTimeoutRef = useRef<number | null>(null);
  const roundFlipTimeoutRef = useRef<number | null>(null);

  const [tiles, setTiles] = useState<Tile[]>(() =>
    Array.from({ length: BASE_TILE_COUNT }, () => makeTile(idRef.current++, language, speedMultiplier))
  );
  const [score, setScore] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [status, setStatus] = useState(t.initialStatus);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [statusFlash, setStatusFlash] = useState<string | null>(null);
  const [boardThemeIndex, setBoardThemeIndex] = useState(0);
  const [backFaceThemeIndex, setBackFaceThemeIndex] = useState(() => pickNextBoardTheme(0));
  const [isRoundFlipping, setIsRoundFlipping] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(roundSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpAutoPaused, setHelpAutoPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
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
  const isEffectivelyPaused = isPaused || isMenuOpen || isOptionsOpen || isHelpModalOpen;
  const roundPaceMultiplier = 1 + (currentRound - 1) * ROUND_PACE_STEP;
  const effectivePowerUpRespawnMs = Math.max(650, Math.round(powerUpRespawnMs / roundPaceMultiplier));

  const activeTileTarget = baseTileCount;
  const [goalConfig, setGoalConfig] = useState(() => rollGoalConfig(1));
  const roundScore = Math.max(0, score - roundScoreStart);
  const displayStatus = announcement ?? statusFlash;
  const shouldShowMessage = Boolean(displayStatus);
  const timePressure = 1 - Math.max(0, Math.min(1, timeLeft / roundSeconds));
  const timeColor = blendColor([243, 234, 215], [215, 98, 76], timePressure);
  const boardTheme = BOARD_THEMES[boardThemeIndex] ?? BOARD_THEMES[0];
  const backFaceTheme = BOARD_THEMES[backFaceThemeIndex] ?? boardTheme;
  const backFaceTiles = useMemo(() => makeBackFaceTiles(backFaceThemeIndex + currentRound), [backFaceThemeIndex, currentRound]);
  const tileSizePercent = `${(TILE_SIZE / FIELD_SIZE) * 100}%`;
  const boardThemeStyle = {
    "--board-glow-top": boardTheme.glowTop,
    "--board-glow-bottom": boardTheme.glowBottom,
    "--board-grid-line": boardTheme.gridLine,
    "--board-bg-start": boardTheme.backgroundStart,
    "--board-bg-mid": boardTheme.backgroundMid,
    "--board-bg-end": boardTheme.backgroundEnd
  } as CSSProperties;
  const backFaceThemeStyle = {
    "--board-glow-top": backFaceTheme.glowTop,
    "--board-glow-bottom": backFaceTheme.glowBottom,
    "--board-grid-line": backFaceTheme.gridLine,
    "--board-bg-start": backFaceTheme.backgroundStart,
    "--board-bg-mid": backFaceTheme.backgroundMid,
    "--board-bg-end": backFaceTheme.backgroundEnd
  } as CSSProperties;

  const {
    tray,
    submittedWords,
    isChecking,
    canSubmit,
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

  function showAnnouncement(message: string, lifetimeMs = 2200) {
    if (announcementTimeoutRef.current) {
      window.clearTimeout(announcementTimeoutRef.current);
    }

    setAnnouncement(message);
    announcementTimeoutRef.current = window.setTimeout(() => {
      setAnnouncement(null);
      announcementTimeoutRef.current = null;
    }, lifetimeMs);
  }

  function triggerRoundTurn() {
    if (roundFlipTimeoutRef.current) {
      window.clearTimeout(roundFlipTimeoutRef.current);
      roundFlipTimeoutRef.current = null;
    }

    const nextThemeIndex = backFaceThemeIndex;
    const followingThemeIndex = pickNextBoardTheme(nextThemeIndex);
    setIsRoundFlipping(true);

    roundFlipTimeoutRef.current = window.setTimeout(() => {
      setBoardThemeIndex(nextThemeIndex);
      setBackFaceThemeIndex(followingThemeIndex);
      roundFlipTimeoutRef.current = window.setTimeout(() => {
        setIsRoundFlipping(false);
        roundFlipTimeoutRef.current = null;
      }, 520);
    }, 480);
  }

  function resetRoundState(resetScore: boolean, roundNumber = currentRound) {
    const nextScoreStart = resetScore ? 0 : score;
    const nextBoardThemeIndex = resetScore ? backFaceThemeIndex : boardThemeIndex;
    idRef.current = 1;
    tickRef.current = 0;
    powerUpRespawnAtRef.current = 0;

    if (announcementTimeoutRef.current) {
      window.clearTimeout(announcementTimeoutRef.current);
      announcementTimeoutRef.current = null;
    }
    if (roundFlipTimeoutRef.current) {
      window.clearTimeout(roundFlipTimeoutRef.current);
      roundFlipTimeoutRef.current = null;
    }

    setTiles(Array.from({ length: baseTileCount }, () => makeTile(idRef.current++, language, speedMultiplier)));
    resetWordState();
    setRoundScoreStart(nextScoreStart);
    setGoalConfig(rollGoalConfig(roundNumber));
    setBoardThemeIndex(nextBoardThemeIndex);
    setBackFaceThemeIndex(pickNextBoardTheme(nextBoardThemeIndex));
    setIsGameOver(false);
    setIsRoundFlipping(false);
    setAnnouncement(null);
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
    menuAutoPausedRef.current = false;
    optionsAutoPausedRef.current = false;

    if (resetScore) {
      setScore(0);
      setCurrentRound(1);
      setGoalConfig(rollGoalConfig(1));
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
    return () => {
      if (announcementTimeoutRef.current) {
        window.clearTimeout(announcementTimeoutRef.current);
      }
      if (roundFlipTimeoutRef.current) {
        window.clearTimeout(roundFlipTimeoutRef.current);
      }
    };
  }, []);

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

          if (scoreGoalMet) {
            const nextRound = currentRound + 1;
            const nextGoal = rollGoalConfig(nextRound);
            const nextRoundStatus = t.statusRoundStart(nextRound, nextGoal.score);

            setCurrentRound(nextRound);
            setRoundScoreStart(score);
            setGoalConfig(nextGoal);
            setStatus(nextRoundStatus);
            showAnnouncement(nextRoundStatus);
            triggerRoundTurn();
            return roundSeconds;
          }

          setIsRunning(false);
          setIsPaused(true);
          setIsGameOver(true);
          setStatus(t.statusScoreRequired(goalConfig.score));
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
    t.statusRoundStart,
    t.statusScoreRequired,
    currentRound,
    goalConfig,
    roundScore,
    roundSeconds,
    score
  ]);

  useEffect(() => {
    if (isMenuOpen) {
      if (isRunning && !isPaused) {
        setIsPaused(true);
        setStatus(t.pausedStatus);
        menuAutoPausedRef.current = true;
      }
      return;
    }

    if (menuAutoPausedRef.current && isRunning) {
      if (isOptionsOpen || isHelpModalOpen) {
        return;
      }

      setIsPaused(false);
      setStatus(t.initialStatus);
      menuAutoPausedRef.current = false;
      return;
    }

    menuAutoPausedRef.current = false;
  }, [isMenuOpen, isRunning, isPaused, isOptionsOpen, isHelpModalOpen, t.pausedStatus, t.initialStatus]);

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
    if (isGameOver || status === t.initialStatus) {
      setStatusFlash(null);
      return;
    }

    setStatusFlash(status);
    const timeout = window.setTimeout(() => {
      setStatusFlash((current) => (current === status ? null : current));
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [status, t.initialStatus, isGameOver]);

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
          lineLengthBonus: t.helpLineLengthBonus,
          lineWordMultiplierStack: t.helpLineWordMultiplierStack,
          roundsTitle: t.helpRoundsTitle,
          lineRoundsGoal: t.helpLineRoundsGoal,
          lineRoundsEnd: t.helpLineRoundsEnd,
          powerUpsTitle: t.helpPowerUpsTitle,
          close: t.closeHelp
        }}
      />

      <section className="gameShell">
        <header className="gameHeader">
          <GameMenu
            isOpen={isMenuOpen}
            onToggle={() => setIsMenuOpen((prev) => !prev)}
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
            labels={{
              menuButton: "...",
              menuTitle: t.menuTitle,
              options: t.options,
              help: t.help,
              closeMenu: t.closeMenu
            }}
          />
          <h1>{t.title}</h1>
        </header>

        <section className="boardShell">
        {submittedWords.length > 0 ? (
          <aside className="submittedWordsRail" aria-hidden="true">
            {submittedWords
              .slice(-8)
              .reverse()
              .map((entry, index) => (
                <div key={`${entry.word}-${index}`} className="submittedWordEntry">
                  <span>{entry.word}</span>
                  <strong>+{entry.points}</strong>
                </div>
              ))}
          </aside>
        ) : null}

        <section
          className={`${isGameOver ? "gameStage gameStage-gameOver" : "gameStage"}${isRoundFlipping ? " gameStage-roundFlip" : ""}`}
          style={boardThemeStyle}
        >
          <div className="boardCard">
            <div className="boardFace boardFace-front">
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

              <div className="boardOverlay" aria-hidden="true">
                <section className="cornerStat cornerStat-topLeft">
                  <span className="cornerLabel">{t.round}</span>
                  <strong className="cornerValue">{currentRound}</strong>
                </section>

                <section className="cornerStat cornerStat-topRight">
                  <span className="cornerLabel">{t.timeLeft}</span>
                  <strong className="cornerValue" style={{ color: timeColor }}>{timeLeft}s</strong>
                </section>

                <section className="cornerStat cornerStat-bottomLeft">
                  <span className="cornerLabel">{t.roundScore}</span>
                  <strong className="cornerValue">{roundScore}/{goalConfig.score}</strong>
                </section>

                <section className="cornerStat cornerStat-bottomRight">
                  <span className="cornerLabel">{t.totalScore}</span>
                  <strong className="cornerValue">{score}</strong>
                </section>
              </div>

              {!isGameOver && shouldShowMessage ? (
                <section
                  key={displayStatus ?? "message"}
                  className={`stageMessage${announcement ? " stageMessage-announce" : ""}`}
                >
                  <p className="status">{displayStatus}</p>
                </section>
              ) : null}
            </div>

            <div className="boardFace boardFace-back" style={backFaceThemeStyle}>
              <div className="backFaceTileField" aria-hidden="true">
                {backFaceTiles.map((tile) => (
                  <span
                    key={tile.id}
                    className={`tile backFaceTile${tile.toneClass ? ` ${tile.toneClass}` : ""}`}
                    style={{
                      left: `${tile.left}%`,
                      top: `${tile.top}%`,
                      width: tileSizePercent,
                      height: tileSizePercent
                    }}
                  >
                    <span className="letter">{tile.char}</span>
                    <span className="value">{tile.value}</span>
                  </span>
                ))}
              </div>
              <div className="gameOverCard">
                <p className="gameOverEyebrow">{t.matchComplete}</p>
                <h2>{t.finalScore}: {score}</h2>
                <button type="button" onClick={startNewGame}>
                  {language === "en" ? "Start New Game" : t.newGame}
                </button>
              </div>
            </div>
          </div>
        </section>
        </section>

        <GameSidePanel
          tray={tray}
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
            bonuses: t.bonuses,
            lengthBonus: t.lengthBonus,
            wordMultiplier: t.wordMultiplier,
            submitWord: language === "en" ? "Submit" : t.submitWord,
            checking: t.checking,
            backspace: t.backspace,
            clear: t.clear,
            restartRound: t.newGame,
            playAgain: t.newGame,
            acceptedWords: t.acceptedWords,
            noneYet: t.noneYet,
            effects: t.effects
          }}
        />
      </section>
    </>
  );
}
