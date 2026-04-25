"use client";

import { useMemo, useState } from "react";
import { defaultProductFormValues } from "./product-form.constants";
import type {
  ProductColorOption,
  ProductFeatureIcon,
  ProductFormValues,
  ProductHighlight,
} from "./product-form.types";
import { ProductBasicInfo } from "./product-basic-info";
import { ProductHighlights } from "./product-highlights";
import { ProductFeatureIcons } from "./product-feature-icons";
import { ProductMediaUpload } from "./product-media-upload";
import { ProductColors } from "./product-colors";
import { ProductLivePreview } from "./product-live-preview";

export function ProductFormShell() {
  const [form, setForm] = useState<ProductFormValues>(defaultProductFormValues);

  const selectedColor = useMemo(() => {
    return form.colors.find((color) => color.id === form.selectedColorId) ?? null;
  }, [form.colors, form.selectedColorId]);

  const updateField = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateHighlights = (highlights: ProductHighlight[]) => {
    setForm((prev) => ({
      ...prev,
      highlights,
    }));
  };

  const updateFeatureIcons = (featureIcons: ProductFeatureIcon[]) => {
    setForm((prev) => ({
      ...prev,
      featureIcons,
    }));
  };

  const updateColors = (colors: ProductColorOption[]) => {
    setForm((prev) => ({
      ...prev,
      colors,
      selectedColorId:
        prev.selectedColorId && colors.some((item) => item.id === prev.selectedColorId)
          ? prev.selectedColorId
          : colors[0]?.id ?? null,
    }));
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[480px_minmax(0,1.05fr)]">
      <div className="xl:sticky xl:top-24 xl:self-start">
        <ProductLivePreview form={form} selectedColor={selectedColor} />
      </div>

      <div className="space-y-6">
        <ProductBasicInfo form={form} updateField={updateField} />

        <ProductHighlights
          highlights={form.highlights}
          onChange={updateHighlights}
        />

        <ProductFeatureIcons
          featureIcons={form.featureIcons}
          onChange={updateFeatureIcons}
        />

        <ProductMediaUpload form={form} updateField={updateField} />

        <ProductColors
          colors={form.colors}
          selectedColorId={form.selectedColorId}
          onChange={updateColors}
          onSelectColor={(colorId: string) =>
            updateField("selectedColorId", colorId)
          }
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Publish Product
          </button>
        </div>
      </div>
    </div>
  );
}