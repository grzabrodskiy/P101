import type { SyntheticEvent } from "react";

import { POWERUP_META, POWERUP_SIZE } from "../game/constants";
import { getEntityOpacity } from "../game/logic";
import type { PowerUp } from "../game/types";

type PowerUpTileProps = {
  powerUp: PowerUp;
  disabled: boolean;
  onActivate: (event: SyntheticEvent) => void;
};

export function PowerUpTile({ powerUp, disabled, onActivate }: PowerUpTileProps) {
  const meta = POWERUP_META[powerUp.kind];

  return (
    <button
      type="button"
      className={`powerup powerup-${powerUp.kind}`}
      onPointerDown={onActivate}
      onClick={onActivate}
      disabled={disabled}
      style={{
        transform: `translate(${powerUp.x}px, ${powerUp.y}px)`,
        opacity: getEntityOpacity(powerUp.state, powerUp.stateAge),
        width: POWERUP_SIZE,
        height: POWERUP_SIZE
      }}
      aria-label={meta.help}
      title={meta.help}
    >
      {meta.label}
    </button>
  );
}
