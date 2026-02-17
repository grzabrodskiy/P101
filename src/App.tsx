import { useState } from "react";

import { GameBoard } from "./components/GameBoard";
import { OptionsModal } from "./components/OptionsModal";
import {
  BASE_TILE_COUNT_OPTIONS,
  DIFFICULTY_PRESETS,
  MAX_BOUNCES_OPTIONS,
  POWERUP_RESPAWN_MS,
  ROUND_DURATION_OPTIONS,
  ROUND_SECONDS,
  SPEED_MULTIPLIER_OPTIONS,
  type BaseTileCount,
  type DifficultyPresetKey,
  type MaxBounces,
  type RoundDurationSeconds,
  type SpeedMultiplier
} from "./game/constants";
import { LANGUAGE_OPTIONS, type LanguageCode, UI_TEXT } from "./game/i18n";

function detectPreset(
  baseTileCount: BaseTileCount,
  speedMultiplier: SpeedMultiplier,
  maxBounces: MaxBounces,
  powerUpRespawnMs: number
): DifficultyPresetKey | "custom" {
  const found = (Object.entries(DIFFICULTY_PRESETS) as Array<[DifficultyPresetKey, (typeof DIFFICULTY_PRESETS)[DifficultyPresetKey]]>)
    .find(([, preset]) =>
      preset.baseTileCount === baseTileCount &&
      preset.speedMultiplier === speedMultiplier &&
      preset.maxBounces === maxBounces &&
      preset.powerUpRespawnMs === powerUpRespawnMs
    );
  return found?.[0] ?? "custom";
}

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [roundSeconds, setRoundSeconds] = useState<RoundDurationSeconds>(ROUND_SECONDS);
  const [baseTileCount, setBaseTileCount] = useState<BaseTileCount>(DIFFICULTY_PRESETS.standard.baseTileCount);
  const [speedMultiplier, setSpeedMultiplier] = useState<SpeedMultiplier>(DIFFICULTY_PRESETS.standard.speedMultiplier);
  const [maxBounces, setMaxBounces] = useState<MaxBounces>(DIFFICULTY_PRESETS.standard.maxBounces);
  const [powerUpRespawnMs, setPowerUpRespawnMs] = useState(POWERUP_RESPAWN_MS);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [draftLanguage, setDraftLanguage] = useState<LanguageCode>(language);
  const [draftRoundSeconds, setDraftRoundSeconds] = useState<RoundDurationSeconds>(roundSeconds);
  const [draftBaseTileCount, setDraftBaseTileCount] = useState<BaseTileCount>(baseTileCount);
  const [draftSpeedMultiplier, setDraftSpeedMultiplier] = useState<SpeedMultiplier>(speedMultiplier);
  const [draftMaxBounces, setDraftMaxBounces] = useState<MaxBounces>(maxBounces);
  const [draftPowerUpRespawnMs, setDraftPowerUpRespawnMs] = useState(powerUpRespawnMs);

  const t = UI_TEXT[language];
  const selectedPreset = detectPreset(
    draftBaseTileCount,
    draftSpeedMultiplier,
    draftMaxBounces,
    draftPowerUpRespawnMs
  );

  function applyPresetToDraft(presetKey: DifficultyPresetKey) {
    const preset = DIFFICULTY_PRESETS[presetKey];
    setDraftBaseTileCount(preset.baseTileCount);
    setDraftSpeedMultiplier(preset.speedMultiplier);
    setDraftMaxBounces(preset.maxBounces);
    setDraftPowerUpRespawnMs(preset.powerUpRespawnMs);
  }

  function openOptionsModal() {
    setDraftLanguage(language);
    setDraftRoundSeconds(roundSeconds);
    setDraftBaseTileCount(baseTileCount);
    setDraftSpeedMultiplier(speedMultiplier);
    setDraftMaxBounces(maxBounces);
    setDraftPowerUpRespawnMs(powerUpRespawnMs);
    setIsOptionsModalOpen(true);
  }

  function cancelOptionsModal() {
    setIsOptionsModalOpen(false);
  }

  function applyOptionsAndRestart() {
    setLanguage(draftLanguage);
    setRoundSeconds(draftRoundSeconds);
    setBaseTileCount(draftBaseTileCount);
    setSpeedMultiplier(draftSpeedMultiplier);
    setMaxBounces(draftMaxBounces);
    setPowerUpRespawnMs(draftPowerUpRespawnMs);
    setIsOptionsModalOpen(false);
  }

  return (
    <main className="app">
      <OptionsModal
        isOpen={isOptionsModalOpen}
        language={draftLanguage}
        duration={draftRoundSeconds}
        baseTileCount={draftBaseTileCount}
        speedMultiplier={draftSpeedMultiplier}
        maxBounces={draftMaxBounces}
        difficultyPreset={selectedPreset}
        languageOptions={LANGUAGE_OPTIONS}
        difficultyPresetOptions={[
          { key: "casual", label: t.presetCasual },
          { key: "standard", label: t.presetStandard },
          { key: "chaos", label: t.presetChaos },
          { key: "custom", label: t.presetCustom }
        ]}
        durationOptions={ROUND_DURATION_OPTIONS.map((seconds) => ({
          seconds,
          label: `${t.roundDurationOptionLabel(seconds)} (${seconds}s)`
        }))}
        baseTileCountOptions={[...BASE_TILE_COUNT_OPTIONS]}
        speedMultiplierOptions={[...SPEED_MULTIPLIER_OPTIONS]}
        maxBouncesOptions={[...MAX_BOUNCES_OPTIONS]}
        onLanguageChange={setDraftLanguage}
        onDurationChange={setDraftRoundSeconds}
        onBaseTileCountChange={setDraftBaseTileCount}
        onSpeedMultiplierChange={setDraftSpeedMultiplier}
        onMaxBouncesChange={setDraftMaxBounces}
        onDifficultyPresetChange={applyPresetToDraft}
        onCancel={cancelOptionsModal}
        onApply={applyOptionsAndRestart}
        labels={{
          title: t.options,
          difficulty: t.difficulty,
          language: t.language,
          duration: t.roundDuration,
          lettersOnScreen: t.lettersOnScreen,
          speed: t.speed,
          bounces: t.bounces,
          speedOptionLabel: t.speedOptionLabel,
          cancel: t.cancel,
          applyAndRestart: t.applyAndRestart
        }}
      />

      <GameBoard
        language={language}
        roundSeconds={roundSeconds}
        baseTileCount={baseTileCount}
        speedMultiplier={speedMultiplier}
        maxBounces={maxBounces}
        powerUpRespawnMs={powerUpRespawnMs}
        isOptionsOpen={isOptionsModalOpen}
        onOpenOptions={openOptionsModal}
      />
    </main>
  );
}
