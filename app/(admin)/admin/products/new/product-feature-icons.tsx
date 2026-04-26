"use client";

import { FeatureIcon } from "../../../../../components/feature-icon";
import type { ProductFeatureIcon } from "./product-form.types";

type Props = {
  featureIcons: ProductFeatureIcon[];
  onChange: (items: ProductFeatureIcon[]) => void;
};

export function ProductFeatureIcons({ featureIcons, onChange }: Props) {
  const toggleFeature = (id: string) => {
    onChange(
      featureIcons.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Feature Icons</h3>
        <p className="mt-1 text-sm text-slate-500">
          Select the predefined icons that should appear under the product image.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {featureIcons.map((item) => {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleFeature(item.id)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                item.selected
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <FeatureIcon name={item.iconName} className="h-5 w-5" />
                <div className="text-sm font-semibold">
                  {item.labelEn || item.key}
                </div>
              </div>

              <div className="mt-1 text-xs opacity-80">
                {item.labelAr || item.key}
              </div>

              <div className="mt-2 text-xs opacity-70">{item.iconName}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
