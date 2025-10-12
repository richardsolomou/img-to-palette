import { differenceCiede2000, nearest } from "culori";
import { tailwindColors } from "../tailwind-colors";
import type { Color } from "../types";

export type TailwindColorMatch = {
  colorName: string;
  scale: number | null;
  hex: string;
  rgb: string;
  hsl: string;
  oklch: string;
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
 * Default fallback color match (black)
 */
const DEFAULT_COLOR_MATCH: TailwindColorMatch = {
  colorName: "black",
  scale: null,
  hex: tailwindColors.black.hex,
  rgb: tailwindColors.black.rgb,
  hsl: tailwindColors.black.hsl,
  oklch: tailwindColors.black.oklch,
};

/**
 * Parse a Tailwind color name and return its complete color data including pre-formatted values
 */
function parseColorName(colorName: string): TailwindColorMatch {
  // Handle black and white
  if (colorName === "black") {
    return {
      colorName: "black",
      scale: null,
      hex: tailwindColors.black.hex,
      rgb: tailwindColors.black.rgb,
      hsl: tailwindColors.black.hsl,
      oklch: tailwindColors.black.oklch,
    };
  }

  if (colorName === "white") {
    return {
      colorName: "white",
      scale: null,
      hex: tailwindColors.white.hex,
      rgb: tailwindColors.white.rgb,
      hsl: tailwindColors.white.hsl,
      oklch: tailwindColors.white.oklch,
    };
  }

  // Parse "family-scale" format
  const parts = colorName.split("-");
  const lastPart = parts.at(-1);

  // Fallback if parsing fails
  if (!lastPart) {
    return DEFAULT_COLOR_MATCH;
  }

  const scale = Number.parseInt(lastPart, 10);
  const family = parts.slice(0, -1).join("-");

  // Find the color in the tailwind colors object
  const colorFamily = tailwindColors[family as keyof typeof tailwindColors];
  if (Array.isArray(colorFamily)) {
    const shade = colorFamily.find((s) => s.scale === scale);
    if (shade) {
      return {
        colorName: family,
        scale,
        hex: shade.hex,
        rgb: shade.rgb,
        hsl: shade.hsl,
        oklch: shade.oklch,
      };
    }
  }

  // Fallback to black if color not found
  return DEFAULT_COLOR_MATCH;
}

/**
 * Find the closest Tailwind color match using CIEDE2000 algorithm
 * @param color - The color to match
 * @returns The closest Tailwind color with pre-formatted color values
 */
export function findClosestTailwindColor(color: Color): TailwindColorMatch {
  const matches = findClosestTailwindColors(color, 1);
  return matches[0] || DEFAULT_COLOR_MATCH;
}

/**
 * Find multiple closest Tailwind color matches using CIEDE2000 algorithm
 * @param color - The color to match
 * @param count - Number of matches to return (default: 3)
 * @returns Array of closest Tailwind colors with pre-formatted color values
 */
export function findClosestTailwindColors(
  color: Color,
  count = 3
): TailwindColorMatch[] {
  const results = findNearest(color.hex, count);

  // Fallback to black if no match found (should never happen with complete color map)
  if (!results || results.length === 0) {
    return [DEFAULT_COLOR_MATCH];
  }

  return results
    .filter((name): name is string => name !== undefined)
    .map((colorName) => parseColorName(colorName));
}
