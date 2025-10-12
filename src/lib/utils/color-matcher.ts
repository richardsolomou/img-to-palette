import { differenceCiede2000, nearest } from "culori";
import { tailwindColors } from "../tailwind-colors";
import type { Color } from "../types";

export type TailwindColorMatch = {
  colorName: string;
  scale: number | null;
  hex: string;
  distance?: number;
};

// Build a flat map of all Tailwind colors with their names
const tailwindColorMap: Record<string, string> = {};

// Add black and white
tailwindColorMap.black = tailwindColors.black.hex;
tailwindColorMap.white = tailwindColors.white.hex;

// Add all color families
const colorFamilies = [
  "neutral",
  "stone",
  "zinc",
  "slate",
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

for (const family of colorFamilies) {
  const colorScale = tailwindColors[family];
  if (Array.isArray(colorScale)) {
    for (const shade of colorScale) {
      const colorName = `${family}-${shade.scale}`;
      tailwindColorMap[colorName] = shade.hex;
    }
  }
}

// Create the nearest color finder using CIEDE2000 for perceptually accurate color matching
const colorNames = Object.keys(tailwindColorMap);
const findNearest = nearest(
  colorNames,
  differenceCiede2000(),
  (name: string) => tailwindColorMap[name] || "#000000"
);

/**
 * Parse a Tailwind color name into its components
 */
function parseColorName(colorName: string): TailwindColorMatch {
  // Handle black and white
  if (colorName === "black" || colorName === "white") {
    return {
      colorName,
      scale: null,
      hex: tailwindColorMap[colorName] || tailwindColors.black.hex,
    };
  }

  // Parse "family-scale" format
  const parts = colorName.split("-");
  const lastPart = parts.at(-1);

  // Fallback if parsing fails
  if (!lastPart) {
    return {
      colorName: "black",
      scale: null,
      hex: tailwindColors.black.hex,
    };
  }

  const scale = Number.parseInt(lastPart, 10);
  const family = parts.slice(0, -1).join("-");

  return {
    colorName: family,
    scale,
    hex: tailwindColorMap[colorName] || tailwindColors.black.hex,
  };
}

/**
 * Find the closest Tailwind v4 color to a given color using CIEDE2000 color difference algorithm.
 * This provides more perceptually accurate matching compared to simple RGB Euclidean distance.
 */
export function findClosestTailwindColor(color: Color): TailwindColorMatch {
  const matches = findClosestTailwindColors(color, 1);
  return (
    matches[0] || {
      colorName: "black",
      scale: null,
      hex: tailwindColors.black.hex,
    }
  );
}

/**
 * Find multiple closest Tailwind v4 colors to a given color using CIEDE2000 color difference algorithm.
 * Returns up to `count` closest matches.
 */
export function findClosestTailwindColors(
  color: Color,
  count = 3
): TailwindColorMatch[] {
  const results = findNearest(color.hex, count);

  // Fallback to black if no match found (should never happen with our complete color map)
  if (!results || results.length === 0) {
    return [
      {
        colorName: "black",
        scale: null,
        hex: tailwindColors.black.hex,
      },
    ];
  }

  return results
    .filter((name): name is string => name !== undefined)
    .map((colorName) => parseColorName(colorName));
}
