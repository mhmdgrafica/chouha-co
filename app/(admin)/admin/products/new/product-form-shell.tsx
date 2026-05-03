"use client";

import { useMemo, useState } from "react";
import type { CatalogItem } from "../../../../../lib/catalog/catalog.types";
import { defaultProductFormValues } from "./product-form.constants";
import type {
  ProductColorOption,
  ProductFeatureIcon,
  ProductFormValues,
  ProductPublishStatus,
  ProductHighlight,
  ProductOptionGroup,
} from "./product-form.types";
import { ProductBasicInfo } from "./product-basic-info";
import { ProductHighlights } from "./product-highlights";
import { ProductFeatureIcons } from "./product-feature-icons";
import { ProductMediaUpload } from "./product-media-upload";
import { ProductColors } from "./product-colors";
import { ProductOptionGroups } from "./product-option-groups";
import { ProductLivePreview } from "./product-live-preview";

type ProductFormShellProps = {
  initialForm?: ProductFormValues;
  initialProductId?: string | null;
  brandOptions?: CatalogItem[];
  categoryOptions?: CatalogItem[];
  featureOptions?: ProductFeatureIcon[];
};

export function ProductFormShell({
  initialForm = defaultProductFormValues,
  initialProductId = null,
  brandOptions = [],
  categoryOptions = [],
  featureOptions = [],
}: ProductFormShellProps) {
  const [form, setForm] = useState<ProductFormValues>({
    ...initialForm,
    featureIcons:
      initialForm.featureIcons.length > 0
        ? initialForm.featureIcons
        : featureOptions,
  });
  const [savedProductId, setSavedProductId] = useState<string | null>(
    initialProductId
  );
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
    const defaultColor = colors.find((item) => item.isDefault) ?? colors[0] ?? null;

    setForm((prev) => ({
      ...prev,
      colors,
      selectedColorId:
        prev.selectedColorId && colors.some((item) => item.id === prev.selectedColorId)
          ? prev.selectedColorId
          : defaultColor?.id ?? null,
    }));
  };

  const updateOptionGroups = (optionGroups: ProductOptionGroup[]) => {
    setForm((prev) => ({
      ...prev,
      optionGroups,
    }));
  };

  const submitProduct = async (status: ProductPublishStatus) => {
    if (status === "draft") {
      setIsSavingDraft(true);
    } else {
      setIsPublishing(true);
    }

    setSaveMessage(null);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: savedProductId,
          form,
          status,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        productId?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save draft.");
      }

      setSavedProductId(payload.productId ?? null);
      setSaveMessage({
        type: "success",
        text:
          status === "published"
            ? "Product published successfully."
            : "Draft saved successfully.",
      });
    } catch (error) {
      setSaveMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : status === "published"
              ? "Failed to publish product."
              : "Failed to save draft.",
      });
    } finally {
      if (status === "draft") {
        setIsSavingDraft(false);
      } else {
        setIsPublishing(false);
      }
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[480px_minmax(0,1.05fr)]">
      <div className="xl:sticky xl:top-24 xl:self-start">
        <ProductLivePreview form={form} selectedColor={selectedColor} />
      </div>

      <div className="space-y-6">
        <ProductBasicInfo
          form={form}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
          updateField={updateField}
        />

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

        <ProductOptionGroups
          optionGroups={form.optionGroups}
          onChange={updateOptionGroups}
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => submitProduct("draft")}
            disabled={isSavingDraft || isPublishing}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {isSavingDraft ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={() => submitProduct("published")}
            disabled={isSavingDraft || isPublishing}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {isPublishing ? "Publishing..." : "Publish Product"}
          </button>

          {saveMessage && (
            <p
              className={`text-sm ${
                saveMessage.type === "success"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {saveMessage.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}