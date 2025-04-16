import type { Color } from "deck.gl";

export function hexToRgb(hex: string | undefined | null): Color {
  if (!hex) return [0, 0, 0];

  const cleanHex: string = hex.startsWith("#") ? hex.slice(1) : hex;

  const matches = cleanHex.match(/[0-9a-f]{2}/gi);

  if (!matches) return [0, 0, 0];

  return matches.map((x) => parseInt(x, 16)) as Color;
}
