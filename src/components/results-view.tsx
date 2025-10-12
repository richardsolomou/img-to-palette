import { Button } from "@ras-sh/ui";
import { Check, Copy, RotateCcw } from "lucide-react";
import posthog from "posthog-js";
import { useMemo, useState } from "react";
import { FormatSelector } from "~/components/format-selector";
import type { ProcessedPalette } from "~/lib/types";
import type { ColorFormat } from "~/lib/utils/color-formatter";
import { formatColor } from "~/lib/utils/color-formatter";
import { findClosestTailwindColors } from "~/lib/utils/color-matcher";

type ResultsViewProps = {
  processedPalette: ProcessedPalette;
  onProcessMore: () => void;
};

export function ResultsView({
  processedPalette,
  onProcessMore,
}: ResultsViewProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ColorFormat>("oklch");

  async function copyColorToClipboard(
    value: string,
    colorName: string,
    format: ColorFormat
  ) {
    await navigator.clipboard.writeText(value);
    setCopiedColor(value);
    setTimeout(() => setCopiedColor(null), 2000);

    posthog.capture("color_copied", {
      project: "img-to-palette",
      color_name: colorName,
      color_value: value,
      format,
    });
  }

  const tailwindMatches = useMemo(
    () =>
      processedPalette.palette.allColors.map((color) =>
        findClosestTailwindColors(color, 3)
      ),
    [processedPalette.palette.allColors]
  );

  return (
    <div className="space-y-6">
      {/* Original image preview with extracted colors overlay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-100">Original Image</h3>
          <Button
            onClick={() => {
              posthog.capture("process_new_image_clicked", {
                project: "img-to-palette",
              });
              onProcessMore();
            }}
            size="sm"
          >
            <RotateCcw className="size-4" />
            Process New Image
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-[conic-gradient(#e5e5e5_90deg,#ffffff_90deg_180deg,#e5e5e5_180deg_270deg,#ffffff_270deg)] bg-[length:20px_20px] p-8">
          <img
            alt="Original"
            className="mx-auto max-h-64 object-contain"
            height="256"
            src={processedPalette.original}
            width="auto"
          />

          {/* Extracted colors - absolutely positioned at bottom right */}
          <div className="absolute right-1 bottom-1 rounded-lg border border-zinc-800 bg-zinc-950/90 p-2 backdrop-blur-sm">
            <div className="flex flex-wrap gap-1.5">
              {processedPalette.palette.allColors.map((color, i) => (
                <div
                  className="size-6 rounded border border-zinc-700 transition-transform hover:scale-110"
                  key={`${color.hex}-${i}`}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.hex} - ${color.percentage.toFixed(1)}%`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind color suggestions */}
      <div className="space-y-3">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-zinc-100">Color Palette</h3>
          <FormatSelector
            onFormatChange={setSelectedFormat}
            selectedFormat={selectedFormat}
          />
        </div>

        <div className="space-y-8 sm:space-y-4">
          {processedPalette.palette.allColors.map((color, i) => {
            const matches = tailwindMatches[i];

            if (!matches || matches.length === 0) {
              return null;
            }

            const extractedFormattedValue = formatColor(color, selectedFormat);
            const extractedIsCopied = copiedColor === extractedFormattedValue;

            return (
              <div
                className="grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-[2fr_3fr]"
                key={`tailwind-group-${color.hex}-${i}`}
              >
                {/* Extracted color - larger on left */}
                <div className="space-y-1.5">
                  <button
                    className="group relative h-20 w-full overflow-hidden rounded-lg border border-zinc-800 transition-all hover:scale-105 hover:border-zinc-600 sm:h-26.5"
                    onClick={() =>
                      copyColorToClipboard(
                        extractedFormattedValue,
                        `Color ${i + 1}`,
                        selectedFormat
                      )
                    }
                    style={{ backgroundColor: color.hex }}
                    title={`Original: ${color.hex}`}
                    type="button"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {extractedIsCopied ? (
                        <Check className="size-5 text-green-400" />
                      ) : (
                        <Copy className="size-5 text-white" />
                      )}
                      <span className="mt-1 break-all text-center font-mono text-white text-xs">
                        {extractedFormattedValue}
                      </span>
                    </div>
                  </button>
                  <div className="text-center">
                    <p className="font-mono text-xs text-zinc-500">
                      Original ({color.hex})
                    </p>
                  </div>
                </div>

                {/* Three Tailwind matches - grid on right */}
                <div className="space-y-2">
                  <p className="font-medium text-xs text-zinc-400">
                    Closest Tailwind Matches:
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:gap-2">
                    {matches.map((match, matchIndex) => {
                      const tailwindColorName =
                        match.scale !== null
                          ? `${match.colorName}-${match.scale}`
                          : match.colorName;

                      const formattedValue = formatColor(
                        {
                          hex: match.hex,
                          rgb: { r: 0, g: 0, b: 0 },
                          hsl: { h: 0, s: 0, l: 0 },
                          percentage: 0,
                        },
                        selectedFormat,
                        tailwindColorName
                      );

                      const isCopied = copiedColor === formattedValue;

                      return (
                        <div
                          className="space-y-1"
                          key={`match-${color.hex}-${i}-${matchIndex}`}
                        >
                          <button
                            className="group relative h-14 w-full overflow-hidden rounded-lg border border-zinc-800 transition-all hover:scale-105 hover:border-zinc-600 sm:h-20"
                            onClick={() =>
                              copyColorToClipboard(
                                formattedValue,
                                tailwindColorName,
                                selectedFormat
                              )
                            }
                            style={{ backgroundColor: match.hex }}
                            title={`${match.hex} - ${tailwindColorName}`}
                            type="button"
                          >
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                              {isCopied ? (
                                <Check className="size-4 text-green-400" />
                              ) : (
                                <Copy className="size-4 text-white" />
                              )}
                              <span className="mt-1 break-all text-center font-mono text-white text-xs">
                                {formattedValue}
                              </span>
                            </div>
                          </button>
                          <div className="text-center">
                            <p className="truncate font-mono text-xs text-zinc-400">
                              {tailwindColorName}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
