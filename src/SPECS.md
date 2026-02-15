# Scrabble Bounce Game Spec

## Goal
Build words by tapping flying Scrabble-style letter tiles and submit valid words for points.

## Core Gameplay
- Game field is a square play area.
- Game runs in timed rounds of `90` seconds.
- Letter tiles move continuously with velocity vectors.
- Tiles bounce off walls with reflection physics.
- Each wall collision increments that tile's bounce count.
- A tile disappears after `3` wall collisions.
- New tiles spawn over time to keep gameplay active.
- When timer reaches `0`, round stops and interactions are disabled.
- User can restart a new round at any time.

## Input and Interaction
- User can collect a tile with mouse click or touch (pointer input).
- Collected tile is removed from the field and appended to the word tray at the bottom.
- Tray order defines the submitted word.
- Controls include `Submit Word` (validate and score), `Backspace` (remove last tray letter), and `Clear` (empty tray).
- Controls also include `Restart Round` / `Play Again` to reset all round state.

## Word Validation
- Submitted word must be at least 2 letters.
- Validation is performed against an English dictionary API.
- If API is unavailable, a small local fallback dictionary is used.
- Invalid words do not score and tray remains unchanged.

## Scoring
- Each letter uses standard Scrabble point values.
- Word score is the sum of collected letters in the tray at submit time.
- On valid submit, add word score to total score, add accepted word and points to history, then clear tray.

## UI Requirements
- Show current total score.
- Show time remaining in seconds.
- Show count of active flying tiles.
- Show status messages for errors/success/validation.
- Show current tray word and its computed points.
- Show accepted words list with awarded points.
- Layout supports desktop and mobile widths.

## Technical Constraints
- Frontend stack: React + Vite.
- Run locally with `pnpm run dev` (`127.0.0.1:5173`, strict port).
- Build check with `pnpm build`.

## Current Non-Goals
- No multiplayer.
- No persistent storage.
- No advanced dictionary dataset bundled offline.
