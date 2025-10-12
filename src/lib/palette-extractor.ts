import { Vibrant, WorkerPipeline } from "node-vibrant/worker";
import PipelineWorker from "node-vibrant/worker.worker?worker";
import type { Color } from "./types";

// Configure Vibrant to use Web Workers for better performance
Vibrant.use(new WorkerPipeline(PipelineWorker as never));

/**
 * Converts RGB to HSL
 */
function rgbToHsl(
  rInput: number,
  gInput: number,
  bInput: number
): { h: number; s: number; l: number } {
  const r = rInput / 255;
  const g = gInput / 255;
  const b = bInput / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
      default:
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Extracts dominant colors from an image using node-vibrant in the browser
 */
async function extractColors(imageSource: string): Promise<Color[]> {
  // Use node-vibrant to extract colors
  const palette = await Vibrant.from(imageSource).getPalette();

  const colors: Color[] = [];

  // Extract all available swatches
  const swatches = [
    { name: "Vibrant", swatch: palette.Vibrant },
    { name: "DarkVibrant", swatch: palette.DarkVibrant },
    { name: "LightVibrant", swatch: palette.LightVibrant },
    { name: "Muted", swatch: palette.Muted },
    { name: "DarkMuted", swatch: palette.DarkMuted },
    { name: "LightMuted", swatch: palette.LightMuted },
  ];

  for (const { swatch } of swatches) {
    if (swatch) {
      const rgb = swatch.rgb;
      colors.push({
        hex: swatch.hex,
        rgb: {
          r: Math.round(rgb[0]),
          g: Math.round(rgb[1]),
          b: Math.round(rgb[2]),
        },
        hsl: rgbToHsl(
          Math.round(rgb[0]),
          Math.round(rgb[1]),
          Math.round(rgb[2])
        ),
        percentage: swatch.population,
      });
    }
  }

  // Sort by population (most dominant first)
  colors.sort((a, b) => b.percentage - a.percentage);

  // Normalize percentages to sum to 100
  const totalPopulation = colors.reduce((sum, c) => sum + c.percentage, 0);
  if (totalPopulation > 0) {
    for (const color of colors) {
      color.percentage =
        Math.round((color.percentage / totalPopulation) * 10_000) / 100;
    }
  }

  return colors;
}

/**
 * Client-side function to extract color palette from an uploaded image
 */
export async function extractPalette(
  imageDataUrl: string
): Promise<{ palette: Color[] }> {
  // Extract dominant colors from the image data URL
  const palette = await extractColors(imageDataUrl);

  return {
    palette,
  };
}
