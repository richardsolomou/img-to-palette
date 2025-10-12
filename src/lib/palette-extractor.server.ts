import { createServerFn } from "@tanstack/react-start";
import { Vibrant } from "node-vibrant/node";
import { z } from "zod";
import { CONTRAST_RATIOS } from "./constants";
import type { Color, ColorPalette, ColorRole, ContrastCheck } from "./types";

const ExtractPaletteInputSchema = z.object({
  imageBuffer: z.string(),
});

type ExtractPaletteResult = {
  palette: ColorPalette;
  originalFilename: string;
};

/**
 * Converts RGB to HSL
 */
function rgbToHsl(
  rInput: number,
  gInput: number,
  bInput: number
): { h: number; s: number; l: number } {
  const r = rInput / 255;
  const g = gInput / 255;
  const b = bInput / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
      default:
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Calculates relative luminance for contrast ratio
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const normalized = c / 255;
    return normalized <= 0.039_28
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (rs ?? 0) + 0.7152 * (gs ?? 0) + 0.0722 * (bs ?? 0);
}

/**
 * Calculates WCAG contrast ratio between two colors
 */
function getContrastRatio(
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if contrast meets WCAG standards
 */
function checkContrast(ratio: number): ContrastCheck {
  return {
    normalText: ratio >= CONTRAST_RATIOS.AA_NORMAL,
    largeText: ratio >= CONTRAST_RATIOS.AA_LARGE,
    ratio: Math.round(ratio * 100) / 100,
  };
}

/**
 * Determines if a color is light or dark based on its luminance
 */
function isLightColor(r: number, g: number, b: number): boolean {
  return getLuminance(r, g, b) > 0.5;
}

/**
 * Calculates color saturation
 */
function getColorSaturation(hsl: { h: number; s: number; l: number }): number {
  return hsl.s;
}

/**
 * Assigns roles to extracted colors based on their properties
 */
function assignColorRoles(colors: Color[]): {
  primary: ColorRole;
  secondary: ColorRole;
  accent: ColorRole;
  background: ColorRole;
  text: ColorRole;
} {
  // Sort colors by percentage (most dominant first)
  const sortedByDominance = [...colors].sort(
    (a, b) => b.percentage - a.percentage
  );

  // Separate light and dark colors
  const lightColors = colors.filter((c) =>
    isLightColor(c.rgb.r, c.rgb.g, c.rgb.b)
  );
  const darkColors = colors.filter(
    (c) => !isLightColor(c.rgb.r, c.rgb.g, c.rgb.b)
  );

  // Sort by saturation for accent color
  const sortedBySaturation = [...colors].sort(
    (a, b) => getColorSaturation(b.hsl) - getColorSaturation(a.hsl)
  );

  // Assign roles
  // Primary: Most dominant color
  const primary = sortedByDominance[0] ?? colors[0];
  if (!primary) {
    throw new Error("No colors found in image");
  }

  // Secondary: Second most dominant, but different from primary
  const secondary =
    sortedByDominance.find(
      (c) => c.hex !== primary.hex && Math.abs(c.hsl.h - primary.hsl.h) > 30
    ) ??
    sortedByDominance[1] ??
    primary;

  // Accent: Most saturated color (good for CTAs)
  const accent =
    sortedBySaturation.find(
      (c) => c.hex !== primary.hex && c.hex !== secondary.hex && c.hsl.s > 40
    ) ??
    sortedBySaturation[0] ??
    primary;

  // Background: Lightest color if available, otherwise use a light neutral
  const background =
    lightColors.length > 0
      ? lightColors.reduce((lightest, c) =>
          c.hsl.l > lightest.hsl.l ? c : lightest
        )
      : {
          hex: "#ffffff",
          rgb: { r: 255, g: 255, b: 255 },
          hsl: { h: 0, s: 0, l: 100 },
          percentage: 0,
        };

  // Text: Darkest color if available, otherwise use dark neutral
  const text =
    darkColors.length > 0
      ? darkColors.reduce((darkest, c) =>
          c.hsl.l < darkest.hsl.l ? c : darkest
        )
      : {
          hex: "#000000",
          rgb: { r: 0, g: 0, b: 0 },
          hsl: { h: 0, s: 0, l: 0 },
          percentage: 0,
        };

  return {
    primary: {
      name: "Primary",
      description: "Main brand color, most dominant in the image",
      color: primary,
      usage: "Headers, primary buttons, links",
    },
    secondary: {
      name: "Secondary",
      description: "Supporting color for variety and depth",
      color: secondary,
      usage: "Secondary buttons, accents, borders",
    },
    accent: {
      name: "Accent",
      description: "High-impact color for calls-to-action",
      color: accent,
      usage: "CTAs, highlights, important UI elements",
    },
    background: {
      name: "Background",
      description: "Light base color for content areas",
      color: background,
      usage: "Page background, cards, containers",
    },
    text: {
      name: "Text",
      description: "Dark color optimized for readability",
      color: text,
      usage: "Body text, headings, descriptions",
    },
  };
}

/**
 * Extracts dominant colors from an image buffer using node-vibrant
 */
async function extractColors(buffer: Buffer): Promise<Color[]> {
  // Use node-vibrant to extract colors
  const palette = await Vibrant.from(buffer).getPalette();

  const colors: Color[] = [];

  // Extract all available swatches
  const swatches = [
    { name: "Vibrant", swatch: palette.Vibrant },
    { name: "DarkVibrant", swatch: palette.DarkVibrant },
    { name: "LightVibrant", swatch: palette.LightVibrant },
    { name: "Muted", swatch: palette.Muted },
    { name: "DarkMuted", swatch: palette.DarkMuted },
    { name: "LightMuted", swatch: palette.LightMuted },
  ];

  for (const { swatch } of swatches) {
    if (swatch) {
      const rgb = swatch.rgb;
      colors.push({
        hex: swatch.hex,
        rgb: {
          r: Math.round(rgb[0]),
          g: Math.round(rgb[1]),
          b: Math.round(rgb[2]),
        },
        hsl: rgbToHsl(
          Math.round(rgb[0]),
          Math.round(rgb[1]),
          Math.round(rgb[2])
        ),
        percentage: swatch.population,
      });
    }
  }

  // Sort by population (most dominant first)
  colors.sort((a, b) => b.percentage - a.percentage);

  // Normalize percentages to sum to 100
  const totalPopulation = colors.reduce((sum, c) => sum + c.percentage, 0);
  if (totalPopulation > 0) {
    for (const color of colors) {
      color.percentage =
        Math.round((color.percentage / totalPopulation) * 10_000) / 100;
    }
  }

  return colors;
}

/**
 * Server function to extract color palette from an uploaded image
 */
export const extractPalette = createServerFn({ method: "POST" })
  .inputValidator(ExtractPaletteInputSchema)
  .handler(async ({ data }): Promise<ExtractPaletteResult> => {
    const { imageBuffer } = data;
    const buffer = Buffer.from(imageBuffer, "base64");

    // Extract dominant colors
    const allColors = await extractColors(buffer);

    // Assign roles to colors
    const roles = assignColorRoles(allColors);

    // Calculate contrast ratios
    const primaryOnBackground = getContrastRatio(
      roles.primary.color.rgb,
      roles.background.color.rgb
    );
    const textOnBackground = getContrastRatio(
      roles.text.color.rgb,
      roles.background.color.rgb
    );
    const primaryOnText = getContrastRatio(
      roles.primary.color.rgb,
      roles.text.color.rgb
    );

    const palette: ColorPalette = {
      ...roles,
      allColors,
      contrast: {
        primaryOnBackground: checkContrast(primaryOnBackground),
        textOnBackground: checkContrast(textOnBackground),
        primaryOnText: checkContrast(primaryOnText),
      },
    };

    return {
      palette,
      originalFilename: "palette",
    };
  });
