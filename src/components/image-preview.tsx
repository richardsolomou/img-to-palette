import { memo } from "react";
import type { Color } from "~/lib/types";

type ImagePreviewProps = {
  imageSrc: string;
  extractedColors: Color[];
};

function ImagePreviewComponent({ imageSrc, extractedColors }: ImagePreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-[conic-gradient(#e5e5e5_90deg,#ffffff_90deg_180deg,#e5e5e5_180deg_270deg,#ffffff_270deg)] bg-[length:20px_20px] p-8">
      <img
        alt="Original"
        className="mx-auto max-h-64 object-contain"
        height="256"
        src={imageSrc}
        width="auto"
      />

      {/* Extracted colors - absolutely positioned at bottom right */}
      <div className="absolute right-1 bottom-1 rounded-lg border border-zinc-800 bg-zinc-950/90 p-2 backdrop-blur-sm">
        <div className="flex flex-wrap gap-1.5">
          {extractedColors.map((color, i) => (
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
  );
}

// Memoize to prevent re-renders when parent updates
export const ImagePreview = memo(ImagePreviewComponent);
