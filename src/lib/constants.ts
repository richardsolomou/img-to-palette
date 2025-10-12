// WCAG contrast ratio thresholds
export const CONTRAST_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const;

// Color role assignments based on image analysis
export const COLOR_ROLES = {
  PRIMARY: "Primary",
  SECONDARY: "Secondary",
  ACCENT: "Accent",
  BACKGROUND: "Background",
  TEXT: "Text",
} as const;

// Export format options
export const EXPORT_FORMATS = {
  CSS_VARIABLES: "css",
  TAILWIND_CONFIG: "tailwind",
  SASS_VARIABLES: "sass",
  JSON: "json",
} as const;
