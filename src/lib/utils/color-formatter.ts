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
 * Format a color in different formats for copying
 */
export function formatColor(
  color: Color,
  format: ColorFormat,
  tailwindName?: string
): string {
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

    case "var": {
      if (tailwindName) {
        return `--color-${tailwindName}`;
      }
      return "--color-custom";
    }

    case "className": {
      if (tailwindName) {
        return `bg-${tailwindName}`;
      }
      return color.hex;
    }

    default:
      return color.hex;
  }
}

/**
 * Get a display-friendly version of the formatted color
 */
export function getDisplayValue(
  color: Color,
  format: ColorFormat,
  tailwindName?: string
): string {
  const formatted = formatColor(color, format, tailwindName);

  // For var and className, show a more complete example
  if (format === "var") {
    return formatted;
  }

  if (format === "className" && tailwindName) {
    return `bg-${tailwindName}`;
  }

  return formatted;
}
