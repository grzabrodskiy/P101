import type { Letter, PowerUpKind } from "./types";

export const FIELD_SIZE = 480;
export const TILE_SIZE = 42;
export const POWERUP_SIZE = 42;
export const MAX_BOUNCES = 3;
export const BASE_TILE_COUNT = 8;
export const ROUND_SECONDS = 90;
export const MAX_EFFECT_SECONDS = 30;
export const TRANSITION_SECONDS = 0.24;
export const REFRESH_SPAWN_MS = 130;
export const EXPLOSION_MS = 260;
export const POWERUP_RESPAWN_MS = 1800;

export const SCRABBLE_VALUES = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10
} as const;

export const FALLBACK_WORDS = new Set([
  "apple",
  "bird",
  "book",
  "cat",
  "code",
  "dog",
  "game",
  "green",
  "home",
  "house",
  "love",
  "note",
  "phone",
  "play",
  "road",
  "score",
  "stone",
  "sun",
  "tree",
  "word",
  "world"
]);

export const LETTER_FREQUENCY_BONUS: Partial<Record<Letter, number>> = {
  E: 4,
  T: 3,
  A: 3,
  O: 3,
  I: 2,
  N: 2,
  R: 2,
  S: 2,
  H: 1,
  L: 1,
  D: 1,
  U: 1
};

export const POWERUP_META: Record<
  PowerUpKind,
  { label: string; durationSeconds?: number; help: string }
> = {
  bomb: { label: "💣", help: "Explodes all letters and refreshes the board." },
  multiplier: { label: "x2", durationSeconds: 12, help: "Doubles active letters to 16." },
  freeze: { label: "❄️", durationSeconds: 5, help: "Freezes movement briefly." },
  shield: { label: "🛡️", durationSeconds: 10, help: "Protects tray from backspace/clear." },
  wild: { label: "*", help: "Adds wildcard tile to tray." },
  reroll: { label: "🔁", help: "Rerolls low-value letters." },
  slow: { label: "⏳", durationSeconds: 8, help: "Slows all movement." },
  double: { label: "DW", help: "Next valid word gets double points." },
  magnet: { label: "🧲", durationSeconds: 8, help: "Letters drift toward pointer." },
  "extra-time": { label: "+10", help: "Adds 10 seconds." },
  lock: { label: "🔒", help: "Next collected letter is locked in tray." },
  purge: { label: "🧹", help: "Replaces high-value rare letters." }
};

export const POWERUP_TYPES = Object.keys(POWERUP_META) as PowerUpKind[];
