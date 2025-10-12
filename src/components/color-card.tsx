import { Check, Copy } from "lucide-react";
import { memo, useMemo } from "react";
import type { Color } from "~/lib/types";
import type { ColorFormat } from "~/lib/utils/color-formatter";
import { formatColor, formatTailwindColor } from "~/lib/utils/color-formatter";
import type { TailwindColorMatch } from "~/lib/utils/color-matcher";

type ColorCardProps = {
  color: Color;
  colorIndex: number;
  matches: TailwindColorMatch[];
  selectedFormat: ColorFormat;
  copiedColor: string | null;
  onCopyColor: (
    value: string,
    colorName: string,
    format: ColorFormat,
    isExtracted?: boolean
  ) => void;
};

function ColorCardComponent({
  color,
  colorIndex,
  matches,
  selectedFormat,
  copiedColor,
  onCopyColor,
}: ColorCardProps) {
  // Format extracted color from image (requires conversion via culori)
  const extractedFormattedValue = useMemo(
    () => formatColor(color, selectedFormat),
    [color, selectedFormat]
  );

  const extractedIsCopied = copiedColor === extractedFormattedValue;

  // Format Tailwind matches using pre-formatted values (no conversion needed)
  const formattedMatches = useMemo(
    () =>
      matches.map((match) => {
        const tailwindColorName =
          match.scale !== null
            ? `${match.colorName}-${match.scale}`
            : match.colorName;

        return {
          match,
          tailwindColorName,
          formattedValue: formatTailwindColor(
            {
              hex: match.hex,
              rgb: match.rgb,
              hsl: match.hsl,
              oklch: match.oklch,
            },
            selectedFormat,
            tailwindColorName
          ),
        };
      }),
    [matches, selectedFormat]
  );

  return (
    <div className="grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-[2fr_3fr]">
      {/* Extracted color - larger on left */}
      <div className="space-y-1.5">
        <button
          className="group relative h-20 w-full overflow-hidden rounded-lg border border-zinc-800 transition-all hover:scale-105 hover:border-zinc-600 active:scale-95 sm:h-26.5"
          onClick={() =>
            onCopyColor(
              extractedFormattedValue,
              `Color ${colorIndex + 1}`,
              selectedFormat,
              true
            )
          }
          style={{ backgroundColor: color.hex }}
          title={`Original: ${color.hex}`}
          type="button"
        >
          {/* Desktop hover overlay with full info */}
          <div className="absolute inset-0 hidden flex-col items-center justify-center bg-black/70 p-2 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
            {extractedIsCopied ? (
              <Check className="size-5 text-green-400" />
            ) : (
              <Copy className="size-5 text-white" />
            )}
            <span className="mt-1 break-all text-center font-mono text-white text-xs">
              {extractedFormattedValue}
            </span>
          </div>
          {/* Mobile copy button - just icon in center */}
          <div className="absolute inset-0 flex items-center justify-center sm:hidden">
            {extractedIsCopied ? (
              <div className="rounded-full bg-black/70 p-2">
                <Check className="size-5 text-green-400" />
              </div>
            ) : (
              <div className="rounded-full bg-black/70 p-2">
                <Copy className="size-5 text-white" />
              </div>
            )}
          </div>
        </button>
        <div className="text-center">
          <p className="font-mono text-xs text-zinc-500">
            Original ({color.hex})
          </p>
          {/* Show formatted value on mobile */}
          <p className="mt-0.5 font-mono text-xs text-zinc-400 sm:hidden">
            {extractedFormattedValue}
          </p>
        </div>
      </div>

      {/* Three Tailwind matches - grid on right */}
      <div className="space-y-2">
        <p className="font-medium text-xs text-zinc-400">
          Closest Tailwind Matches:
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-2">
          {formattedMatches.map(
            ({ match, tailwindColorName, formattedValue }, matchIndex) => {
              const isCopied = copiedColor === formattedValue;

              return (
                <div
                  className="space-y-1"
                  key={`match-${match.hex}-${matchIndex}`}
                >
                  <button
                    className="group relative h-14 w-full overflow-hidden rounded-lg border border-zinc-800 transition-all hover:scale-105 hover:border-zinc-600 active:scale-95 sm:h-20"
                    onClick={() =>
                      onCopyColor(
                        formattedValue,
                        tailwindColorName,
                        selectedFormat,
                        false
                      )
                    }
                    style={{ backgroundColor: match.hex }}
                    title={`${match.hex} - ${tailwindColorName}`}
                    type="button"
                  >
                    {/* Desktop hover overlay with full info */}
                    <div className="absolute inset-0 hidden flex-col items-center justify-center bg-black/70 p-2 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
                      {isCopied ? (
                        <Check className="size-4 text-green-400" />
                      ) : (
                        <Copy className="size-4 text-white" />
                      )}
                      <span className="mt-1 break-all text-center font-mono text-white text-xs">
                        {formattedValue}
                      </span>
                    </div>
                    {/* Mobile copy button - just icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center sm:hidden">
                      {isCopied ? (
                        <div className="rounded-full bg-black/70 p-1.5">
                          <Check className="size-4 text-green-400" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-black/70 p-1.5">
                          <Copy className="size-4 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                  <div className="text-center">
                    <p className="truncate font-mono text-xs text-zinc-400">
                      {tailwindColorName}
                    </p>
                    {/* Show formatted value on mobile */}
                    <p className="mt-0.5 truncate font-mono text-xs text-zinc-500 sm:hidden">
                      {formattedValue}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const ColorCard = memo(ColorCardComponent);
