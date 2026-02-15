import type { SyntheticEvent } from "react";

import { POWERUP_SIZE } from "../game/constants";
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
      onClick={onActivate}
      disabled={disabled}
      style={{
        transform: `translate(${powerUp.x}px, ${powerUp.y}px)`,
        opacity: getEntityOpacity(powerUp.state, powerUp.stateAge),
        width: POWERUP_SIZE,
        height: POWERUP_SIZE
      }}
      aria-label={helpText}
      title={helpText}
    >
      <PowerUpIcon kind={powerUp.kind} />
    </button>
  );
}
