import type { PointerEvent as ReactPointerEvent, SyntheticEvent } from "react";

import { FIELD_SIZE } from "../game/constants";
import type { PowerUp, PowerUpKind, Tile } from "../game/types";
import { LetterTile } from "./LetterTile";
import { PowerUpTile } from "./PowerUpTile";

type GameFieldProps = {
  tiles: Tile[];
  powerUp: PowerUp | null;
  isRunning: boolean;
  isRefreshing: boolean;
  explosionPulse: boolean;
  feedbackBursts: Array<{ id: number; text: string; tone: "score" | "combo" | "bonus" }>;
  onCollectTile: (id: number) => void;
  onActivatePowerUp: (event: SyntheticEvent) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
  powerUpHelpByKind: Record<PowerUpKind, string>;
};

export function GameField({
  tiles,
  powerUp,
  isRunning,
  isRefreshing,
  explosionPulse,
  feedbackBursts,
  onCollectTile,
  onActivatePowerUp,
  onPointerMove,
  onPointerLeave,
  powerUpHelpByKind
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
          helpText={powerUpHelpByKind[powerUp.kind]}
          onActivate={onActivatePowerUp}
        />
      )}

      {explosionPulse && <div className="explosion" />}

      {feedbackBursts.map((burst) => (
        <div key={burst.id} className={`feedbackBurst feedbackBurst-${burst.tone}`}>
          {burst.text}
        </div>
      ))}
    </section>
  );
}
