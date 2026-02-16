import { useEffect, useMemo, useRef, useState } from "react";

import { isRealWord, wildcardCandidates } from "../game/logic";
import { trayBaseScore, trayTotalScore, trayWordMultiplier, wordLengthBonus } from "../game/scoring";
import type { LanguageCode } from "../game/i18n";
import type { Letter, SubmittedWord, Tile, TrayTile } from "../game/types";

type WordValidation = "too-short" | "checking" | "valid" | "invalid";

type WordTrayText = {
  wordMin4: string;
  trayInvalid: string;
  noValidWord: string;
  statusChecking: (word: string) => string;
};

type UseWordTrayParams = {
  language: LanguageCode;
  isRunning: boolean;
  isPaused: boolean;
  isRefreshing: boolean;
  text: WordTrayText;
  onSetStatus: (value: string) => void;
  onAddScore: (points: number) => void;
  onWordAccepted: (wordUpper: string, points: number) => void;
};

export function useWordTray({
  language,
  isRunning,
  isPaused,
  isRefreshing,
  text,
  onSetStatus,
  onAddScore,
  onWordAccepted
}: UseWordTrayParams) {
  const validateSeqRef = useRef(0);

  const [tray, setTray] = useState<TrayTile[]>([]);
  const [submittedWords, setSubmittedWords] = useState<SubmittedWord[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [wordValidation, setWordValidation] = useState<WordValidation>("too-short");

  const baseScore = useMemo(() => trayBaseScore(tray), [tray]);
  const wordMultiplier = useMemo(() => trayWordMultiplier(tray), [tray]);
  const lengthBonus = useMemo(() => wordLengthBonus(tray.length), [tray.length]);
  const score = useMemo(() => trayTotalScore(tray), [tray]);
  const canSubmit = isRunning && !isPaused && !isRefreshing && !isChecking && wordValidation === "valid";

  useEffect(() => {
    if (!isRunning || isRefreshing || tray.length < 4) {
      setWordValidation("too-short");
      return;
    }

    setWordValidation("checking");
    const seq = ++validateSeqRef.current;
    const timeout = setTimeout(async () => {
      const chars = tray.map((tile) => tile.char);
      const resolvedWord = await resolveSubmittedWord(chars, language);
      if (validateSeqRef.current !== seq) return;
      setWordValidation(resolvedWord ? "valid" : "invalid");
    }, 220);

    return () => clearTimeout(timeout);
  }, [tray, isRunning, isRefreshing, language]);

  function appendTile(tile: Tile) {
    setTray((previous) => [
      ...previous,
      {
        char: tile.char,
        value: tile.value,
        id: tile.id,
        letterMultiplier: tile.letterMultiplier,
        wordMultiplier: tile.wordMultiplier
      }
    ]);
  }

  function removeLast() {
    if (!isRunning || isPaused || isRefreshing) return;

    setTray((previous) => {
      for (let index = previous.length - 1; index >= 0; index -= 1) {
        if (!previous[index].locked) {
          return [...previous.slice(0, index), ...previous.slice(index + 1)];
        }
      }
      return previous;
    });
  }

  function clear() {
    if (!isRunning || isPaused || isRefreshing) return;
    setTray([]);
  }

  function resetWordState() {
    setTray([]);
    setSubmittedWords([]);
    setIsChecking(false);
    setWordValidation("too-short");
  }

  async function submitWord() {
    if (isChecking || !isRunning || isPaused || isRefreshing) return;
    if (tray.length < 4) {
      onSetStatus(text.wordMin4);
      return;
    }
    if (wordValidation !== "valid") {
      onSetStatus(text.trayInvalid);
      return;
    }

    const chars = tray.map((tile) => tile.char);

    setIsChecking(true);
    onSetStatus(text.statusChecking(chars.join("").toLowerCase()));
    const resolvedWord = await resolveSubmittedWord(chars, language);
    setIsChecking(false);

    if (!resolvedWord) {
      onSetStatus(text.noValidWord);
      return;
    }

    const awardedPoints = trayTotalScore(tray, resolvedWord.length);
    const upperWord = resolvedWord.toLocaleUpperCase(language);

    onAddScore(awardedPoints);
    onWordAccepted(upperWord, awardedPoints);
    setSubmittedWords((previous) => [...previous, { word: upperWord, points: awardedPoints }]);
    setTray([]);
  }

  return {
    tray,
    submittedWords,
    isChecking,
    canSubmit,
    wordValidation,
    trayBaseScore: baseScore,
    trayWordMultiplier: wordMultiplier,
    trayLengthBonus: lengthBonus,
    trayScore: score,
    appendTile,
    removeLast,
    clear,
    submitWord,
    resetWordState
  };
}

async function resolveSubmittedWord(chars: Array<Letter | "*">, language: LanguageCode): Promise<string | null> {
  const candidates = wildcardCandidates(chars, language);
  if (candidates.length === 0) return null;

  for (const candidate of candidates) {
    const isValid = await isRealWord(candidate.toLowerCase(), language);
    if (isValid) return candidate;
  }

  return null;
}
