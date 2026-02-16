# Word Constructor Game Spec

## Goal
Build words by tapping flying Scrabble-style letter tiles and submit valid words for points.

## Core Gameplay
- Game field is a square play area.
- Gameplay is endless multi-round progression.
- Game runs in timed rounds selected before start: `60s`, `90s`, or `120s` (`90s` default).
- Base active letter count defaults to `8` and is configurable.
- Letter tiles move continuously with velocity vectors.
- Baseline tile speed is slightly reduced for better readability/control.
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
- `💣 Bomb`: destroys one currently flying letter.
- `x2 Multiplier`: doubles active letter target (`base * 2`) for `12s`.
- `❄️ Freeze`: freezes movement for `5s`.
- `🧱 Wall`: prevents existing letters from leaving the field for `15s` (new spawns still occur normally).
- `⏳ Slow Time`: slows movement for `8s`.
- `+10 Extra Time`: adds `10` seconds to round timer.
- `+15 Extra Time`: adds `15` seconds to round timer.

## Letter Count Rules
- Base active letter count is configurable in options (`6`, `8`, `10`, `12`).
- During active `x2`, target active letters is `base * 2`.
- When `x2` ends, target returns to configured base count.
- If current letter count is above target, extra letters are not force-removed.
- Count naturally drains back to target via collection/expiration.

## Bonus Tile Multipliers
- Some letter tiles spawn with value modifiers similar to Scrabble bonuses:
- `DL` (double letter): tile letter value is multiplied by `2`.
- `TL` (triple letter): tile letter value is multiplied by `3`.
- `DW` (double word): total built-word value is multiplied by `2`.
- `TW` (triple word): total built-word value is multiplied by `3`.
- `DL`/`TL` tiles are highlighted by border color (`blue`/`red`).
- `DW`/`TW` tiles are highlighted by background color changes.
- Bonus markers (`DL`, `TL`, `DW`, `TW`) are rendered on tiles.
- Bonus properties persist when a tile is collected into the tray.

## Input and Interaction
- User can collect a letter tile with mouse click or touch (pointer input).
- Collected letter is removed from field and appended to tray.
- Tray order defines submitted word order.
- Selected letters are displayed as Scrabble-style tiles in tray.
- Tray tiles show both letter glyph and point value.
- Controls include `Submit Word`, `Backspace`, `Clear`, and `New Game` (full restart).
- Main action controls are icon buttons with localized tooltips/labels.
- Submit/Backspace/Clear/Restart actions are arranged in one row of compact square icon buttons.

## Menu
- A top-level in-game menu is available from a menu button.
- Menu actions include:
- `Pause/Resume`: toggles gameplay/timer progression.
- `Options`: opens a popup for game options.
- `Help`: opens a popup with quick gameplay instructions and power-up descriptions.
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
- Between rounds, show a compact popup with just next round number and score requirement.
- Game-over popup shows total score and replay action.

## Help Popup
- Help is shown as a modal popup opened from the in-game menu.
- Opening Help pauses gameplay/timer.
- Popup includes a brief "how to play" section.
- Popup includes scoring guidance for `DL`/`TL` and `DW`/`TW` behavior.
- Popup includes round progression and round-fail conditions.
- Popup lists all power-ups with icon/label and effect description.
- Help content is localized with the currently selected game language.

## Word Validation
- Submitted word must be at least `4` characters.
- Validation is performed against multiple dictionary APIs with fallback behavior.
- Provider stack currently uses:
- `dictionaryapi.dev` (language locale),
- Wiktionary API by selected language,
- Datamuse (English fallback).
- There is no local fallback dictionary; if API lookup fails, word validation fails.
- Wildcard (`*`) letter tiles spawn naturally with low Scrabble-like frequency.
- Wildcard words are evaluated by trying dictionary-valid substitutions.
- Invalid words do not score and tray remains unchanged.

## Scoring
- Each letter uses language-specific Scrabble-like point values.
- Word base score uses per-tile letter multipliers (`DL`/`TL`) before length bonus.
- Length bonus is added: `+0` for `4` letters; for `5+`, bonus doubles each extra letter (`+2`, `+4`, `+8`, `+16`, ...).
- Word multipliers (`DW`/`TW`) are applied after letter math: `(letter-score + length bonus) * (all word multipliers)`.
- Multiple word multipliers stack multiplicatively (for example `DW + DW = x4`, `DW + TW = x6`).
- Wildcard tile value is `0`.
- On valid submit, add points to total score, record accepted word, then clear tray.
- Score is cumulative across endless rounds until user starts a new game.

## UI Requirements
- Show round score progress and total score as separate counters in HUD.
- Show time remaining in seconds.
- Show active flying letter count.
- Show active effect states/timers.
- Effects panel is shown in the right-side control column and remains mounted to avoid board layout jumps.
- Active effect names are localized to the selected language.
- Show status messages for game events and validation.
- Status message is displayed directly below the game board.
- Show tray word and computed points.
- Show selected tray letters as individual tiles with per-letter values and tile bonus marker when present.
- Show accepted words list with points.
- Show current round number in HUD.
- Show score-goal progress in HUD as `current/target`.
- Show between-round overlay with round goal completion bonus summary.
- Successful submits show floating in-field score popups.
- Power-ups use a unified icon system (emoji glyph + optional mini badge like `x2`, `+10`, `+15`) in-field and in Help.
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
