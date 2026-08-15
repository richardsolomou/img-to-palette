import { usePostHog } from "@posthog/react";
import { Button } from "@ras-sh/ui";
import { RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { ColorCard } from "~/components/color-card";
import { FormatSelector } from "~/components/format-selector";
import { ImagePreview } from "~/components/image-preview";
import { useColorCopy } from "~/hooks/use-color-copy";
import type { ProcessedPalette } from "~/lib/types";
import { findClosestTailwindColors } from "~/lib/utils/color-matcher";

type ResultsViewProps = {
  processedPalette: ProcessedPalette;
  onProcessMore: () => void;
};

export function ResultsView({ processedPalette, onProcessMore }: ResultsViewProps) {
  const posthog = usePostHog();
  const { copiedColor, selectedFormat, setSelectedFormat, copyColorToClipboard } = useColorCopy();

  const tailwindMatches = useMemo(
    () => processedPalette.palette.map((color) => findClosestTailwindColors(color, 3)),
    [processedPalette.palette],
  );

  return (
    <div className="space-y-6">
      {/* Original image preview with extracted colors overlay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-zinc-100">Original Image</h3>
          <Button
            onClick={() => {
              posthog?.capture("process_new_image_clicked", {
                palette_color_count: processedPalette.palette.length,
              });
              onProcessMore();
            }}
            size="sm"
          >
            <RotateCcw className="size-4" />
            Process New Image
          </Button>
        </div>
        <ImagePreview
          extractedColors={processedPalette.palette}
          imageSrc={processedPalette.original}
        />
      </div>

      {/* Tailwind color suggestions */}
      <div className="space-y-3">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-zinc-100">Color Palette</h3>
          <FormatSelector onFormatChange={setSelectedFormat} selectedFormat={selectedFormat} />
        </div>

        <div className="space-y-8 sm:space-y-4">
          {processedPalette.palette.map((color, i) => {
            const matches = tailwindMatches[i];

            if (!matches || matches.length === 0) {
              return null;
            }

            return (
              <ColorCard
                color={color}
                colorIndex={i}
                copiedColor={copiedColor}
                key={`color-${color.hex}-${i}`}
                matches={matches}
                onCopyColor={copyColorToClipboard}
                selectedFormat={selectedFormat}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
