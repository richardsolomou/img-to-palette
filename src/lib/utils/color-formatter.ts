import { formatHsl, formatRgb, oklch } from "culori";
import type { Color } from "../types";

export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch" | "var" | "className";

export type FormatOption = {
  value: ColorFormat;
  label: string;
};

export const formatOptions: FormatOption[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hsl", label: "HSL" },
  { value: "oklch", label: "OKLCH" },
  { value: "var", label: "CSS Variable" },
  { value: "className", label: "Tailwind Class" },
];

/**
 * Format an extracted color from an image
 * Converts the color to the requested format using culori library
 */
export function formatColor(color: Color, format: ColorFormat): string {
  switch (format) {
    case "hex":
      return color.hex;

    case "rgb":
      return formatRgb(color.hex) ?? color.hex;

    case "hsl":
      return formatHsl(color.hex) ?? color.hex;

    case "oklch": {
      const oklchColor = oklch(color.hex);
      if (!oklchColor) {
        return color.hex;
      }
      const l = oklchColor.l?.toFixed(2) ?? "0.00";
      const c = oklchColor.c?.toFixed(2) ?? "0.00";
      const h = oklchColor.h?.toFixed(0) ?? "0";
      return `oklch(${l} ${c} ${h})`;
    }

    case "var":
      return "--color-custom";

    case "className":
      return color.hex;

    default:
      return color.hex;
  }
}

/**
 * Format a Tailwind color match using pre-formatted color values
 * No conversion needed - uses the pre-formatted strings from tailwind-colors.ts
 */
export function formatTailwindColor(
  colorFormats: {
    hex: string;
    rgb: string;
    hsl: string;
    oklch: string;
  },
  format: ColorFormat,
  tailwindName: string
): string {
  switch (format) {
    case "hex":
      return colorFormats.hex;
    case "rgb":
      return colorFormats.rgb;
    case "hsl":
      return colorFormats.hsl;
    case "oklch":
      return colorFormats.oklch;
    case "var":
      return `--color-${tailwindName}`;
    case "className":
      return `bg-${tailwindName}`;
    default:
      return colorFormats.hex;
  }
}
