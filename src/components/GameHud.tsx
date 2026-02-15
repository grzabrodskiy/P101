type GameHudProps = {
  score: number;
  timeLeft: number;
  letterCount: number;
  targetCount: number;
  activeEffects: string[];
};

export function GameHud({ score, timeLeft, letterCount, targetCount, activeEffects }: GameHudProps) {
  return (
    <>
      <section className="hud">
        <span>Total Score: {score}</span>
        <span>Time Left: {timeLeft}s</span>
        <span>Flying Letters: {letterCount}</span>
        <span>Target: {targetCount}</span>
      </section>

      {activeEffects.length > 0 && <p className="effects">Effects: {activeEffects.join(" · ")}</p>}
    </>
  );
}
