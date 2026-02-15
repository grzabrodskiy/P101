export type Letter = string;
export type EntityState = "entering" | "active" | "exiting";

export type MovingEntity = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bounces: number;
  state: EntityState;
  stateAge: number;
};

export type Tile = MovingEntity & {
  char: Letter;
  value: number;
};

export type PowerUpKind =
  | "bomb"
  | "multiplier"
  | "freeze"
  | "shield"
  | "wild"
  | "reroll"
  | "slow"
  | "double"
  | "magnet"
  | "extra-time"
  | "lock"
  | "purge";

export type PowerUp = MovingEntity & {
  kind: PowerUpKind;
};

export type TrayTile = {
  id: number;
  char: Letter | "*";
  value: number;
  locked?: boolean;
  wildcard?: boolean;
};

export type SubmittedWord = {
  word: string;
  points: number;
};
