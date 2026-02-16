import type { PowerUpKind } from "../game/types";
import { PowerUpIcon } from "./PowerUpIcon";

type HelpModalProps = {
  isOpen: boolean;
  powerUpOrder: PowerUpKind[];
  powerUpHelpByKind: Record<PowerUpKind, string>;
  onClose: () => void;
  labels: {
    title: string;
    howToTitle: string;
    lineBuildWords: string;
    lineTapLetters: string;
    lineSubmitValid: string;
    linePowerUps: string;
    scoringTitle: string;
    lineBonusTiles: string;
    lineWordMultiplierStack: string;
    roundsTitle: string;
    lineRoundsGoal: string;
    lineRoundsEnd: string;
    powerUpsTitle: string;
    close: string;
  };
};

export function HelpModal({
  isOpen,
  powerUpOrder,
  powerUpHelpByKind,
  onClose,
  labels
}: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modalBackdrop" role="presentation" onClick={onClose}>
      <section
        className="helpModal"
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>{labels.title}</h2>

        <h3>{labels.howToTitle}</h3>
        <ul>
          <li>{labels.lineBuildWords}</li>
          <li>{labels.lineTapLetters}</li>
          <li>{labels.lineSubmitValid}</li>
          <li>{labels.linePowerUps}</li>
        </ul>

        <h3>{labels.scoringTitle}</h3>
        <ul>
          <li>{labels.lineBonusTiles}</li>
          <li>{labels.lineWordMultiplierStack}</li>
        </ul>

        <h3>{labels.roundsTitle}</h3>
        <ul>
          <li>{labels.lineRoundsGoal}</li>
          <li>{labels.lineRoundsEnd}</li>
        </ul>

        <h3>{labels.powerUpsTitle}</h3>
        <ul className="helpPowerUps">
          {powerUpOrder.map((kind) => (
            <li key={kind}>
              <strong className={`helpPowerUpGlyph powerup-${kind}`}>
                <PowerUpIcon kind={kind} />
              </strong>
              <span>{powerUpHelpByKind[kind]}</span>
            </li>
          ))}
        </ul>

        <button type="button" onClick={onClose}>
          {labels.close}
        </button>
      </section>
    </div>
  );
}
