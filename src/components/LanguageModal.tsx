import type { LanguageCode } from "../game/i18n";
import type { RoundDurationSeconds } from "../game/constants";

type LanguageModalProps = {
  isOpen: boolean;
  selectedLanguage: LanguageCode;
  selectedDuration: RoundDurationSeconds;
  options: Array<{ code: LanguageCode; label: string }>;
  durationOptions: Array<{ seconds: RoundDurationSeconds; label: string }>;
  onLanguageChange: (language: LanguageCode) => void;
  onDurationChange: (seconds: RoundDurationSeconds) => void;
  onStartRound: () => void;
  labels: {
    title: string;
    language: string;
    duration: string;
    startRound: string;
  };
};

export function LanguageModal({
  isOpen,
  selectedLanguage,
  selectedDuration,
  options,
  durationOptions,
  onLanguageChange,
  onDurationChange,
  onStartRound,
  labels
}: LanguageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modalBackdrop" role="presentation">
      <section className="languageModal" role="dialog" aria-modal="true" aria-label={labels.title}>
        <h2>{labels.title}</h2>
        <div className="setupTable">
          <label className="setupLabel" htmlFor="language-select">
            {labels.language}
          </label>
          <select
            id="language-select"
            className="setupSelect"
            value={selectedLanguage}
            onChange={(event) => onLanguageChange(event.target.value as LanguageCode)}
          >
            {options.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="setupLabel" htmlFor="duration-select">
            {labels.duration}
          </label>
          <select
            id="duration-select"
            className="setupSelect"
            value={selectedDuration}
            onChange={(event) => onDurationChange(Number(event.target.value) as RoundDurationSeconds)}
          >
            {durationOptions.map((option) => (
              <option key={option.seconds} value={option.seconds}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={onStartRound}>
          {labels.startRound}
        </button>
      </section>
    </div>
  );
}
