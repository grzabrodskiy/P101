import type {
  BaseTileCount,
  DifficultyPresetKey,
  MaxBounces,
  RoundDurationSeconds,
  SpeedMultiplier
} from "../game/constants";
import type { LanguageCode } from "../game/i18n";

type OptionsModalProps = {
  isOpen: boolean;
  language: LanguageCode;
  duration: RoundDurationSeconds;
  baseTileCount: BaseTileCount;
  speedMultiplier: SpeedMultiplier;
  maxBounces: MaxBounces;
  difficultyPreset: DifficultyPresetKey | "custom";
  languageOptions: Array<{ code: LanguageCode; label: string }>;
  difficultyPresetOptions: Array<{ key: DifficultyPresetKey | "custom"; label: string }>;
  durationOptions: Array<{ seconds: RoundDurationSeconds; label: string }>;
  baseTileCountOptions: BaseTileCount[];
  speedMultiplierOptions: SpeedMultiplier[];
  maxBouncesOptions: MaxBounces[];
  onLanguageChange: (language: LanguageCode) => void;
  onDurationChange: (seconds: RoundDurationSeconds) => void;
  onBaseTileCountChange: (count: BaseTileCount) => void;
  onSpeedMultiplierChange: (value: SpeedMultiplier) => void;
  onMaxBouncesChange: (value: MaxBounces) => void;
  onDifficultyPresetChange: (preset: DifficultyPresetKey) => void;
  onClose: () => void;
  labels: {
    title: string;
    difficulty: string;
    language: string;
    duration: string;
    lettersOnScreen: string;
    speed: string;
    bounces: string;
    speedOptionLabel: (value: SpeedMultiplier) => string;
    close: string;
  };
};

export function OptionsModal({
  isOpen,
  language,
  duration,
  baseTileCount,
  speedMultiplier,
  maxBounces,
  difficultyPreset,
  languageOptions,
  difficultyPresetOptions,
  durationOptions,
  baseTileCountOptions,
  speedMultiplierOptions,
  maxBouncesOptions,
  onLanguageChange,
  onDurationChange,
  onBaseTileCountChange,
  onSpeedMultiplierChange,
  onMaxBouncesChange,
  onDifficultyPresetChange,
  onClose,
  labels
}: OptionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modalBackdrop" role="presentation" onClick={onClose}>
      <section
        className="languageModal"
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        onClick={(event) => event.stopPropagation()}
      >
        <h2>{labels.title}</h2>
        <div className="setupTable">
          <label className="setupLabel" htmlFor="options-difficulty-select">
            {labels.difficulty}
          </label>
          <select
            id="options-difficulty-select"
            className="setupSelect"
            value={difficultyPreset}
            onChange={(event) => {
              const selected = event.target.value as DifficultyPresetKey | "custom";
              if (selected === "custom") return;
              onDifficultyPresetChange(selected);
            }}
          >
            {difficultyPresetOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="setupLabel" htmlFor="options-language-select">
            {labels.language}
          </label>
          <select
            id="options-language-select"
            className="setupSelect"
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as LanguageCode)}
          >
            {languageOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="setupLabel" htmlFor="options-duration-select">
            {labels.duration}
          </label>
          <select
            id="options-duration-select"
            className="setupSelect"
            value={duration}
            onChange={(event) => onDurationChange(Number(event.target.value) as RoundDurationSeconds)}
          >
            {durationOptions.map((option) => (
              <option key={option.seconds} value={option.seconds}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="setupLabel" htmlFor="options-letters-select">
            {labels.lettersOnScreen}
          </label>
          <select
            id="options-letters-select"
            className="setupSelect"
            value={baseTileCount}
            onChange={(event) => onBaseTileCountChange(Number(event.target.value) as BaseTileCount)}
          >
            {baseTileCountOptions.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
              ))}
            </select>

          <label className="setupLabel" htmlFor="options-speed-select">
            {labels.speed}
          </label>
          <select
            id="options-speed-select"
            className="setupSelect"
            value={speedMultiplier}
            onChange={(event) => onSpeedMultiplierChange(Number(event.target.value) as SpeedMultiplier)}
          >
            {speedMultiplierOptions.map((value) => (
              <option key={value} value={value}>
                {labels.speedOptionLabel(value)}
              </option>
            ))}
          </select>

          <label className="setupLabel" htmlFor="options-bounces-select">
            {labels.bounces}
          </label>
          <select
            id="options-bounces-select"
            className="setupSelect"
            value={maxBounces}
            onChange={(event) => onMaxBouncesChange(Number(event.target.value) as MaxBounces)}
          >
            {maxBouncesOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <button type="button" onClick={onClose}>
          {labels.close}
        </button>
      </section>
    </div>
  );
}
