export const featureIconOptions = [
  "ShieldCheck",
  "Leaf",
  "Droplets",
  "Eraser",
  "Recycle",
  "Sparkles",
  "PenTool",
  "PencilLine",
  "Highlighter",
  "BadgeCheck",
] as const;

export type FeatureIconName = (typeof featureIconOptions)[number];
