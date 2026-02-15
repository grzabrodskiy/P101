import {
  FALLBACK_WORDS,
  FIELD_SIZE,
  LETTER_FREQUENCY_BONUS,
  MAX_BOUNCES,
  POWERUP_SIZE,
  POWERUP_TYPES,
  SCRABBLE_VALUES,
  TILE_SIZE,
  TRANSITION_SECONDS
} from "./constants";
import type { Letter, MovingEntity, PowerUp, PowerUpKind, Tile } from "./types";

const LETTER_WEIGHTS = (Object.keys(SCRABBLE_VALUES) as Letter[]).map((letter) => {
  const value = SCRABBLE_VALUES[letter];
  const inverseValueWeight = Math.max(1, Math.round(14 / value));
  const commonLetterBonus = LETTER_FREQUENCY_BONUS[letter] ?? 0;
  return {
    letter,
    weight: inverseValueWeight + commonLetterBonus
  };
});

const TOTAL_LETTER_WEIGHT = LETTER_WEIGHTS.reduce((sum, entry) => sum + entry.weight, 0);

export function randomLetter(): { char: Letter; value: number } {
  let pick = Math.random() * TOTAL_LETTER_WEIGHT;
  let char: Letter = "E";

  for (const entry of LETTER_WEIGHTS) {
    pick -= entry.weight;
    if (pick <= 0) {
      char = entry.letter;
      break;
    }
  }

  return { char, value: SCRABBLE_VALUES[char] };
}

export function randomVelocity(): { vx: number; vy: number } {
  const speed = 80 + Math.random() * 130;
  const angle = Math.random() * Math.PI * 2;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };
}

export function spawnMovingEntity(id: number, size: number): MovingEntity {
  const max = FIELD_SIZE - size;
  const base = randomVelocity();
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

export function updateMovingEntity<T extends MovingEntity>(entity: T, size: number, dt: number): T | null {
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
    if (bounces > MAX_BOUNCES) {
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
    if (bounces > MAX_BOUNCES) {
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
      if (bounces > MAX_BOUNCES) {
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
      if (bounces > MAX_BOUNCES) {
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

export function makeTile(id: number): Tile {
  const { char, value } = randomLetter();
  return {
    ...spawnMovingEntity(id, TILE_SIZE),
    char,
    value
  };
}

export function randomPowerUpKind(): PowerUpKind {
  return POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
}

export function makePowerUp(id: number, kind?: PowerUpKind): PowerUp {
  return {
    ...spawnMovingEntity(id, POWERUP_SIZE),
    kind: kind ?? randomPowerUpKind()
  };
}

export async function isRealWord(word: string): Promise<boolean> {
  if (word.length < 2) return false;
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) return false;
    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch {
    return FALLBACK_WORDS.has(word);
  }
}

export function wildcardCandidates(chars: Array<Letter | "*">): string[] {
  const stars = chars.filter((c) => c === "*").length;
  if (stars === 0) return [chars.join("")];
  if (stars > 2) return [];

  const letters = Object.keys(SCRABBLE_VALUES) as Letter[];
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
