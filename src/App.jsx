import { useEffect, useMemo, useState } from "react";

const GAME_TIME_SECONDS = 20;
const FIELD_SIZE = 300;
const TARGET_SIZE = 44;

function randomPosition() {
  const max = FIELD_SIZE - TARGET_SIZE;
  return {
    x: Math.floor(Math.random() * max),
    y: Math.floor(Math.random() * max)
  };
}

export default function App() {
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState(randomPosition());
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      setIsRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isRunning]);

  const gameStatus = useMemo(() => {
    if (isRunning) return "Tap the moving target!";
    return `Time is up. Final score: ${score}`;
  }, [isRunning, score]);

  function handleHit() {
    if (!isRunning) return;
    setScore((prev) => prev + 1);
    setPosition(randomPosition());
  }

  function resetGame() {
    setScore(0);
    setTimeLeft(GAME_TIME_SECONDS);
    setPosition(randomPosition());
    setIsRunning(true);
  }

  return (
    <main className="app">
      <h1>Tap Target</h1>
      <p className="status">{gameStatus}</p>

      <section className="hud">
        <span>Time: {Math.max(timeLeft, 0)}s</span>
        <span>Score: {score}</span>
      </section>

      <section className="field" aria-label="Game area">
        <button
          type="button"
          className="target"
          style={{ left: position.x, top: position.y }}
          onClick={handleHit}
          disabled={!isRunning}
          aria-label="Tap target"
        />
      </section>

      <button type="button" className="reset" onClick={resetGame}>
        {isRunning ? "Restart" : "Play Again"}
      </button>
    </main>
  );
}
