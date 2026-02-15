import { useState } from "react";

import { GameBoard } from "./components/GameBoard";
import { OptionsModal } from "./components/OptionsModal";
import {
  BASE_TILE_COUNT,
  BASE_TILE_COUNT_OPTIONS,
  MAX_BOUNCES_OPTIONS,
  ROUND_DURATION_OPTIONS,
  ROUND_SECONDS,
  SPEED_MULTIPLIER_OPTIONS,
  type BaseTileCount,
  type MaxBounces,
  type RoundDurationSeconds,
  type SpeedMultiplier
} from "./game/constants";
import { LANGUAGE_OPTIONS, type LanguageCode, UI_TEXT } from "./game/i18n";

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [roundSeconds, setRoundSeconds] = useState<RoundDurationSeconds>(ROUND_SECONDS);
  const [baseTileCount, setBaseTileCount] = useState<BaseTileCount>(BASE_TILE_COUNT);
  const [speedMultiplier, setSpeedMultiplier] = useState<SpeedMultiplier>(1);
  const [maxBounces, setMaxBounces] = useState<MaxBounces>(3);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const t = UI_TEXT[language];

  return (
    <main className="app">
      <OptionsModal
        isOpen={isOptionsModalOpen}
        language={language}
        duration={roundSeconds}
        baseTileCount={baseTileCount}
        speedMultiplier={speedMultiplier}
        maxBounces={maxBounces}
        languageOptions={LANGUAGE_OPTIONS}
        durationOptions={ROUND_DURATION_OPTIONS.map((seconds) => ({
          seconds,
          label: `${t.roundDurationOptionLabel(seconds)} (${seconds}s)`
        }))}
        baseTileCountOptions={[...BASE_TILE_COUNT_OPTIONS]}
        speedMultiplierOptions={[...SPEED_MULTIPLIER_OPTIONS]}
        maxBouncesOptions={[...MAX_BOUNCES_OPTIONS]}
        onLanguageChange={setLanguage}
        onDurationChange={setRoundSeconds}
        onBaseTileCountChange={setBaseTileCount}
        onSpeedMultiplierChange={setSpeedMultiplier}
        onMaxBouncesChange={setMaxBounces}
        onClose={() => setIsOptionsModalOpen(false)}
        labels={{
          title: t.options,
          language: t.language,
          duration: t.roundDuration,
          lettersOnScreen: t.lettersOnScreen,
          speed: t.speed,
          bounces: t.bounces,
          speedOptionLabel: t.speedOptionLabel,
          close: t.closeMenu
        }}
      />

      <GameBoard
        language={language}
        roundSeconds={roundSeconds}
        baseTileCount={baseTileCount}
        speedMultiplier={speedMultiplier}
        maxBounces={maxBounces}
        onOpenOptions={() => setIsOptionsModalOpen(true)}
      />
    </main>
  );
}
