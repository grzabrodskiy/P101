import { TILE_SIZE } from "../game/constants";
import { getEntityOpacity } from "../game/logic";
import type { Tile } from "../game/types";

type LetterTileProps = {
  tile: Tile;
  disabled: boolean;
  onCollect: (id: number) => void;
};

export function LetterTile({ tile, disabled, onCollect }: LetterTileProps) {
  const tileClasses = [
    "tile",
    tile.letterMultiplier === 2 ? "tile-double-letter" : "",
    tile.letterMultiplier === 3 ? "tile-triple-letter" : "",
    tile.wordMultiplier === 2 ? "tile-double-word" : "",
    tile.wordMultiplier === 3 ? "tile-triple-word" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const modifierBadge = tile.letterMultiplier
    ? `${tile.letterMultiplier === 2 ? "D" : "T"}L`
    : tile.wordMultiplier
      ? `${tile.wordMultiplier === 2 ? "D" : "T"}W`
      : null;

  return (
    <button
      type="button"
      className={tileClasses}
      onPointerDown={() => onCollect(tile.id)}
      disabled={disabled}
      style={{
        transform: `translate(${tile.x}px, ${tile.y}px)`,
        opacity: getEntityOpacity(tile.state, tile.stateAge),
        width: TILE_SIZE,
        height: TILE_SIZE
      }}
      aria-label={`Letter ${tile.char}`}
    >
      <span className="letter">{tile.char}</span>
      <span className="value">{tile.value}</span>
      {modifierBadge ? <span className="tileModifier">{modifierBadge}</span> : null}
    </button>
  );
}
