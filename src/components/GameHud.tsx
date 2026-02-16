type GameHudProps = {
  roundScoreProgress: string;
  totalScore: number;
  timeLeft: number;
  letterCount: number;
  languageLabel: string;
  roundLabel: string;
  comboLabel: string;
  comboIsPulsing: boolean;
  labels: {
    roundScore: string;
    totalScore: string;
    timeLeft: string;
    flyingLetters: string;
    language: string;
    round: string;
    combo: string;
  };
};

export function GameHud({
  roundScoreProgress,
  totalScore,
  timeLeft,
  letterCount,
  languageLabel,
  roundLabel,
  comboLabel,
  comboIsPulsing,
  labels
}: GameHudProps) {
  return (
    <section className="hud">
      <div className="hudTable">
        <div className="hudCell">
          <span className="hudLabel">{labels.roundScore}</span>
          <span className="hudValue">{roundScoreProgress}</span>
        </div>

        <div className="hudCell">
          <span className="hudLabel">{labels.totalScore}</span>
          <span className="hudValue">{totalScore}</span>
        </div>

        <div className="hudCell">
          <span className="hudLabel">{labels.timeLeft}</span>
          <span className={timeLeft < 10 ? "hudValue hudTimeLow" : "hudValue"}>{timeLeft}s</span>
        </div>

        <div className="hudCell">
          <span className="hudLabel">{labels.round}</span>
          <span className="hudValue">{roundLabel}</span>
        </div>

        <div className="hudCell">
          <span className="hudLabel">{labels.flyingLetters}</span>
          <span className="hudValue">{letterCount}</span>
        </div>

        <div className="hudCell">
          <span className="hudLabel">{labels.combo}</span>
          <span className={comboIsPulsing ? "hudValue hudCombo hudComboPulse" : "hudValue hudCombo"}>
            {comboLabel}
          </span>
        </div>

        <div className="hudCell">
          <span className="hudLabel">{labels.language}</span>
          <span className="hudValue">{languageLabel}</span>
        </div>
      </div>
    </section>
  );
}
