type GameHudProps = {
  scoreProgress: string;
  timeLeft: number;
  letterCount: number;
  targetCount: number;
  languageLabel: string;
  roundLabel: string;
  comboLabel: string;
  comboIsPulsing: boolean;
  labels: {
    timeLeft: string;
    flyingLetters: string;
    target: string;
    language: string;
    round: string;
    combo: string;
  };
};

export function GameHud({
  scoreProgress,
  timeLeft,
  letterCount,
  targetCount,
  languageLabel,
  roundLabel,
  comboLabel,
  comboIsPulsing,
  labels
}: GameHudProps) {
  return (
    <section className="hud">
      <span>{scoreProgress}</span>
      <span>{labels.timeLeft}: {timeLeft}s</span>
      <span>{labels.round}: {roundLabel}</span>
      <span>{labels.flyingLetters}: {letterCount}</span>
      <span>{labels.target}: {targetCount}</span>
      <span className={comboIsPulsing ? "hudCombo hudComboPulse" : "hudCombo"}>
        {labels.combo}: {comboLabel}
      </span>
      <span>{labels.language}: {languageLabel}</span>
    </section>
  );
}
