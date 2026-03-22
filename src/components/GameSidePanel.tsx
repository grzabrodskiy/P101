import type { SubmittedWord, TrayTile } from "../game/types";
import { ACTION_ICONS } from "./actionIcons";
import { getShortcutKey, joinShortcutKeys } from "./shortcutKey";

const LETTER_PATTERN = /\p{L}/u;

function renderShortcutLabel(label: string) {
  const characters = Array.from(label);
  const shortcutIndex = characters.findIndex((character) => LETTER_PATTERN.test(character));

  if (shortcutIndex === -1) {
    return label;
  }

  return (
    <>
      {characters.slice(0, shortcutIndex).join("")}
      <span className="shortcutUnderline">{characters[shortcutIndex]}</span>
      {characters.slice(shortcutIndex + 1).join("")}
    </>
  );
}

type GameSidePanelProps = {
  tray: TrayTile[];
  trayLengthBonus: number;
  trayWordMultiplier: number;
  trayScore: number;
  isChecking: boolean;
  submitDisabled: boolean;
  isRunning: boolean;
  isPaused: boolean;
  isRefreshing: boolean;
  activeEffects: string[];
  submittedWords: SubmittedWord[];
  onSubmitWord: () => void;
  onBackspace: () => void;
  onClear: () => void;
  onOpenHelp: () => void;
  onPauseToggle: () => void;
  onRestart: () => void;
  onOpenOptions: () => void;
  labels: {
    trayPlaceholder: string;
    wordPoints: string;
    bonuses: string;
    lengthBonus: string;
    wordMultiplier: string;
    submitWord: string;
    checking: string;
    backspace: string;
    clear: string;
    help: string;
    pause: string;
    resume: string;
    restartRound: string;
    playAgain: string;
    options: string;
    acceptedWords: string;
    noneYet: string;
    effects: string;
  };
};

export function GameSidePanel({
  tray,
  isChecking,
  submitDisabled,
  isRunning,
  isPaused,
  isRefreshing,
  onSubmitWord,
  onBackspace,
  onClear,
  onOpenHelp,
  onPauseToggle,
  onRestart,
  onOpenOptions,
  labels
}: GameSidePanelProps) {
  const pauseLabel = isPaused ? labels.resume : labels.pause;
  const pauseShortcutKeys = isPaused
    ? joinShortcutKeys(getShortcutKey(labels.pause), getShortcutKey(labels.resume))
    : getShortcutKey(labels.pause) ?? undefined;
  const helpShortcutKey = getShortcutKey(labels.help);
  const optionsShortcutKey = getShortcutKey(labels.options);

  return (
    <>
      <section className="controlBar">
        <section className="controls controlsCompact">
          <button
            type="button"
            onClick={onSubmitWord}
            disabled={submitDisabled}
            title={isChecking ? labels.checking : labels.submitWord}
            aria-label={isChecking ? labels.checking : labels.submitWord}
            className="iconButton"
            data-shortcut-key={getShortcutKey(labels.submitWord) ?? undefined}
          >
            <span className="iconGlyph" aria-hidden="true">{isChecking ? ACTION_ICONS.checking : ACTION_ICONS.submit}</span>
            <span className="iconText">{renderShortcutLabel(labels.submitWord)}</span>
          </button>
          <button
            type="button"
            onClick={onBackspace}
            disabled={tray.length === 0 || !isRunning || isRefreshing}
            title={labels.backspace}
            aria-label={labels.backspace}
            className="iconButton"
            data-shortcut-key={getShortcutKey(labels.backspace) ?? undefined}
          >
            <span className="iconGlyph" aria-hidden="true">{ACTION_ICONS.backspace}</span>
            <span className="iconText">{renderShortcutLabel(labels.backspace)}</span>
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={tray.length === 0 || !isRunning || isRefreshing}
            title={labels.clear}
            aria-label={labels.clear}
            className="iconButton"
            data-shortcut-key={getShortcutKey(labels.clear) ?? undefined}
          >
            <span className="iconGlyph" aria-hidden="true">{ACTION_ICONS.clear}</span>
            <span className="iconText">{renderShortcutLabel(labels.clear)}</span>
          </button>
          <button
            type="button"
            onClick={onPauseToggle}
            disabled={!isRunning}
            title={pauseLabel}
            aria-label={pauseLabel}
            aria-pressed={isPaused}
            className="iconButton"
            data-shortcut-key={pauseShortcutKeys}
          >
            <span className="iconGlyph" aria-hidden="true">{isPaused ? ACTION_ICONS.resume : ACTION_ICONS.pause}</span>
            <span className="iconText">{renderShortcutLabel(pauseLabel)}</span>
          </button>
          <button
            type="button"
            className="restartButton iconButton"
            onClick={onRestart}
            title={isRunning ? labels.restartRound : labels.playAgain}
            aria-label={isRunning ? labels.restartRound : labels.playAgain}
            data-shortcut-key={getShortcutKey(isRunning ? labels.restartRound : labels.playAgain) ?? undefined}
          >
            <span className="iconGlyph" aria-hidden="true">{ACTION_ICONS.restart}</span>
            <span className="iconText">{renderShortcutLabel(isRunning ? labels.restartRound : labels.playAgain)}</span>
          </button>
          <button
            type="button"
            onClick={onOpenHelp}
            title={helpShortcutKey ? `${labels.help} (${helpShortcutKey.toLocaleUpperCase()})` : labels.help}
            aria-label={labels.help}
            aria-keyshortcuts={helpShortcutKey ?? undefined}
            className="iconButton"
            data-shortcut-key={helpShortcutKey ?? undefined}
          >
            <span className="iconGlyph" aria-hidden="true">{ACTION_ICONS.help}</span>
            <span className="iconText">{renderShortcutLabel(labels.help)}</span>
          </button>
          <button
            type="button"
            onClick={onOpenOptions}
            title={optionsShortcutKey ? `${labels.options} (${optionsShortcutKey.toLocaleUpperCase()})` : labels.options}
            aria-label={labels.options}
            aria-keyshortcuts={optionsShortcutKey ?? undefined}
            className="iconButton"
            data-shortcut-key={optionsShortcutKey ?? undefined}
          >
            <span className="iconGlyph" aria-hidden="true">{ACTION_ICONS.options}</span>
            <span className="iconText">{renderShortcutLabel(labels.options)}</span>
          </button>
        </section>
      </section>

      <section className="selectedWordPanel" aria-label="Word builder">
        {tray.length === 0 ? (
          <div className="trayWord">{labels.trayPlaceholder}</div>
        ) : (
          <div className="trayTiles">
            {tray.map((tile) => {
              const tileClasses = [
                "trayTile",
                tile.letterMultiplier === 2 ? "tile-double-letter" : "",
                tile.letterMultiplier === 3 ? "tile-triple-letter" : "",
                tile.wordMultiplier === 2 ? "tile-double-word" : "",
                tile.wordMultiplier === 3 ? "tile-triple-word" : "",
                tile.locked ? "trayTile-locked" : ""
              ]
                .filter(Boolean)
                .join(" ");

              const modifierBadge = tile.letterMultiplier
                ? `x${tile.letterMultiplier}`
                : tile.wordMultiplier
                  ? `x${tile.wordMultiplier}`
                  : null;

              return (
                <span key={tile.id} className={tileClasses}>
                  <span className="letter">{tile.char}</span>
                  <span className="value">{tile.value}</span>
                  {modifierBadge ? <span className="tileModifier">{modifierBadge}</span> : null}
                </span>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
