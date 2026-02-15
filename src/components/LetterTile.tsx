import { TILE_SIZE } from "../game/constants";
import { getEntityOpacity } from "../game/logic";
import type { Tile } from "../game/types";

type LetterTileProps = {
  tile: Tile;
  disabled: boolean;
  onCollect: (id: number) => void;
};

export function LetterTile({ tile, disabled, onCollect }: LetterTileProps) {
  return (
    <button
      type="button"
      className="tile"
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
    </button>
  );
}
