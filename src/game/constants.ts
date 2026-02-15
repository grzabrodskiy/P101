import type { Letter, PowerUpKind } from "./types";

export const FIELD_SIZE = 480;
export const TILE_SIZE = 42;
export const POWERUP_SIZE = 42;
export const MAX_BOUNCES = 3;
export const BASE_TILE_COUNT = 8;
export const BASE_TILE_COUNT_OPTIONS = [6, 8, 10, 12] as const;
export type BaseTileCount = (typeof BASE_TILE_COUNT_OPTIONS)[number];
export const ROUND_SECONDS = 90;
export const ROUND_DURATION_OPTIONS = [60, 90, 120] as const;
export type RoundDurationSeconds = (typeof ROUND_DURATION_OPTIONS)[number];
export const SPEED_MULTIPLIER_OPTIONS = [0.8, 1, 1.25] as const;
export type SpeedMultiplier = (typeof SPEED_MULTIPLIER_OPTIONS)[number];
export const MAX_BOUNCES_OPTIONS = [2, 3, 4, 5] as const;
export type MaxBounces = (typeof MAX_BOUNCES_OPTIONS)[number];
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
  { label: string; durationSeconds?: number }
> = {
  bomb: { label: "💣" },
  multiplier: { label: "x2", durationSeconds: 12 },
  freeze: { label: "❄️", durationSeconds: 5 },
  shield: { label: "🛡️", durationSeconds: 10 },
  wild: { label: "*" },
  reroll: { label: "🔁" },
  slow: { label: "⏳", durationSeconds: 8 },
  double: { label: "DW" },
  magnet: { label: "🧲", durationSeconds: 8 },
  "extra-time": { label: "+10" },
  lock: { label: "🔒" },
  purge: { label: "🧹" }
};

export const POWERUP_TYPES = Object.keys(POWERUP_META) as PowerUpKind[];
