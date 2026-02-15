type GameHudProps = {
  score: number;
  timeLeft: number;
  letterCount: number;
  targetCount: number;
  languageLabel: string;
  labels: {
    totalScore: string;
    timeLeft: string;
    flyingLetters: string;
    target: string;
    language: string;
  };
};

export function GameHud({
  score,
  timeLeft,
  letterCount,
  targetCount,
  languageLabel,
  labels
}: GameHudProps) {
  return (
    <section className="hud">
      <span>{labels.totalScore}: {score}</span>
      <span>{labels.timeLeft}: {timeLeft}s</span>
      <span>{labels.flyingLetters}: {letterCount}</span>
      <span>{labels.target}: {targetCount}</span>
      <span>{labels.language}: {languageLabel}</span>
    </section>
  );
}
