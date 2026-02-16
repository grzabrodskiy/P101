import type { TrayTile } from "./types";

export function wordLengthBonus(length: number): number {
  if (length <= 4) return 0;
  if (length === 5) return 4;
  if (length === 6) return 8;
  if (length === 7) return 16;
  if (length === 8 || length === 9) return 32;
  if (length === 10) return 64;
  return 64 + (length - 10);
}

export function trayBaseScore(tray: TrayTile[]): number {
  return tray.reduce((sum, tile) => sum + tile.value * (tile.letterMultiplier ?? 1), 0);
}

export function trayWordMultiplier(tray: TrayTile[]): number {
  return tray.reduce((product, tile) => product * (tile.wordMultiplier ?? 1), 1);
}

export function trayTotalScore(tray: TrayTile[], wordLength = tray.length): number {
  return (trayBaseScore(tray) + wordLengthBonus(wordLength)) * trayWordMultiplier(tray);
}
