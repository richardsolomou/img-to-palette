export type Color = {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  percentage: number;
};

export type ProcessedPalette = {
  original: string;
  palette: Color[];
  filename: string;
  processingTime: number;
};
