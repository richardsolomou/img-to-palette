import { Button } from "@ras-sh/ui";
import { Copy, Download, RotateCcw } from "lucide-react";
import posthog from "posthog-js";
import { useMemo, useState } from "react";
import type { ProcessedPalette } from "~/lib/types";
import { findClosestTailwindColor } from "~/lib/utils/color-matcher";

type ResultsViewProps = {
  processedPalette: ProcessedPalette;
  onProcessMore: () => void;
};

export function ResultsView({
  processedPalette,
  onProcessMore,
}: ResultsViewProps) {
  const [_copiedColor, setCopiedColor] = useState<string | null>(null);

  async function copyColorToClipboard(hex: string, colorName: string) {
    await navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);

    posthog.capture("color_copied", {
      project: "img-to-palette",
      color_name: colorName,
      color_value: hex,
    });
  }

  function downloadPaletteAsJSON() {
    posthog.capture("palette_downloaded", {
      project: "img-to-palette",
      format: "json",
    });

    const paletteData = {
      colors: processedPalette.palette.allColors,
    };

    const blob = new Blob([JSON.stringify(paletteData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "palette.json";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  const tailwindMatches = useMemo(
    () =>
      processedPalette.palette.allColors.map((color) =>
        findClosestTailwindColor(color)
      ),
    [processedPalette.palette.allColors]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-between">
        <Button
          onClick={() => {
            posthog.capture("process_new_image_clicked", {
              project: "img-to-palette",
            });
            onProcessMore();
          }}
          variant="default"
        >
          <RotateCcw className="size-4" />
          Process New Image
        </Button>

        <Button onClick={downloadPaletteAsJSON} variant="outline">
          <Download className="size-4" />
          Download Palette JSON
        </Button>
      </div>

      <div className="space-y-6">
        {/* Original image preview */}
        <div className="space-y-2">
          <h3 className="font-semibold text-zinc-100">Original Image</h3>
          <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-[conic-gradient(#e5e5e5_90deg,#ffffff_90deg_180deg,#e5e5e5_180deg_270deg,#ffffff_270deg)] bg-[length:20px_20px] p-8">
            <img
              alt="Original"
              className="mx-auto max-h-64 object-contain"
              height="256"
              src={processedPalette.original}
              width="auto"
            />
          </div>
        </div>

        {/* All extracted colors */}
        <div className="space-y-3">
          <h3 className="font-semibold text-zinc-100">
            Extracted Colors ({processedPalette.palette.allColors.length})
          </h3>
          <div className="grid grid-cols-6 gap-3">
            {processedPalette.palette.allColors.map((color, i) => (
              <button
                className="group relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-800 transition-all hover:scale-105 hover:border-zinc-600"
                key={`${color.hex}-${i}`}
                onClick={() =>
                  copyColorToClipboard(color.hex, `Color ${i + 1}`)
                }
                style={{ backgroundColor: color.hex }}
                title={`${color.hex} - ${color.percentage.toFixed(1)}%`}
                type="button"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <Copy className="mb-1 size-5 text-white" />
                  <span className="break-all text-center font-mono text-white text-xs">
                    {color.hex}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tailwind color suggestions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-zinc-100">
            Tailwind v4 Color Suggestions
          </h3>
          <div className="grid grid-cols-6 gap-3">
            {processedPalette.palette.allColors.map((color, i) => {
              const match = tailwindMatches[i];

              if (!match) {
                return null;
              }

              const tailwindColorName =
                match.scale !== null
                  ? `${match.colorName}-${match.scale}`
                  : match.colorName;

              return (
                <div className="space-y-2" key={`tailwind-${color.hex}-${i}`}>
                  <button
                    className="group relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-800 transition-all hover:scale-105 hover:border-zinc-600"
                    onClick={() =>
                      copyColorToClipboard(match.hex, tailwindColorName)
                    }
                    style={{ backgroundColor: match.hex }}
                    title={`${match.hex} - ${tailwindColorName}`}
                    type="button"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Copy className="mb-1 size-5 text-white" />
                      <span className="break-all text-center font-mono text-white text-xs">
                        {match.hex}
                      </span>
                    </div>
                  </button>
                  <div className="text-center">
                    <p className="font-mono text-xs text-zinc-400">
                      {tailwindColorName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
