import { useCallback, useState } from "react";
import type { ColorFormat } from "~/lib/utils/color-formatter";

export function useColorCopy() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ColorFormat>("oklch");

  // Memoize the callback to prevent re-creating on every render
  const copyColorToClipboard = useCallback(
    async (
      value: string,
      colorName: string,
      format: ColorFormat,
      isExtracted = false
    ) => {
      try {
        // Use the Clipboard API if available
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = value;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }

        setCopiedColor(value);
        setTimeout(() => setCopiedColor(null), 2000);

        window.umami?.track("color_copied", {
          color_name: colorName,
          color_value: value,
          format,
          color_type: isExtracted ? "extracted" : "tailwind_match",
        });
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        // Still show the check mark as feedback
        setCopiedColor(value);
        setTimeout(() => setCopiedColor(null), 2000);
      }
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
