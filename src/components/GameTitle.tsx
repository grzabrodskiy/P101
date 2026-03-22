import type { LanguageCode } from "../game/i18n";

type GameTitleProps = {
  title: string;
  language: LanguageCode;
};

function getRotation(wordIndex: number, letterIndex: number) {
  return ((wordIndex * 5 + letterIndex * 3) % 5 - 2) * 0.7;
}

export function GameTitle({ title, language }: GameTitleProps) {
  const words = title
    .trim()
    .split(/\s+/u)
    .filter(Boolean)
    .map((word) => Array.from(word.toLocaleUpperCase(language)));

  return (
    <h1 className="tileTitle" aria-label={title}>
      <span className="tileTitleWords" aria-hidden="true">
        {words.map((word, wordIndex) => (
          <span key={`${word.join("")}-${wordIndex}`} className="tileTitleWord">
            {word.map((letter, letterIndex) => (
              <span
                key={`${letter}-${wordIndex}-${letterIndex}`}
                className="tileTitleTile"
                style={{ transform: `rotate(${getRotation(wordIndex, letterIndex)}deg)` }}
              >
                <span className="tileTitleLetter">{letter}</span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
