import type { SubmittedWord, TrayTile } from "../game/types";

type GameSidePanelProps = {
  tray: TrayTile[];
  trayWord: string;
  trayScore: number;
  isChecking: boolean;
  submitDisabled: boolean;
  isRunning: boolean;
  isRefreshing: boolean;
  isShieldActive: boolean;
  submittedWords: SubmittedWord[];
  onSubmitWord: () => void;
  onBackspace: () => void;
  onClear: () => void;
  onRestart: () => void;
};

export function GameSidePanel({
  tray,
  trayWord,
  trayScore,
  isChecking,
  submitDisabled,
  isRunning,
  isRefreshing,
  isShieldActive,
  submittedWords,
  onSubmitWord,
  onBackspace,
  onClear,
  onRestart
}: GameSidePanelProps) {
  return (
    <section className="sidePanel">
      <section className="tray" aria-label="Word builder">
        <div className="trayWord">{trayWord || "Tap letters to build a word"}</div>
        <div className="trayScore">Word Points: {trayScore}</div>
      </section>

      <section className="controls">
        <button
          type="button"
          onClick={onSubmitWord}
          disabled={submitDisabled}
        >
          {isChecking ? "Checking..." : "Submit Word"}
        </button>
        <button
          type="button"
          onClick={onBackspace}
          disabled={tray.length === 0 || !isRunning || isRefreshing || isShieldActive}
        >
          Backspace
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={tray.length === 0 || !isRunning || isRefreshing || isShieldActive}
        >
          Clear
        </button>
      </section>

      <button type="button" className="restartButton" onClick={onRestart}>
        {isRunning ? "Restart Round" : "Play Again"}
      </button>

      <section className="submitted">
        <h2>Accepted Words</h2>
        {submittedWords.length === 0 ? (
          <p className="empty">None yet</p>
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
