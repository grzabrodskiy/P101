import type { PowerUpKind } from "../game/types";

const POWERUP_ICON: Record<PowerUpKind, string> = {
  bomb: "💣",
  multiplier: "✨",
  freeze: "🧊",
  shield: "🛡️",
  wild: "🃏",
  reroll: "🔄",
  slow: "🐢",
  double: "🎯",
  magnet: "🧲",
  "extra-time": "⏱️",
  lock: "🔒",
  purge: "🧹"
};

const POWERUP_BADGE: Partial<Record<PowerUpKind, string>> = {
  multiplier: "x2",
  double: "DW",
  "extra-time": "+10"
};

type PowerUpIconProps = {
  kind: PowerUpKind;
  className?: string;
  showBadge?: boolean;
};

export function PowerUpIcon({ kind, className, showBadge = true }: PowerUpIconProps) {
  const badge = showBadge ? POWERUP_BADGE[kind] : null;
  return (
    <span className={className ?? "powerupIconWrap"}>
      <span className="powerupIcon" aria-hidden="true">{POWERUP_ICON[kind]}</span>
      {badge && <span className="powerupBadge">{badge}</span>}
    </span>
  );
}
