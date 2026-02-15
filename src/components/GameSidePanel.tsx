import type { SubmittedWord, TrayTile } from "../game/types";

type GameSidePanelProps = {
  tray: TrayTile[];
  trayWord: string;
  trayBaseScore: number;
  trayLengthBonus: number;
  trayScore: number;
  isChecking: boolean;
  submitDisabled: boolean;
  isRunning: boolean;
  isRefreshing: boolean;
  isShieldActive: boolean;
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
  trayWord,
  trayBaseScore,
  trayLengthBonus,
  trayScore,
  isChecking,
  submitDisabled,
  isRunning,
  isRefreshing,
  isShieldActive,
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
        <div className="trayWord">{trayWord || labels.trayPlaceholder}</div>
        <div className="trayScore">
          {labels.wordPoints}: {trayScore}
          {trayLengthBonus > 0 ? (
            <span className="trayScoreDetails"> ({trayBaseScore}+{trayLengthBonus})</span>
          ) : null}
        </div>
      </section>

      <section className="controls">
        <button
          type="button"
          onClick={onSubmitWord}
          disabled={submitDisabled}
        >
          {isChecking ? labels.checking : labels.submitWord}
        </button>
        <button
          type="button"
          onClick={onBackspace}
          disabled={tray.length === 0 || !isRunning || isRefreshing || isShieldActive}
        >
          {labels.backspace}
        </button>
        <button
          type="button"
          onClick={onClear}
          disabled={tray.length === 0 || !isRunning || isRefreshing || isShieldActive}
        >
          {labels.clear}
        </button>
      </section>

      <button type="button" className="restartButton" onClick={onRestart}>
        {isRunning ? labels.restartRound : labels.playAgain}
      </button>

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
