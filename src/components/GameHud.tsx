type GameHudProps = {
  scoreProgress: string;
  timeLeft: number;
  letterCount: number;
  languageLabel: string;
  roundLabel: string;
  comboLabel: string;
  comboIsPulsing: boolean;
  labels: {
    score: string;
    timeLeft: string;
    flyingLetters: string;
    language: string;
    round: string;
    combo: string;
  };
};

export function GameHud({
  scoreProgress,
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
          <span className="hudLabel">{labels.score}</span>
          <span className="hudValue">{scoreProgress}</span>
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
