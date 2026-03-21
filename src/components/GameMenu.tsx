import { ACTION_ICONS } from "./actionIcons";

type GameMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onOpenOptions: () => void;
  onOpenHelp: () => void;
  labels: {
    menuButton: string;
    menuTitle: string;
    options: string;
    help: string;
    closeMenu: string;
  };
};

export function GameMenu({
  isOpen,
  onToggle,
  onOpenOptions,
  onOpenHelp,
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
          <button type="button" className="menuAction" onClick={onOpenOptions}>
            <span className="menuActionIcon" aria-hidden="true">{ACTION_ICONS.options}</span>
            <span>{labels.options}</span>
          </button>
          <button type="button" className="menuAction" onClick={onOpenHelp}>
            <span className="menuActionIcon" aria-hidden="true">{ACTION_ICONS.help}</span>
            <span>{labels.help}</span>
          </button>
          <button type="button" className="menuAction" onClick={onToggle}>
            <span className="menuActionIcon" aria-hidden="true">{ACTION_ICONS.close}</span>
            <span>{labels.closeMenu}</span>
          </button>
        </div>
      )}
    </section>
  );
}
