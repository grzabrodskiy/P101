# Word Bouncer Game Spec

## Goal
Build words by tapping flying Scrabble-style letter tiles and submit valid words for points.

## Core Gameplay
- Game field is a square play area.
- Gameplay is endless multi-round progression.
- Game runs in timed rounds selected before start: `60s`, `90s`, or `120s` (`90s` default).
- Base active letter count defaults to `8` and is configurable.
- Letter tiles move continuously with velocity vectors.
- Letter tiles enter by crossing the boundary from outside the square.
- On wall collision, a tile is reflected and wall-hit count increments.
- A tile reflects for the configured number of wall hits (default `3`).
- On the next wall hit, it exits through the boundary and disappears.
- Base movement speed is configurable in options (`Slow`, `Normal`, `Fast`).
- Letter spawn frequency is inversely correlated with Scrabble value.
- Common low-value letters (for example `E`, `T`, `O`) appear more often.
- High-value letters (for example `Q`, `Z`) appear less often.
- Active tile alphabet, frequencies, and letter scores depend on selected language.
- Example: Russian uses Cyrillic tiles and language-specific scoring/weights.
- When timer reaches `0`, round stops and interactions are disabled.
- When timer reaches `0`, player advances to the next round.
- There is no final round cap; difficulty keeps increasing by round.
- User can restart the current round or start a new game at any time.

## Power-Up System
- Power-ups are rendered in the field and move like letters.
- Power-ups use the same enter/reflect/exit lifecycle as letters.
- User activates power-ups by click/tap on the power-up tile.
- At most one power-up tile is active at a time; a new one respawns after a short delay.
- All power-up effects are temporary: they either resolve naturally immediately, or expire within `30` seconds.

## Implemented Power-Ups
- `💣 Bomb`: clears all letters and triggers explosion; letters repopulate one by one.
- `x2 Multiplier`: doubles active letter target from `8` to `16` for `12s`.
- `❄️ Freeze`: freezes movement for `5s`.
- `🛡️ Shield`: prevents tray backspace/clear for `10s`.
- `* Wild`: adds wildcard tile to tray (`*`, value `0`).
- `🔁 Reroll`: rerolls low-value letters (`1-point` letters).
- `⏳ Slow Time`: slows movement for `8s`.
- `DW Double Word`: doubles score of next valid submitted word, expires in `30s` if unused.
- `🧲 Magnet`: letters drift toward pointer for `8s`.
- `+10 Extra Time`: adds `10` seconds to round timer.
- `🔒 Lock Letter`: next collected tray letter becomes locked; lock charges expire in `30s`.
- `🧹 Purge Rare`: replaces high-value rare letters (`8+` points).

## Letter Count Rules
- Base active letter count is configurable in options (`6`, `8`, `10`, `12`).
- During active `x2`, target active letters is `base * 2`.
- When `x2` ends, target returns to configured base count.
- If current letter count is above target, extra letters are not force-removed.
- Count naturally drains back to target via collection/expiration.

## Input and Interaction
- User can collect a letter tile with mouse click or touch (pointer input).
- Collected letter is removed from field and appended to tray.
- Tray order defines submitted word order.
- Controls include `Submit Word`, `Backspace`, `Clear`, and `Restart Round` / `Play Again`.
- Locked tray letters cannot be removed by `Backspace`/`Clear`.

## Menu
- A top-level in-game menu is available from a menu button.
- Menu actions include:
- `Pause/Resume`: toggles gameplay/timer progression.
- `Options`: opens a popup for game options.
- `Help`: opens a popup with quick gameplay instructions and power-up descriptions.
- `Restart Round`: resets round state with current options.
- `New Game`: starts a fresh game session from zero with current options.
- While paused, gameplay interactions are disabled until resume.

