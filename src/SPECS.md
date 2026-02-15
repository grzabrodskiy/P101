# Scrabble Bounce Game Spec

## Goal
Build words by tapping flying Scrabble-style letter tiles and submit valid words for points.

## Core Gameplay
- Game field is a square play area.
- Game runs in timed rounds selected before start: `60s`, `90s`, or `120s` (`90s` default).
- Base active letter count is `8`.
- Letter tiles move continuously with velocity vectors.
- Letter tiles enter by crossing the boundary from outside the square.
- On wall collision, a tile is reflected and wall-hit count increments.
- A tile reflects for the first `3` wall hits.
- On the next wall hit, it exits through the boundary and disappears.
- Letter spawn frequency is inversely correlated with Scrabble value.
- Common low-value letters (for example `E`, `T`, `O`) appear more often.
- High-value letters (for example `Q`, `Z`) appear less often.
- Active tile alphabet, frequencies, and letter scores depend on selected language.
- Example: Russian uses Cyrillic tiles and language-specific scoring/weights.
- When timer reaches `0`, round stops and interactions are disabled.
- User can restart a new round at any time.

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
- During active `x2`, target active letters is `16`.
- When `x2` ends, target returns to `8`.
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
- `Help`: opens a popup with quick gameplay instructions and power-up descriptions.
- `Restart Round`: resets round state and opens language selection before round start.
- `New Game`: starts a fresh game session from zero and opens language selection before round start.
- While paused, gameplay interactions are disabled until resume.

## Help Popup
- Help is shown as a modal popup opened from the in-game menu.
- Popup includes a brief "how to play" section.
- Popup lists all power-ups with icon/label and effect description.
- Help content is localized with the currently selected game language.

## Word Validation
- Submitted word must be at least `4` characters.
- Validation is performed against a dictionary API using the selected language locale.
- If API is unavailable, a small language-specific fallback dictionary is used.
- Wildcard words are evaluated by trying dictionary-valid substitutions.
- Invalid words do not score and tray remains unchanged.

## Scoring
- Each letter uses language-specific Scrabble-like point values.
- Word score is sum of tray letter values at submit time.
- Wildcard tile value is `0`.
- If `DW` is active, next valid word score is doubled.
- On valid submit, add points to total score, record accepted word, then clear tray.

## UI Requirements
- Show current total score.
- Show time remaining in seconds.
- Show active and target letter counts.
- Show active effect states/timers.
- Effects panel is shown in the right-side control column and remains mounted to avoid board layout jumps.
- Show status messages for game events and validation.
- Status message is displayed directly below the game board.
- Show tray word and computed points.
- Show accepted words list with points.
- On desktop, controls/tray are to the right of the square.
- On smaller screens, layout stacks vertically and remains touch-friendly.

## Technical Constraints
- Frontend stack: React + TypeScript + Vite.
- Application source code lives under `src/`.
- Run locally with `pnpm run dev` (`127.0.0.1:5173`, strict port).
- Production build output directory is `build/`.

## Localization
- UI supports 5 languages: English (default), German, French, Italian, Russian.
- Language is selectable only via startup modal before a round begins.
- Round duration is selectable in the same startup modal with exactly 3 options (`60s`, `90s`, `120s`).
- The language modal appears:
- on initial app load,
- after `Restart Round`,
- after `New Game`.
- Round starts only after user confirms selection in the modal.
- UI labels, controls, status messages, and power-up descriptions are localized.
- Dictionary validation requests use the currently selected language locale.
- Word generation and wildcard substitution also use the currently selected language alphabet.

## Current Non-Goals
- No multiplayer.
- No persistence/profile progression.
- No bundled large offline dictionary dataset.
