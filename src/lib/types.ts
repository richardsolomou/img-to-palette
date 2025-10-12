export type Color = {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  percentage: number;
};

export type ColorRole = {
  name: string;
  description: string;
  color: Color;
  usage: string;
};

export type ContrastCheck = {
  normalText: boolean;
  largeText: boolean;
  ratio: number;
};

export type ColorPalette = {
  primary: ColorRole;
  secondary: ColorRole;
  accent: ColorRole;
  background: ColorRole;
  text: ColorRole;
  allColors: Color[];
  contrast: {
    primaryOnBackground: ContrastCheck;
    textOnBackground: ContrastCheck;
    primaryOnText: ContrastCheck;
  };
};

export type ProcessedPalette = {
  original: string;
  palette: ColorPalette;
  filename: string;
  processingTime: number;
};
