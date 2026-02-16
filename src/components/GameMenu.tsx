type GameMenuProps = {
  isOpen: boolean;
  isPaused: boolean;
  isRunning: boolean;
  onToggle: () => void;
  onPauseResume: () => void;
  onOpenOptions: () => void;
  onOpenHelp: () => void;
  onNewGame: () => void;
  labels: {
    menuButton: string;
    menuTitle: string;
    options: string;
    help: string;
    pause: string;
    resume: string;
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
  onOpenOptions,
  onOpenHelp,
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
          <button type="button" className="menuAction" onClick={onPauseResume} disabled={!isRunning}>
            <span className="menuActionIcon" aria-hidden="true">{isPaused ? "▶" : "⏸"}</span>
            <span>{isPaused ? labels.resume : labels.pause}</span>
          </button>
          <button type="button" className="menuAction" onClick={onOpenOptions}>
            <span className="menuActionIcon" aria-hidden="true">⚙️</span>
            <span>{labels.options}</span>
          </button>
          <button type="button" className="menuAction" onClick={onOpenHelp}>
            <span className="menuActionIcon" aria-hidden="true">❓</span>
            <span>{labels.help}</span>
          </button>
          <button type="button" className="menuAction" onClick={onNewGame}>
            <span className="menuActionIcon" aria-hidden="true">↻</span>
            <span>{labels.newGame}</span>
          </button>
          <button type="button" className="menuAction" onClick={onToggle}>
            <span className="menuActionIcon" aria-hidden="true">✕</span>
            <span>{labels.closeMenu}</span>
          </button>
        </div>
      )}
    </section>
  );
}
