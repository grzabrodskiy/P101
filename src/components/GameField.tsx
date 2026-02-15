import type { PointerEvent as ReactPointerEvent, SyntheticEvent } from "react";

import { FIELD_SIZE } from "../game/constants";
import type { PowerUp, Tile } from "../game/types";
import { LetterTile } from "./LetterTile";
import { PowerUpTile } from "./PowerUpTile";

type GameFieldProps = {
  tiles: Tile[];
  powerUp: PowerUp | null;
  isRunning: boolean;
  isRefreshing: boolean;
  explosionPulse: boolean;
  onCollectTile: (id: number) => void;
  onActivatePowerUp: (event: SyntheticEvent) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
};

export function GameField({
  tiles,
  powerUp,
  isRunning,
  isRefreshing,
  explosionPulse,
  onCollectTile,
  onActivatePowerUp,
  onPointerMove,
  onPointerLeave
}: GameFieldProps) {
  return (
    <section
      className="field"
      style={{ width: FIELD_SIZE, height: FIELD_SIZE }}
      aria-label="Flying letter area"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {tiles.map((tile) => (
        <LetterTile key={tile.id} tile={tile} disabled={!isRunning || isRefreshing} onCollect={onCollectTile} />
      ))}

      {powerUp && (
        <PowerUpTile
          powerUp={powerUp}
          disabled={!isRunning || isRefreshing}
          onActivate={onActivatePowerUp}
        />
      )}

      {explosionPulse && <div className="explosion" />}
    </section>
  );
}
