import nearestColor from "nearest-color";
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

// Create the nearest color finder
const findNearest = nearestColor.from(tailwindColorMap);

/**
 * Find the closest Tailwind v4 color to a given color using nearest-color
 */
export function findClosestTailwindColor(color: Color): TailwindColorMatch {
  const result = findNearest(color.hex);

  // Fallback to black if no match found (should never happen with our complete color map)
  if (!result) {
    return {
      colorName: "black",
      scale: null,
      hex: tailwindColors.black.hex,
    };
  }

  // Parse the color name to extract family and scale
  if (result.name === "black" || result.name === "white") {
    return {
      colorName: result.name,
      scale: null,
      hex: result.value,
    };
  }

  // Parse "family-scale" format
  const parts = result.name.split("-");
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
    hex: result.value,
  };
}
