import {
  differenceCiede2000,
  formatHex,
  formatHsl,
  formatRgb,
  nearest,
  oklch,
  parse,
} from "culori";
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

/**
 * Convert an OKLCH string to hex, rgb, hsl formats
 */
function convertOklchToFormats(oklchString: string) {
  const color = parse(oklchString);
  if (!color) {
    return {
      hex: "#000000",
      rgb: "rgb(0, 0, 0)",
      hsl: "hsl(0, 0%, 0%)",
      oklch: oklchString,
    };
  }

  const hex = formatHex(color) || "#000000";
  const rgb = formatRgb(color) || "rgb(0, 0, 0)";
  const hsl = formatHsl(color) || "hsl(0, 0%, 0%)";

  return {
    hex,
    rgb,
    hsl,
    oklch: oklchString,
  };
}

/**
 * Convert a hex string to all color formats
 */
function convertHexToFormats(hexString: string) {
  const color = parse(hexString);
  if (!color) {
    return {
      hex: hexString,
      rgb: "rgb(0, 0, 0)",
      hsl: "hsl(0, 0%, 0%)",
      oklch: "oklch(0 0 0)",
    };
  }

  const rgb = formatRgb(color) || "rgb(0, 0, 0)";
  const hsl = formatHsl(color) || "hsl(0, 0%, 0%)";

  const oklchColor = oklch(color);
  const l = oklchColor?.l?.toFixed(2) ?? "0.00";
  const c = oklchColor?.c?.toFixed(2) ?? "0.00";
  const h = oklchColor?.h?.toFixed(0) ?? "0";
  const oklchString = `oklch(${l} ${c} ${h})`;

  return {
    hex: hexString,
    rgb,
    hsl,
    oklch: oklchString,
  };
}

// Build a flat map of all Tailwind colors with their names
const tailwindColorMap: Record<string, string> = {};

// Add black and white
tailwindColorMap.black = tailwindColors.black;
tailwindColorMap.white = tailwindColors.white;

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
  if (typeof colorScale === "object" && !Array.isArray(colorScale)) {
    for (const [scale, oklchValue] of Object.entries(colorScale)) {
      const colorName = `${family}-${scale}`;
      // Convert OKLCH to hex for color matching
      const color = parse(oklchValue);
      const hex = color ? formatHex(color) : "#000000";
      tailwindColorMap[colorName] = hex;
    }
  }
}

// Create the nearest color finder using CIEDE2000 for perceptually accurate color matching
const colorNames = Object.keys(tailwindColorMap);
const findNearest = nearest(
  colorNames,
  differenceCiede2000(),
  (name: string) => tailwindColorMap[name] || "#000000",
);

/**
 * Default fallback color match (black)
 */
const DEFAULT_COLOR_MATCH: TailwindColorMatch = {
  colorName: "black",
  scale: null,
  ...convertHexToFormats(tailwindColors.black),
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
      ...convertHexToFormats(tailwindColors.black),
    };
  }

  if (colorName === "white") {
    return {
      colorName: "white",
      scale: null,
      ...convertHexToFormats(tailwindColors.white),
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
  if (typeof colorFamily === "object" && !Array.isArray(colorFamily)) {
    const oklchValue = colorFamily[lastPart as keyof typeof colorFamily];
    if (oklchValue && typeof oklchValue === "string") {
      return {
        colorName: family,
        scale,
        ...convertOklchToFormats(oklchValue),
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
export function findClosestTailwindColors(color: Color, count = 3): TailwindColorMatch[] {
  const results = findNearest(color.hex, count);

  // Fallback to black if no match found (should never happen with complete color map)
  if (!results || results.length === 0) {
    return [DEFAULT_COLOR_MATCH];
  }

  return results
    .filter((name): name is string => name !== undefined)
    .map((colorName) => parseColorName(colorName));
}
