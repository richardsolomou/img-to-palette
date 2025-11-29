import { usePostHog } from "@posthog/react";
import { useCallback, useState } from "react";
import { extractPalette } from "~/lib/palette-extractor";
import type { ProcessedPalette } from "~/lib/types";
import { getFileSizeBucket } from "~/lib/utils/analytics";
import { readFileAsDataURL } from "~/lib/utils/file-reader";

/**
 * Hook for processing uploaded images and extracting color palettes
 */
export function usePaletteGenerator() {
  const posthog = usePostHog();
  const [processing, setProcessing] = useState(false);
  const [processedPalettes, setProcessedPalettes] = useState<
    ProcessedPalette[]
  >([]);

  const processImage = useCallback(
    async (file: File): Promise<ProcessedPalette> => {
      const startTime = Date.now();

      // Read file for preview
      const originalDataUrl = await readFileAsDataURL(file);

      // Extract palette in the browser
      const result = await extractPalette(originalDataUrl);

      return {
        original: originalDataUrl,
        palette: result.palette,
        filename: file.name,
        processingTime: Date.now() - startTime,
      };
    },
    []
  );

  const processFiles = useCallback(
    async (files: File[]) => {
      setProcessing(true);

      const imageFile = files.find((f) => f.type.startsWith("image/"));

      if (!imageFile) {
        setProcessing(false);
        return;
      }

      try {
        const processed = await processImage(imageFile);
        setProcessedPalettes([processed]);

        posthog?.capture("palette_extracted", {
          color_count: processed.palette.length,
          processing_time_ms: processed.processingTime,
          file_type: imageFile.type,
          file_size_bytes: imageFile.size,
          file_size_bucket: getFileSizeBucket(imageFile.size),
        });
      } catch (error) {
        console.error(`Error processing ${imageFile.name}:`, error);

        posthog?.capture("palette_extraction_failed", {
          error_message:
            error instanceof Error ? error.message : "Unknown error",
          file_type: imageFile.type,
          file_size_bytes: imageFile.size,
          file_size_bucket: getFileSizeBucket(imageFile.size),
        });
      } finally {
        setProcessing(false);
      }
    },
    [processImage, posthog]
  );

  const clearAll = useCallback(() => {
    setProcessedPalettes([]);
  }, []);

  return {
    processing,
    processedPalettes,
    processFiles,
    clearAll,
  };
}
