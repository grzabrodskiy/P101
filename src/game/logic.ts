import {
  FIELD_SIZE,
  POWERUP_SPAWN_WEIGHTS,
  POWERUP_SIZE,
  POWERUP_TYPES,
  TILE_SIZE,
  TRANSITION_SECONDS
} from "./constants";
import { dictionaryLocale, type LanguageCode } from "./i18n";
import type { Letter, MovingEntity, PowerUp, PowerUpKind, Tile } from "./types";

type LetterProfile = Record<string, { value: number; weight: number }>;

const LANGUAGE_LETTER_PROFILES: Record<LanguageCode, LetterProfile> = {
  en: {
    E: { value: 1, weight: 12 }, A: { value: 1, weight: 9 }, I: { value: 1, weight: 9 }, O: { value: 1, weight: 8 },
    N: { value: 1, weight: 6 }, R: { value: 1, weight: 6 }, T: { value: 1, weight: 6 }, L: { value: 1, weight: 4 },
    S: { value: 1, weight: 4 }, U: { value: 1, weight: 4 }, D: { value: 2, weight: 4 }, G: { value: 2, weight: 3 },
    B: { value: 3, weight: 2 }, C: { value: 3, weight: 2 }, M: { value: 3, weight: 2 }, P: { value: 3, weight: 2 },
    F: { value: 4, weight: 2 }, H: { value: 4, weight: 2 }, V: { value: 4, weight: 2 }, W: { value: 4, weight: 2 },
    Y: { value: 4, weight: 2 }, K: { value: 5, weight: 1 }, J: { value: 8, weight: 1 }, X: { value: 8, weight: 1 },
    Q: { value: 10, weight: 1 }, Z: { value: 10, weight: 1 }
  },
  de: {
    E: { value: 1, weight: 15 }, N: { value: 1, weight: 9 }, I: { value: 1, weight: 7 }, S: { value: 1, weight: 7 },
    R: { value: 1, weight: 6 }, A: { value: 1, weight: 6 }, T: { value: 1, weight: 6 }, D: { value: 1, weight: 5 },
    H: { value: 2, weight: 4 }, U: { value: 1, weight: 4 }, L: { value: 2, weight: 3 }, C: { value: 4, weight: 2 },
    G: { value: 2, weight: 3 }, M: { value: 3, weight: 3 }, O: { value: 2, weight: 3 }, B: { value: 3, weight: 2 },
    W: { value: 3, weight: 2 }, F: { value: 4, weight: 2 }, K: { value: 4, weight: 2 }, Z: { value: 3, weight: 2 },
    P: { value: 4, weight: 1 }, V: { value: 6, weight: 1 }, J: { value: 6, weight: 1 }, Y: { value: 10, weight: 1 },
    X: { value: 8, weight: 1 }, Q: { value: 10, weight: 1 }, Ä: { value: 6, weight: 1 }, Ö: { value: 8, weight: 1 },
    Ü: { value: 6, weight: 1 }, ß: { value: 8, weight: 1 }
  },
  fr: {
    E: { value: 1, weight: 15 }, A: { value: 1, weight: 9 }, I: { value: 1, weight: 8 }, N: { value: 1, weight: 7 },
    O: { value: 1, weight: 6 }, R: { value: 1, weight: 6 }, S: { value: 1, weight: 6 }, T: { value: 1, weight: 6 },
    U: { value: 1, weight: 6 }, L: { value: 1, weight: 5 }, D: { value: 2, weight: 3 }, M: { value: 2, weight: 3 },
    G: { value: 2, weight: 2 }, B: { value: 3, weight: 2 }, C: { value: 3, weight: 2 }, P: { value: 3, weight: 2 },
    F: { value: 4, weight: 2 }, H: { value: 4, weight: 2 }, V: { value: 4, weight: 2 }, J: { value: 8, weight: 1 },
    Q: { value: 8, weight: 1 }, K: { value: 10, weight: 1 }, W: { value: 10, weight: 1 }, X: { value: 10, weight: 1 },
    Y: { value: 10, weight: 1 }, Z: { value: 10, weight: 1 }
  },
  it: {
    E: { value: 1, weight: 12 }, A: { value: 1, weight: 11 }, I: { value: 1, weight: 11 }, O: { value: 1, weight: 10 },
    N: { value: 1, weight: 6 }, R: { value: 1, weight: 6 }, T: { value: 1, weight: 6 }, L: { value: 2, weight: 5 },
    S: { value: 1, weight: 5 }, C: { value: 2, weight: 5 }, D: { value: 3, weight: 4 }, P: { value: 3, weight: 3 },
    U: { value: 3, weight: 3 }, M: { value: 2, weight: 3 }, G: { value: 2, weight: 3 }, B: { value: 5, weight: 2 },
    F: { value: 4, weight: 2 }, V: { value: 4, weight: 2 }, H: { value: 8, weight: 1 }, Z: { value: 8, weight: 2 },
    Q: { value: 10, weight: 1 }
  },
  ru: {
    О: { value: 1, weight: 10 }, А: { value: 1, weight: 8 }, Е: { value: 1, weight: 8 }, И: { value: 1, weight: 7 },
    Н: { value: 1, weight: 6 }, Т: { value: 1, weight: 6 }, С: { value: 1, weight: 6 }, Р: { value: 1, weight: 6 },
    В: { value: 1, weight: 5 }, Л: { value: 2, weight: 4 }, К: { value: 2, weight: 4 }, М: { value: 2, weight: 3 },
    Д: { value: 2, weight: 3 }, П: { value: 2, weight: 3 }, У: { value: 3, weight: 3 }, Я: { value: 3, weight: 3 },
    Ы: { value: 4, weight: 2 }, Ь: { value: 3, weight: 2 }, Г: { value: 3, weight: 2 }, З: { value: 5, weight: 2 },
    Б: { value: 3, weight: 2 }, Ч: { value: 5, weight: 2 }, Й: { value: 4, weight: 1 }, Х: { value: 5, weight: 1 },
    Ж: { value: 5, weight: 1 }, Ш: { value: 8, weight: 1 }, Ю: { value: 8, weight: 1 }, Ц: { value: 10, weight: 1 },
    Щ: { value: 10, weight: 1 }, Э: { value: 10, weight: 1 }, Ф: { value: 10, weight: 1 }, Ъ: { value: 10, weight: 1 }
  }
};