## Options
- Options are managed in a popup opened from the menu.
- Difficulty presets are available: `Casual`, `Standard`, `Chaos`.
- Options include:
- language (`English`, `German`, `French`, `Italian`, `Russian`),
- round duration (`60s`, `90s`, `120s`),
- base letters on screen (`6`, `8`, `10`, `12`),
- speed (`Slow`, `Normal`, `Fast`),
- max bounces (`2`, `3`, `4`, `5`).
- Presets update speed, bounce count, base letter count, and power-up respawn cadence together.
- Manual tuning sets difficulty to `Custom`.
- Changing any option automatically restarts the game immediately.
- Automatic restart on options change resets score and accepted words.

## Round Goals
- Each round has one goal: reach the score target.
- Score target scales by round and is the same for every difficulty: `45` in round 1, `60` in round 2, `75` in round 3, etc.
- Next round unlocks only if the round score goal is met.
- If the score goal is missed when the timer ends, the run ends (game over) and player starts a new game.
- Goal progress is shown in the top HUD as `current/target` (for example `0/45`).

## Help Popup
- Help is shown as a modal popup opened from the in-game menu.
- Popup includes a brief "how to play" section.
- Popup lists all power-ups with icon/label and effect description.
- Help content is localized with the currently selected game language.

## Word Validation
- Submitted word must be at least `4` characters.
- Validation is performed against a dictionary API using the selected language locale.
- There is no local fallback dictionary; if API lookup fails, word validation fails.
- Wildcard words are evaluated by trying dictionary-valid substitutions.
- Invalid words do not score and tray remains unchanged.

## Scoring
- Each letter uses language-specific Scrabble-like point values.
- Word score is sum of tray letter values at submit time.
- Length bonus is added: `+0` for `4` letters; for `5+`, bonus doubles each extra letter (`+2`, `+4`, `+8`, `+16`, ...).
- Wildcard tile value is `0`.
- If `DW` is active, next valid word score is doubled.
- Combo scoring is active:
- valid submits within `8s` chain combo;
- combo multiplier starts at `x1.00`, increases by `+0.25` per chain step, capped at `x2.00`;
- combo resets when timer expires.
- On valid submit, add points to total score, record accepted word, then clear tray.
- Score is cumulative across endless rounds until user starts a new game.

## UI Requirements
- Show current total score.
- Show time remaining in seconds.
- Show active and target letter counts.
- Show active effect states/timers.
- Effects panel is shown in the right-side control column and remains mounted to avoid board layout jumps.
- Active effect names are localized to the selected language.
- Show status messages for game events and validation.
- Status message is displayed directly below the game board.
- Show tray word and computed points.
- Show accepted words list with points.
- Show current round number in HUD.
- Show score-goal progress in HUD as `current/target`.
- Show live combo multiplier (and remaining combo window while active) in HUD.
- Combo HUD value pulses when combo increases.
- Show between-round overlay with round goal completion bonus summary.
- Successful submits show floating in-field score popups (and combo popup when combo increases).
- Power-ups use a unified icon system (emoji glyph + optional mini badge like `x2`, `DW`, `+10`) in-field and in Help.
- Power-up circles are color-coded with distinct gradients and subtle glow to improve at-a-glance recognition.
- On desktop, controls/tray are to the right of the square.
- On smaller screens, layout stacks vertically and remains touch-friendly.

## Technical Constraints
- Frontend stack: React + TypeScript + Vite.
- Application source code lives under `src/`.
- `App.tsx` should stay thin and orchestration-focused.
- Core gameplay state/loop logic should live in a dedicated `GameBoard` component.
- Run locally with `pnpm run dev` (`127.0.0.1:5173`, strict port).
- Production build output directory is `build/`.

## Phase 3 Progression Tuning
- Round pace scales with round index (`+12%` movement speed per round).
- Power-up respawn cadence also accelerates with round pace.

## Localization
- UI supports 5 languages: English (default), German, French, Italian, Russian.
- Language, duration, speed, and bounce count are configurable in the Options popup.
- UI labels, controls, status messages, and power-up descriptions are localized.
- Dictionary validation requests use the currently selected language locale.
- Word generation and wildcard substitution also use the currently selected language alphabet.

## Current Non-Goals
- No multiplayer.
- No persistence/profile progression.
- No bundled large offline dictionary dataset.
