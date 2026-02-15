import { useEffect, useMemo, useRef, useState } from "react";

const FIELD_SIZE = 480;
const TILE_SIZE = 42;
const MAX_BOUNCES = 3;
const ACTIVE_TILE_COUNT = 8;
const ROUND_SECONDS = 90;
const TRANSITION_SECONDS = 0.24;

const SCRABBLE_VALUES = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const SCRABBLE_BAG = [
  ...Array(9).fill("A"), ...Array(2).fill("B"), ...Array(2).fill("C"),
  ...Array(4).fill("D"), ...Array(12).fill("E"), ...Array(2).fill("F"),
  ...Array(3).fill("G"), ...Array(2).fill("H"), ...Array(9).fill("I"),
  "J", "K", ...Array(4).fill("L"), ...Array(2).fill("M"), ...Array(6).fill("N"),
  ...Array(8).fill("O"), ...Array(2).fill("P"), "Q", ...Array(6).fill("R"),
  ...Array(4).fill("S"), ...Array(6).fill("T"), ...Array(4).fill("U"),
  ...Array(2).fill("V"), ...Array(2).fill("W"), "X", ...Array(2).fill("Y"), "Z"
];

const FALLBACK_WORDS = new Set([
  "apple", "bird", "book", "cat", "code", "dog", "game", "green", "home", "house",
  "love", "note", "phone", "play", "road", "score", "stone", "sun", "tree", "word",
  "world"
]);

type Tile = {
  id: number;
  char: keyof typeof SCRABBLE_VALUES;
  value: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bounces: number;
  state: "entering" | "active" | "exiting";
  stateAge: number;
};

type TrayTile = {
  id: number;
  char: Tile["char"];
  value: number;
};

type SubmittedWord = {
  word: string;
  points: number;
};

function isTile(value: Tile | null): value is Tile {
  return value !== null;
}

function randomLetter(): { char: Tile["char"]; value: number } {
  const char = SCRABBLE_BAG[Math.floor(Math.random() * SCRABBLE_BAG.length)];
  return { char, value: SCRABBLE_VALUES[char] };
}

function randomVelocity(): { vx: number; vy: number } {
  const speed = 80 + Math.random() * 130;
  const angle = Math.random() * Math.PI * 2;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };
}

function makeTile(id: number): Tile {
  const { char, value } = randomLetter();
  const max = FIELD_SIZE - TILE_SIZE;
  const base = randomVelocity();
  const side = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;
  let vx = base.vx;
  let vy = base.vy;

  if (side === 0) {
    x = -TILE_SIZE * 0.75;
    y = Math.random() * max;
    vx = Math.abs(base.vx);
  } else if (side === 1) {
    x = FIELD_SIZE - TILE_SIZE * 0.25;
    y = Math.random() * max;
    vx = -Math.abs(base.vx);
  } else if (side === 2) {
    x = Math.random() * max;
    y = -TILE_SIZE * 0.75;
    vy = Math.abs(base.vy);
  } else {
    x = Math.random() * max;
    y = FIELD_SIZE - TILE_SIZE * 0.25;
    vy = -Math.abs(base.vy);
  }

  return {
    id,
    char,
    value,
    x,
    y,
    vx,
    vy,
    bounces: 0,
    state: "entering",
    stateAge: 0
  };
}

async function isRealWord(word: string): Promise<boolean> {
  if (word.length < 2) return false;
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) return false;
    const data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch {
    return FALLBACK_WORDS.has(word);
  }
}

