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
  letterMultiplier?: 2 | 3;
  wordMultiplier?: 2 | 3;
};

export type PowerUpKind =
  | "bomb"
  | "multiplier"
  | "freeze"
  | "wall"
  | "slow"
  | "extra-time"
  | "extra-time-15";

export type PowerUp = MovingEntity & {
  kind: PowerUpKind;
};

export type TrayTile = {
  id: number;
  char: Letter | "*";
  value: number;
  letterMultiplier?: 2 | 3;
  wordMultiplier?: 2 | 3;
  locked?: boolean;
  wildcard?: boolean;
};

export type SubmittedWord = {
  word: string;
  points: number;
};