type WeightedLetter = { char: Letter; value: number; weight: number };

const WEIGHTED_LETTERS_BY_LANGUAGE: Record<LanguageCode, WeightedLetter[]> = Object.fromEntries(
  Object.entries(LANGUAGE_LETTER_PROFILES).map(([language, profile]) => [
    language,
    Object.entries(profile).map(([char, spec]) => ({
      char,
      value: spec.value,
      weight: spec.weight
    }))
  ])
) as Record<LanguageCode, WeightedLetter[]>;

const TOTAL_WEIGHT_BY_LANGUAGE: Record<LanguageCode, number> = Object.fromEntries(
  Object.entries(WEIGHTED_LETTERS_BY_LANGUAGE).map(([language, entries]) => [
    language,
    entries.reduce((sum, entry) => sum + entry.weight, 0)
  ])
) as Record<LanguageCode, number>;

export function randomLetter(language: LanguageCode): { char: Letter; value: number } {
  if (Math.random() < 0.02) {
    return { char: "*", value: 0 };
  }

  const entries = WEIGHTED_LETTERS_BY_LANGUAGE[language] ?? WEIGHTED_LETTERS_BY_LANGUAGE.en;
  const totalWeight = TOTAL_WEIGHT_BY_LANGUAGE[language] ?? TOTAL_WEIGHT_BY_LANGUAGE.en;

  let pick = Math.random() * totalWeight;
  for (const entry of entries) {
    pick -= entry.weight;
    if (pick <= 0) {
      return { char: entry.char, value: entry.value };
    }
  }

  const fallback = entries[0] ?? WEIGHTED_LETTERS_BY_LANGUAGE.en[0];
  return { char: fallback.char, value: fallback.value };
}

export function randomVelocity(speedMultiplier = 1): { vx: number; vy: number } {
  const speed = (72 + Math.random() * 112) * speedMultiplier;
  const angle = Math.random() * Math.PI * 2;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };
}

export function spawnMovingEntity(id: number, size: number, speedMultiplier = 1): MovingEntity {
  const max = FIELD_SIZE - size;
  const base = randomVelocity(speedMultiplier);
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;
  let vx = base.vx;
  let vy = base.vy;

  if (side === 0) {
    x = -size * 0.75;
    y = Math.random() * max;
    vx = Math.abs(base.vx);
  } else if (side === 1) {
    x = FIELD_SIZE - size * 0.25;
    y = Math.random() * max;
    vx = -Math.abs(base.vx);
  } else if (side === 2) {
    x = Math.random() * max;
    y = -size * 0.75;
    vy = Math.abs(base.vy);
  } else {
    x = Math.random() * max;
    y = FIELD_SIZE - size * 0.25;
    vy = -Math.abs(base.vy);
  }

  return {
    id,
    x,
    y,
    vx,
    vy,
    bounces: 0,
    state: "entering",
    stateAge: 0
  };
}

