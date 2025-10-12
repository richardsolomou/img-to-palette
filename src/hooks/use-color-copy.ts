import posthog from "posthog-js";
import { useCallback, useState } from "react";
import type { ColorFormat } from "~/lib/utils/color-formatter";

export function useColorCopy() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ColorFormat>("oklch");

  // Memoize the callback to prevent re-creating on every render
  const copyColorToClipboard = useCallback(
    async (value: string, colorName: string, format: ColorFormat) => {
      await navigator.clipboard.writeText(value);
      setCopiedColor(value);
      setTimeout(() => setCopiedColor(null), 2000);

      posthog.capture("color_copied", {
        project: "img-to-palette",
        color_name: colorName,
        color_value: value,
        format,
      });
    },
    []
  );

  return {
    copiedColor,
    selectedFormat,
    setSelectedFormat,
    copyColorToClipboard,
  };
}
