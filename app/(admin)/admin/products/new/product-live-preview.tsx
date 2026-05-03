"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FeatureIcon } from "../../../../../components/feature-icon";
import type { ProductColorOption, ProductFormValues } from "./product-form.types";

type Props = {
  form: ProductFormValues;
  selectedColor: ProductColorOption | null;
};

export function ProductLivePreview({ form, selectedColor }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptionValues, setSelectedOptionValues] = useState<
    Record<string, string | null>
  >({});

  const activeHighlights = form.highlights.filter(
    (item) => item.textEn.trim() !== "" || item.textAr.trim() !== ""
  );
  const activeFeatures = form.featureIcons.filter((item) => item.selected);
  const activeOptionGroups = form.optionGroups.filter(
    (group) =>
      (group.nameEn.trim() !== "" || group.nameAr.trim() !== "") &&
      group.options.some(
        (option) => option.valueEn.trim() !== "" || option.valueAr.trim() !== ""
      )
  );

  useEffect(() => {
    setSelectedOptionValues((currentValues) => {
      const nextValues = Object.fromEntries(
        activeOptionGroups.map((group) => {
          const currentValueId = currentValues[group.id] ?? null;
          const hasCurrentValue = group.options.some(
            (option) => option.id === currentValueId
          );
          const defaultValueId =
            group.selectedValueId ??
            group.options.find((option) => option.isDefault)?.id ??
            group.options[0]?.id ??
            null;

          return [group.id, hasCurrentValue ? currentValueId : defaultValueId];
        })
      );

      return nextValues;
    });
  }, [activeOptionGroups]);

  const selectedVariantImage = useMemo(() => {
    for (const group of activeOptionGroups) {
      const selectedValueId =
        selectedOptionValues[group.id] ?? group.selectedValueId ?? group.options[0]?.id ?? null;
      const selectedOption =
        group.options.find((option) => option.id === selectedValueId) ?? null;

      if (selectedOption?.mainImageUrl) {
        return {
          id: `option-${group.id}-${selectedOption.id}`,
          name:
            selectedOption.valueEn ||
            selectedOption.valueAr ||
            group.nameEn ||
            group.nameAr ||
            "Selected option",
          url: selectedOption.mainImageUrl,
        };
      }
    }

    return null;
  }, [activeOptionGroups, selectedOptionValues]);

  const galleryPreviewItems = useMemo(() => {
    const leadingImage = selectedVariantImage
      ? [selectedVariantImage]
      : selectedColor?.mainImageUrl
        ? [
            {
              id: `selected-color-${selectedColor.id}`,
              name: selectedColor.nameEn || selectedColor.nameAr || "Selected color",
              url: selectedColor.mainImageUrl,
            },
          ]
        : [];

    return [
      ...leadingImage,
      ...form.galleryImages.map((item) => ({
        id: item.id,
        name: item.name,
        url: item.url,
      })),
    ];
  }, [form.galleryImages, selectedColor, selectedVariantImage]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedColor?.id, selectedVariantImage?.id]);

  const selectedGalleryImage = galleryPreviewItems[activeImageIndex] ?? null;
  const mainPreviewUrl = selectedGalleryImage?.url || "";

  const cycleImage = (direction: "prev" | "next") => {
    if (galleryPreviewItems.length <= 1) {
      return;
    }

    setActiveImageIndex((currentIndex) => {
      if (direction === "next") {
        return (currentIndex + 1) % galleryPreviewItems.length;
      }

      return (currentIndex - 1 + galleryPreviewItems.length) % galleryPreviewItems.length;
    });
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <p className="text-sm font-semibold text-slate-900">Live Preview</p>
        <p className="mt-1 text-xs text-slate-500">
          Review the product gallery, default colour, highlights, and custom selectors before saving.
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[20px] bg-white text-center">
            {mainPreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainPreviewUrl}
                alt={selectedColor?.nameEn || form.productNameEn || "Product preview"}
                className="h-full w-full bg-white object-contain p-3"
              />
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  {selectedColor?.nameEn || form.productNameEn || form.productNameAr || "Product Image"}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Main image switches by selected color or custom option
                </p>
              </div>
            )}

            {galleryPreviewItems.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => cycleImage("prev")}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => cycleImage("next")}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-sm"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {galleryPreviewItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className={`overflow-hidden rounded-2xl border bg-white ${
                  activeImageIndex === index
                    ? "border-slate-900"
                    : "border-slate-200"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-16 w-16 bg-white object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-slate-200 p-5">
            <div className="border-b border-slate-100 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                English Preview
              </p>
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
              {form.productNameEn || "Product name will appear here"}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Product code: {selectedColor?.productCode || form.productCode || "—"}
            </p>
            <p className="text-sm text-slate-500">
              Stock: {form.stockStatus === "in_stock" ? "In Stock" : "Out of Stock"}
            </p>
            <p className="text-sm leading-7 text-slate-600">
              {form.shortDescriptionEn || "Short product description"}
            </p>

            <div className="flex flex-wrap gap-3">
              {form.colors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => form.selectedColorId !== color.id && color.id}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  {color.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={color.thumbnailUrl}
                      alt={color.nameEn || color.nameAr || "Colour"}
                      className={`h-12 w-12 rounded-xl border bg-white object-contain p-1 ${
                        color.isDefault ? "border-slate-900" : "border-slate-200"
                      }`}
                    />
                  ) : (
                    <div
                      className={`h-12 w-12 rounded-full border-2 shadow ring-1 ring-slate-300 ${
                        color.isDefault ? "border-slate-900" : "border-white"
                      }`}
                      style={{ backgroundColor: color.hex || "#ddd" }}
                    />
                  )}
                  <span className="text-xs text-slate-500">{color.nameEn || "Colour"}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {activeHighlights.length > 0 ? (
                activeHighlights.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <p className="text-sm leading-6 text-slate-700">
                      {item.textEn || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No highlights yet.</p>
              )}
            </div>

            {activeOptionGroups.length > 0 && (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                {activeOptionGroups.map((group) => {
                  const selectedValueId =
                    selectedOptionValues[group.id] ??
                    group.selectedValueId ??
                    group.options[0]?.id ??
                    null;

                  return (
                    <div key={group.id}>
                      <p className="text-sm font-semibold text-slate-700">
                        {group.nameEn || "Option group"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {group.options.map((option) => {
                          const isActive = option.id === selectedValueId;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                setSelectedOptionValues((currentValues) => ({
                                  ...currentValues,
                                  [group.id]: option.id,
                                }))
                              }
                              className={`flex min-w-[120px] items-center gap-3 rounded-2xl border px-3 py-2 text-left ${
                                isActive
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              {option.thumbnailUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={option.thumbnailUrl}
                                  alt={option.valueEn || option.valueAr || "Option"}
                                  className="h-10 w-10 rounded-xl border border-slate-200 bg-white object-contain p-1"
                                />
                              ) : null}
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold">
                                  {option.valueEn || "Option"}
                                </p>
                                {option.optionCode ? (
                                  <p
                                    className={`mt-1 text-[11px] ${
                                      isActive ? "text-white/75" : "text-slate-500"
                                    }`}
                                  >
                                    {option.optionCode}
                                  </p>
                                ) : null}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div dir="rtl" className="space-y-4 rounded-3xl border border-slate-200 p-5 text-right">
            <div className="border-b border-slate-100 pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Arabic Preview
              </p>
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight text-slate-900">
              {form.productNameAr || "اسم المنتج سيظهر هنا"}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              كود المنتج: {selectedColor?.productCode || form.productCode || "—"}
            </p>
            <p className="text-sm text-slate-500">
              الحالة: {form.stockStatus === "in_stock" ? "متوفر" : "غير متوفر"}
            </p>
            <p className="text-sm leading-7 text-slate-600">
              {form.shortDescriptionAr || "الوصف المختصر سيظهر هنا"}
            </p>

            <div className="flex flex-wrap justify-end gap-3">
              {form.colors.map((color) => (
                <div key={color.id} className="flex flex-col items-center gap-2 text-center">
                  {color.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={color.thumbnailUrl}
                      alt={color.nameAr || color.nameEn || "لون"}
                      className={`h-12 w-12 rounded-xl border bg-white object-contain p-1 ${
                        color.isDefault ? "border-slate-900" : "border-slate-200"
                      }`}
                    />
                  ) : (
                    <div
                      className={`h-12 w-12 rounded-full border-2 shadow ring-1 ring-slate-300 ${
                        color.isDefault ? "border-slate-900" : "border-white"
                      }`}
                      style={{ backgroundColor: color.hex || "#ddd" }}
                    />
                  )}
                  <span className="text-xs text-slate-500">{color.nameAr || "لون"}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {activeHighlights.length > 0 ? (
                activeHighlights.map((item) => (
                  <div key={item.id} className="flex flex-row-reverse gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <p className="text-sm leading-6 text-slate-700">
                      {item.textAr || "—"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">لا توجد ميزات بعد.</p>
              )}
            </div>

            {activeOptionGroups.length > 0 && (
              <div className="space-y-4 border-t border-slate-100 pt-4">
                {activeOptionGroups.map((group) => {
                  const selectedValueId =
                    selectedOptionValues[group.id] ??
                    group.selectedValueId ??
                    group.options[0]?.id ??
                    null;

                  return (
                    <div key={group.id}>
                      <p className="text-sm font-semibold text-slate-700">
                        {group.nameAr || "خيار"}
                      </p>
                      <div className="mt-2 flex flex-wrap justify-end gap-2">
                        {group.options.map((option) => {
                          const isActive = option.id === selectedValueId;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() =>
                                setSelectedOptionValues((currentValues) => ({
                                  ...currentValues,
                                  [group.id]: option.id,
                                }))
                              }
                              className={`flex min-w-[120px] items-center gap-3 rounded-2xl border px-3 py-2 text-right ${
                                isActive
                                  ? "border-slate-900 bg-slate-900 text-white"
                                  : "border-slate-200 bg-white text-slate-700"
                              }`}
                            >
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold">
                                  {option.valueAr || "خيار"}
                                </p>
                                {option.optionCode ? (
                                  <p
                                    className={`mt-1 text-[11px] ${
                                      isActive ? "text-white/75" : "text-slate-500"
                                    }`}
                                  >
                                    {option.optionCode}
                                  </p>
                                ) : null}
                              </div>
                              {option.thumbnailUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={option.thumbnailUrl}
                                  alt={option.valueAr || option.valueEn || "Option"}
                                  className="h-10 w-10 rounded-xl border border-slate-200 bg-white object-contain p-1"
                                />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeFeatures.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-[#f8f6f0] px-4 py-4 text-center"
            >
              <FeatureIcon name={item.iconName} className="mx-auto h-5 w-5 text-slate-700" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {item.labelEn || item.key}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {item.labelAr || item.key}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