export function updateMovingEntity<T extends MovingEntity>(
  entity: T,
  size: number,
  dt: number,
  maxBounces: number
): T | null {
  let { x, y, vx, vy, bounces, state, stateAge } = entity;
  stateAge += dt;
  x += vx * dt;
  y += vy * dt;

  if (state === "entering" && stateAge >= TRANSITION_SECONDS) {
    state = "active";
    stateAge = 0;
  }

  if (state === "exiting") {
    const outside =
      x < -size * 1.2 ||
      x > FIELD_SIZE + size * 0.2 ||
      y < -size * 1.2 ||
      y > FIELD_SIZE + size * 0.2;
    if (outside || stateAge >= TRANSITION_SECONDS) return null;
    return { ...entity, x, y, vx, vy, bounces, state, stateAge };
  }

  let startedExit = false;

  if (x <= 0) {
    bounces += 1;
    if (bounces > maxBounces) {
      startedExit = true;
      state = "exiting";
      stateAge = 0;
      x = -2;
      vx = -Math.abs(vx);
    } else {
      x = 0;
      vx = Math.abs(vx);
    }
  } else if (x >= FIELD_SIZE - size) {
    bounces += 1;
    if (bounces > maxBounces) {
      startedExit = true;
      state = "exiting";
      stateAge = 0;
      x = FIELD_SIZE - size + 2;
      vx = Math.abs(vx);
    } else {
      x = FIELD_SIZE - size;
      vx = -Math.abs(vx);
    }
  }

  if (!startedExit) {
    if (y <= 0) {
      bounces += 1;
      if (bounces > maxBounces) {
        state = "exiting";
        stateAge = 0;
        y = -2;
        vy = -Math.abs(vy);
      } else {
        y = 0;
        vy = Math.abs(vy);
      }
    } else if (y >= FIELD_SIZE - size) {
      bounces += 1;
      if (bounces > maxBounces) {
        state = "exiting";
        stateAge = 0;
        y = FIELD_SIZE - size + 2;
        vy = Math.abs(vy);
      } else {
        y = FIELD_SIZE - size;
        vy = -Math.abs(vy);
      }
    }
  }

  return { ...entity, x, y, vx, vy, bounces, state, stateAge };
}

export function makeTile(id: number, language: LanguageCode, speedMultiplier = 1): Tile {
  const { char, value } = randomLetter(language);
  const roll = char === "*" ? 1 : Math.random();
  const modifiers =
    roll < 0.06
      ? { letterMultiplier: 2 as const }
      : roll < 0.08
        ? { letterMultiplier: 3 as const }
        : roll < 0.13
          ? { wordMultiplier: 2 as const }
          : roll < 0.145
            ? { wordMultiplier: 3 as const }
            : {};
  return {
    ...spawnMovingEntity(id, TILE_SIZE, speedMultiplier),
    char,
    value,
    ...modifiers
  };
}

export function randomPowerUpKind(): PowerUpKind {
  const totalWeight = POWERUP_TYPES.reduce(
    (sum, kind) => sum + (POWERUP_SPAWN_WEIGHTS[kind] ?? 1),
    0
  );
  let pick = Math.random() * totalWeight;
  for (const kind of POWERUP_TYPES) {
    pick -= POWERUP_SPAWN_WEIGHTS[kind] ?? 1;
    if (pick <= 0) return kind;
  }
  return "bomb";
}

export function makePowerUp(id: number, kind?: PowerUpKind, speedMultiplier = 1): PowerUp {
  return {
    ...spawnMovingEntity(id, POWERUP_SIZE, speedMultiplier),
    kind: kind ?? randomPowerUpKind()
  };
}

const WORD_VALIDATION_CACHE = new Map<string, boolean>();

async function queryDictionary(word: string, locale: string): Promise<boolean> {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${locale}/${word}`);
  if (response.ok) {
    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  }

  if (response.status === 404) {
    return false;
  }

  throw new Error(`dictionary-${locale}-status-${response.status}`);
}

export async function isRealWord(word: string, language: LanguageCode): Promise<boolean> {
  const normalized = word.toLowerCase();
  if (normalized.length < 2) return false;

  const cacheKey = `${language}:${normalized}`;
  const cached = WORD_VALIDATION_CACHE.get(cacheKey);
  if (cached !== undefined) return cached;

  const locale = dictionaryLocale(language);
  try {
    const isValid = await queryDictionary(normalized, locale);
    WORD_VALIDATION_CACHE.set(cacheKey, isValid);
    return isValid;
  } catch {
    WORD_VALIDATION_CACHE.set(cacheKey, false);
    return false;
  }
}

export function wildcardCandidates(chars: Array<Letter | "*">, language: LanguageCode): string[] {
  const stars = chars.filter((c) => c === "*").length;
  if (stars === 0) return [chars.join("")];
  if (stars > 2) return [];

  const letters = (WEIGHTED_LETTERS_BY_LANGUAGE[language] ?? WEIGHTED_LETTERS_BY_LANGUAGE.en)
    .slice()
    .sort((a, b) => b.weight - a.weight)
    .map((entry) => entry.char);
  const results: string[] = [];

  function build(index: number, current: string[]) {
    if (results.length > 700) return;
    if (index === chars.length) {
      results.push(current.join(""));
      return;
    }
    const char = chars[index];
    if (char !== "*") {
      current.push(char);
      build(index + 1, current);
      current.pop();
      return;
    }
    for (const letter of letters) {
      current.push(letter);
      build(index + 1, current);
      current.pop();
    }
  }

  build(0, []);
  return results;
}

export function getEntityOpacity(state: "entering" | "active" | "exiting", stateAge: number): number {
  if (state === "entering") return Math.min(1, stateAge / TRANSITION_SECONDS);
  if (state === "exiting") return Math.max(0, 1 - stateAge / TRANSITION_SECONDS);
  return 1;
}
