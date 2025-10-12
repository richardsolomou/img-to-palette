import { differenceCiede2000, nearest } from "culori";
import { tailwindColors } from "../tailwind-colors";
import type { Color } from "../types";

export type TailwindColorMatch = {
  colorName: string;
  scale: number | null;
  hex: string;
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
 * Find the closest Tailwind v4 color to a given color using CIEDE2000 color difference algorithm.
 * This provides more perceptually accurate matching compared to simple RGB Euclidean distance.
 */
export function findClosestTailwindColor(color: Color): TailwindColorMatch {
  const result = findNearest(color.hex, 1);

  // Fallback to black if no match found (should never happen with our complete color map)
  if (!result || result.length === 0) {
    return {
      colorName: "black",
      scale: null,
      hex: tailwindColors.black.hex,
    };
  }

  const closestColorName = result[0];

  // Should never happen, but handle undefined case
  if (!closestColorName) {
    return {
      colorName: "black",
      scale: null,
      hex: tailwindColors.black.hex,
    };
  }

  // Parse the color name to extract family and scale
  if (closestColorName === "black" || closestColorName === "white") {
    return {
      colorName: closestColorName,
      scale: null,
      hex: tailwindColorMap[closestColorName] || tailwindColors.black.hex,
    };
  }

  // Parse "family-scale" format
  const parts = closestColorName.split("-");
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
  const colorName = parts.slice(0, -1).join("-");

  return {
    colorName,
    scale,
    hex: tailwindColorMap[closestColorName] || tailwindColors.black.hex,
  };
}
