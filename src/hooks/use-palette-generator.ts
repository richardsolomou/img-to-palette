import { useCallback, useState } from "react";
import { extractPalette } from "~/lib/palette-extractor.server";
import type { ProcessedPalette } from "~/lib/types";
import { fileToBase64, readFileAsDataURL } from "~/lib/utils/file-reader";

/**
 * Hook for processing uploaded images and extracting color palettes
 */
export function usePaletteGenerator() {
  const [processing, setProcessing] = useState(false);
  const [processedPalettes, setProcessedPalettes] = useState<
    ProcessedPalette[]
  >([]);

  const processImage = useCallback(
    async (file: File): Promise<ProcessedPalette> => {
      const startTime = Date.now();

      // Read file for preview and server processing
      const [originalDataUrl, base64] = await Promise.all([
        readFileAsDataURL(file),
        fileToBase64(file),
      ]);

      // Extract palette on server
      const result = await extractPalette({
        data: { imageBuffer: base64 },
      });

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
      } catch (error) {
        console.error(`Error processing ${imageFile.name}:`, error);
      } finally {
        setProcessing(false);
      }
    },
    [processImage]
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
