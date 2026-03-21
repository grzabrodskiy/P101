import { FIELD_SIZE, TILE_SIZE } from "../game/constants";
import { getEntityOpacity } from "../game/logic";
import type { Tile } from "../game/types";

type LetterTileProps = {
  tile: Tile;
  disabled: boolean;
  slowActive: boolean;
  onCollect: (id: number) => void;
};

export function LetterTile({ tile, disabled, slowActive, onCollect }: LetterTileProps) {
  const tileClasses = [
    "tile",
    slowActive ? "tile-slow" : "",
    tile.letterMultiplier === 2 ? "tile-double-letter" : "",
    tile.letterMultiplier === 3 ? "tile-triple-letter" : "",
    tile.wordMultiplier === 2 ? "tile-double-word" : "",
    tile.wordMultiplier === 3 ? "tile-triple-word" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const modifierBadge = tile.letterMultiplier
    ? `x${tile.letterMultiplier}`
    : tile.wordMultiplier
      ? `x${tile.wordMultiplier}`
      : null;

  return (
    <button
      type="button"
      className={tileClasses}
      onPointerDown={() => onCollect(tile.id)}
      disabled={disabled}
      style={{
        left: `${(tile.x / FIELD_SIZE) * 100}%`,
        top: `${(tile.y / FIELD_SIZE) * 100}%`,
        opacity: getEntityOpacity(tile.state, tile.stateAge),
        width: `${(TILE_SIZE / FIELD_SIZE) * 100}%`,
        height: `${(TILE_SIZE / FIELD_SIZE) * 100}%`
      }}
      aria-label={`Letter ${tile.char}`}
    >
      <span className="letter">{tile.char}</span>
      <span className="value">{tile.value}</span>
      {modifierBadge ? <span className="tileModifier">{modifierBadge}</span> : null}
    </button>
  );
}
