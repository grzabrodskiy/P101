export type RoundGoalConfig = {
  score: number;
};

export function rollGoalConfig(round: number): RoundGoalConfig {
  return {
    score: 45 + (round - 1) * 15
  };
}
