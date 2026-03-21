import type { SyntheticEvent } from "react";

import { FIELD_SIZE, POWERUP_SIZE } from "../game/constants";
import { getEntityOpacity } from "../game/logic";
import type { PowerUp } from "../game/types";
import { PowerUpIcon } from "./PowerUpIcon";

type PowerUpTileProps = {
  powerUp: PowerUp;
  disabled: boolean;
  helpText: string;
  onActivate: (event: SyntheticEvent) => void;
};

export function PowerUpTile({ powerUp, disabled, helpText, onActivate }: PowerUpTileProps) {
  return (
    <button
      type="button"
      className={`powerup powerup-${powerUp.kind}`}
      onPointerDown={onActivate}
      disabled={disabled}
      style={{
        left: `${(powerUp.x / FIELD_SIZE) * 100}%`,
        top: `${(powerUp.y / FIELD_SIZE) * 100}%`,
        opacity: getEntityOpacity(powerUp.state, powerUp.stateAge),
        width: `${(POWERUP_SIZE / FIELD_SIZE) * 100}%`,
        height: `${(POWERUP_SIZE / FIELD_SIZE) * 100}%`
      }}
      aria-label={helpText}
      title={helpText}
    >
      <PowerUpIcon kind={powerUp.kind} />
    </button>
  );
}
