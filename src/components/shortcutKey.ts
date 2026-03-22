const LETTER_PATTERN = /\p{L}/u;

export function getShortcutKey(label: string) {
  return Array.from(label).find((char) => LETTER_PATTERN.test(char))?.toLocaleLowerCase() ?? null;
}

export function getShortcutLabelParts(label: string) {
  const characters = Array.from(label);
  const shortcutIndex = characters.findIndex((character) => LETTER_PATTERN.test(character));

  if (shortcutIndex === -1) {
    return null;
  }

  return {
    before: characters.slice(0, shortcutIndex).join(""),
    shortcut: characters[shortcutIndex] ?? "",
    after: characters.slice(shortcutIndex + 1).join("")
  };
}

export function joinShortcutKeys(...keys: Array<string | null>) {
  const uniqueKeys = keys.filter(
    (key, index): key is string => key !== null && keys.indexOf(key) === index
  );

  return uniqueKeys.length > 0 ? uniqueKeys.join(" ") : undefined;
}

export function matchesShortcutKey(shortcutKeys: string | undefined, pressedKey: string) {
  return shortcutKeys?.split(/\s+/).includes(pressedKey) ?? false;
}