export default function App() {
  const idRef = useRef(1);
  const frameRef = useRef<number | null>(null);
  const tickRef = useRef(0);
  const [tiles, setTiles] = useState<Tile[]>(() =>
    Array.from({ length: ACTIVE_TILE_COUNT }, () => makeTile(idRef.current++))
  );
  const [tray, setTray] = useState<TrayTile[]>([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("Tap flying letters to build a word.");
  const [submittedWords, setSubmittedWords] = useState<SubmittedWord[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const loop = (now: number) => {
      if (!tickRef.current) tickRef.current = now;
      const dt = Math.min(0.05, (now - tickRef.current) / 1000);
      tickRef.current = now;

      if (!isRunning) {
        frameRef.current = requestAnimationFrame(loop);
        return;
      }

      setTiles((prevTiles) =>
        {
          const nextTiles = prevTiles
          .map((tile) => {
            let { x, y, vx, vy, bounces, state, stateAge } = tile;
            stateAge += dt;
            x += vx * dt;
            y += vy * dt;

            if (state === "entering" && stateAge >= TRANSITION_SECONDS) {
              state = "active";
              stateAge = 0;
            }

            if (state === "exiting") {
              const outside =
                x < -TILE_SIZE * 1.2 ||
                x > FIELD_SIZE + TILE_SIZE * 0.2 ||
                y < -TILE_SIZE * 1.2 ||
                y > FIELD_SIZE + TILE_SIZE * 0.2;
              if (outside || stateAge >= TRANSITION_SECONDS) return null;
              return { ...tile, x, y, vx, vy, bounces, state, stateAge };
            }

            let startedExit = false;

            if (x <= 0) {
              bounces += 1;
              if (bounces >= MAX_BOUNCES) {
                startedExit = true;
                state = "exiting";
                stateAge = 0;
                x = -2;
                vx = -Math.abs(vx);
              } else {
                x = 0;
                vx = Math.abs(vx);
              }
            } else if (x >= FIELD_SIZE - TILE_SIZE) {
              bounces += 1;
              if (bounces >= MAX_BOUNCES) {
                startedExit = true;
                state = "exiting";
                stateAge = 0;
                x = FIELD_SIZE - TILE_SIZE + 2;
                vx = Math.abs(vx);
              } else {
                x = FIELD_SIZE - TILE_SIZE;
                vx = -Math.abs(vx);
              }
            }

            if (!startedExit) {
              if (y <= 0) {
                bounces += 1;
                if (bounces >= MAX_BOUNCES) {
                  state = "exiting";
                  stateAge = 0;
                  y = -2;
                  vy = -Math.abs(vy);
                } else {
                  y = 0;
                  vy = Math.abs(vy);
                }
              } else if (y >= FIELD_SIZE - TILE_SIZE) {
                bounces += 1;
                if (bounces >= MAX_BOUNCES) {
                  state = "exiting";
                  stateAge = 0;
                  y = FIELD_SIZE - TILE_SIZE + 2;
                  vy = Math.abs(vy);
                } else {
                  y = FIELD_SIZE - TILE_SIZE;
                  vy = -Math.abs(vy);
                }
              }
            }

            return { ...tile, x, y, vx, vy, bounces, state, stateAge };
          })
          .filter(isTile);

          while (nextTiles.length < ACTIVE_TILE_COUNT) {
            nextTiles.push(makeTile(idRef.current++));
          }

          return nextTiles;
        }
      );

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return undefined;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setStatus("Time is up. Submit again after restart.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const trayWord = useMemo(() => tray.map((tile) => tile.char).join(""), [tray]);
  const trayScore = useMemo(() => tray.reduce((sum, tile) => sum + tile.value, 0), [tray]);

  function collectTile(tileId: number) {
    if (!isRunning) return;
    setTiles((prev) => {
      const found = prev.find((tile) => tile.id === tileId);
      if (!found) return prev;
      setTray((old) => [...old, { char: found.char, value: found.value, id: found.id }]);
      const nextTiles = prev.filter((tile) => tile.id !== tileId);
      nextTiles.push(makeTile(idRef.current++));
      return nextTiles;
    });
  }

  async function submitWord() {
    if (isChecking || !isRunning) return;
    const word = trayWord.toLowerCase();
    if (word.length < 2) {
      setStatus("Word must have at least 2 letters.");
      return;
    }

    setIsChecking(true);
    setStatus(`Checking "${word}"...`);
    const valid = await isRealWord(word);
    setIsChecking(false);

    if (!valid) {
      setStatus(`"${word}" is not in dictionary.`);
      return;
    }

    setScore((prev) => prev + trayScore);
    setSubmittedWords((prev) => [...prev, { word: word.toUpperCase(), points: trayScore }]);
    setTray([]);
    setStatus(`Great word: ${word.toUpperCase()} (+${trayScore})`);
  }

  function removeLastFromTray() {
    if (!isRunning) return;
    setTray((prev) => prev.slice(0, -1));
  }

  function clearTray() {
    if (!isRunning) return;
    setTray([]);
  }

  function restartGame() {
    idRef.current = 1;
    tickRef.current = 0;
    setTiles(Array.from({ length: ACTIVE_TILE_COUNT }, () => makeTile(idRef.current++)));
    setTray([]);
    setScore(0);
    setSubmittedWords([]);
    setIsChecking(false);
    setTimeLeft(ROUND_SECONDS);
    setIsRunning(true);
    setStatus("Tap flying letters to build a word.");
  }

  return (
    <main className="app">
      <h1>Scrabble Bounce</h1>
      <p className="status">{status}</p>

      <section className="hud">
        <span>Total Score: {score}</span>
        <span>Time Left: {timeLeft}s</span>
        <span>Flying Letters: {tiles.length}</span>
      </section>

      <section className="gameLayout">
        <section
          className="field"
          style={{ width: FIELD_SIZE, height: FIELD_SIZE }}
          aria-label="Flying letter area"
        >
          {tiles.map((tile) => (
            <button
              key={tile.id}
              type="button"
              className="tile"
              onPointerDown={() => collectTile(tile.id)}
              disabled={!isRunning}
              style={{
                transform: `translate(${tile.x}px, ${tile.y}px)`,
                opacity:
                  tile.state === "entering"
                    ? Math.min(1, tile.stateAge / TRANSITION_SECONDS)
                    : tile.state === "exiting"
                      ? Math.max(0, 1 - tile.stateAge / TRANSITION_SECONDS)
                      : 1
              }}
              aria-label={`Letter ${tile.char}`}
            >
              <span className="letter">{tile.char}</span>
              <span className="value">{tile.value}</span>
            </button>
          ))}
        </section>

        <section className="sidePanel">
          <section className="tray" aria-label="Word builder">
            <div className="trayWord">{trayWord || "Tap letters to build a word"}</div>
            <div className="trayScore">Word Points: {trayScore}</div>
          </section>

          <section className="controls">
            <button
              type="button"
              onClick={submitWord}
              disabled={tray.length === 0 || isChecking || !isRunning}
            >
              {isChecking ? "Checking..." : "Submit Word"}
            </button>
            <button type="button" onClick={removeLastFromTray} disabled={tray.length === 0 || !isRunning}>
              Backspace
            </button>
            <button type="button" onClick={clearTray} disabled={tray.length === 0 || !isRunning}>
              Clear
            </button>
          </section>

          <button type="button" className="restartButton" onClick={restartGame}>
            {isRunning ? "Restart Round" : "Play Again"}
          </button>

          <section className="submitted">
            <h2>Accepted Words</h2>
            {submittedWords.length === 0 ? (
              <p className="empty">None yet</p>
            ) : (
              <ul>
                {submittedWords
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <li key={`${entry.word}-${index}`}>
                      <span>{entry.word}</span>
                      <strong>+{entry.points}</strong>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        </section>
      </section>
    </main>
  );
}
