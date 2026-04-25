"use client";

import type { ProductFeatureIcon } from "./product-form.types";
import { featureIconLabels } from "./product-form.constants";

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
          const label = featureIconLabels[item.key];

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
              <div className="text-sm font-semibold">
                {label?.en || item.key}
              </div>

              <div className="mt-1 text-xs opacity-80">
                {label?.ar || item.key}
              </div>

              <div className="mt-2 text-xs opacity-70">{item.icon}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}