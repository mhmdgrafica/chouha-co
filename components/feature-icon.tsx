"use client";

import {
  BadgeCheck,
  Droplets,
  Eraser,
  Highlighter,
  Leaf,
  PenTool,
  PencilLine,
  Recycle,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Leaf,
  Droplets,
  Eraser,
  Recycle,
  Sparkles,
  PenTool,
  PencilLine,
  Highlighter,
  BadgeCheck,
};

type FeatureIconProps = {
  name: string;
  className?: string;
};

export function FeatureIcon({ name, className }: FeatureIconProps) {
  const Icon = iconMap[name] ?? BadgeCheck;

  return <Icon className={className} strokeWidth={1.8} />;
}
