type GameMenuProps = {
  isOpen: boolean;
  isPaused: boolean;
  isRunning: boolean;
  onToggle: () => void;
  onPauseResume: () => void;
  onOpenHelp: () => void;
  onRestartRound: () => void;
  onNewGame: () => void;
  labels: {
    menuButton: string;
    menuTitle: string;
    help: string;
    pause: string;
    resume: string;
    restartRound: string;
    newGame: string;
    closeMenu: string;
  };
};

export function GameMenu({
  isOpen,
  isPaused,
  isRunning,
  onToggle,
  onPauseResume,
  onOpenHelp,
  onRestartRound,
  onNewGame,
  labels
}: GameMenuProps) {
  return (
    <section className="menuBar" aria-label={labels.menuTitle}>
      <button type="button" className="menuToggle" onClick={onToggle}>
        {labels.menuButton}
      </button>

      {isOpen && (
        <div className="menuPanel">
          <h2>{labels.menuTitle}</h2>
          <button type="button" onClick={onPauseResume} disabled={!isRunning}>
            {isPaused ? labels.resume : labels.pause}
          </button>
          <button type="button" onClick={onOpenHelp}>
            {labels.help}
          </button>
          <button type="button" onClick={onRestartRound}>
            {labels.restartRound}
          </button>
          <button type="button" onClick={onNewGame}>
            {labels.newGame}
          </button>
          <button type="button" onClick={onToggle}>
            {labels.closeMenu}
          </button>
        </div>
      )}
    </section>
  );
}
