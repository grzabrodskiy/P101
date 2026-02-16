import type { SubmittedWord, TrayTile } from "../game/types";

type GameSidePanelProps = {
  tray: TrayTile[];
  trayBaseScore: number;
  trayLengthBonus: number;
  trayWordMultiplier: number;
  trayScore: number;
  isChecking: boolean;
  submitDisabled: boolean;
  isRunning: boolean;
  isRefreshing: boolean;
  activeEffects: string[];
  submittedWords: SubmittedWord[];
  onSubmitWord: () => void;
  onBackspace: () => void;
  onClear: () => void;
  onRestart: () => void;
  labels: {
    trayPlaceholder: string;
    wordPoints: string;
    submitWord: string;
    checking: string;
    backspace: string;
    clear: string;
    restartRound: string;
    playAgain: string;
    acceptedWords: string;
    noneYet: string;
    effects: string;
    noEffects: string;
  };
};

export function GameSidePanel({
  tray,
  trayBaseScore,
  trayLengthBonus,
  trayWordMultiplier,
  trayScore,
  isChecking,
  submitDisabled,
  isRunning,
  isRefreshing,
  activeEffects,
  submittedWords,
  onSubmitWord,
  onBackspace,
  onClear,
  onRestart,
  labels
}: GameSidePanelProps) {
  return (
    <section className="sidePanel">
      <section className="tray" aria-label="Word builder">
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
        <div className="trayScore">
          {labels.wordPoints}: {trayScore}
          {trayLengthBonus > 0 || trayWordMultiplier > 1 ? (
            <span className="trayScoreDetails">
              {" "}
              ({trayBaseScore}
              {trayLengthBonus > 0 ? `+${trayLengthBonus}` : ""}
              {trayWordMultiplier > 1 ? ` x${trayWordMultiplier}` : ""})
            </span>
          ) : null}
        </div>
      </section>

      <section className="controls">
        <button
          type="button"
          onClick={onSubmitWord}
          disabled={submitDisabled}
          title={isChecking ? labels.checking : labels.submitWord}
          aria-label={isChecking ? labels.checking : labels.submitWord}
          className="iconButton"
        >
          <span className="iconGlyph" aria-hidden="true">{isChecking ? "⏳" : "✅"}</span>
          <span className="iconText">{labels.submitWord}</span>
        </button>
        <button
          type="button"
          onClick={onBackspace}
          disabled={tray.length === 0 || !isRunning || isRefreshing}
          title={labels.backspace}
          aria-label={labels.backspace}
          className="iconButton"
        >
          <span className="iconGlyph" aria-hidden="true">⌫</span>
          <span className="iconText">{labels.backspace}</span>
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={tray.length === 0 || !isRunning || isRefreshing}
          title={labels.clear}
          aria-label={labels.clear}
          className="iconButton"
        >
          <span className="iconGlyph" aria-hidden="true">🧹</span>
          <span className="iconText">{labels.clear}</span>
        </button>
        <button
          type="button"
          className="restartButton iconButton"
          onClick={onRestart}
          title={isRunning ? labels.restartRound : labels.playAgain}
          aria-label={isRunning ? labels.restartRound : labels.playAgain}
        >
          <span className="iconGlyph" aria-hidden="true">↻</span>
          <span className="iconText">{isRunning ? labels.restartRound : labels.playAgain}</span>
        </button>
      </section>

      <section className="effects effectsInPanel">
        {labels.effects}: {activeEffects.length > 0 ? activeEffects.join(" · ") : labels.noEffects}
      </section>

      <section className="submitted">
        <h2>{labels.acceptedWords}</h2>
        {submittedWords.length === 0 ? (
          <p className="empty">{labels.noneYet}</p>
        ) : (
          <ul>
            {submittedWords
              .slice()
              .reverse()
              .map((entry, index) => (
                <li key={`${entry.word}-${index}`}>
                  <span>{entry.word}</span>
                  <strong>+{entry.points}</strong>
                </li>
              ))}
          </ul>
        )}
      </section>
    </section>
  );
}
