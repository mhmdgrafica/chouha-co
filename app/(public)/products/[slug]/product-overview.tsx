"use client";

import { useMemo, useState } from "react";
import type {
  ProductColorOption,
  ProductFeatureIcon,
  ProductHighlight,
  ProductMediaItem,
  ProductOptionGroup,
  ProductStockStatus,
} from "../../../../lib/products/product.types";
import { ProductColorGallery } from "./product-color-gallery";

type OverviewCopy = {
  availableColors: string;
  noColors: string;
  colorFallback: string;
  mainImagePlaceholder: string;
  highlights: string;
  inquiry: string;
  back: string;
  inStock: string;
  outOfStock: string;
  productCode: string;
  descriptionTitle: string;
};

type ProductOverviewProps = {
  colors: ProductColorOption[];
  galleryItems: ProductMediaItem[];
  features: ProductFeatureIcon[];
  highlights: ProductHighlight[];
  optionGroups: ProductOptionGroup[];
  productName: string;
  brandName: string;
  brandLogoUrl: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  stockStatus: ProductStockStatus;
  fallbackProductCode: string;
  isArabic: boolean;
  lang: "en" | "ar";
  copy: OverviewCopy;
};

export function ProductOverview({
  colors,
  galleryItems,
  features,
  highlights,
  optionGroups,
  productName,
  brandName,
  brandLogoUrl,
  categoryName,
  shortDescription,
  fullDescription,
  stockStatus,
  fallbackProductCode,
  isArabic,
  lang,
  copy,
}: ProductOverviewProps) {
  const defaultColor = colors.find((item) => item.isDefault) ?? colors[0] ?? null;
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    defaultColor?.id ?? null
  );
  const [selectedOptionValues, setSelectedOptionValues] = useState<Record<string, string | null>>(
    () =>
      Object.fromEntries(
        optionGroups.map((group) => [group.id, group.selectedValueId ?? group.options[0]?.id ?? null])
      )
  );

  const selectedColor = useMemo(
    () => colors.find((item) => item.id === selectedColorId) ?? defaultColor,
    [colors, defaultColor, selectedColorId]
  );

  const selectedVariantImage = useMemo(() => {
    for (const group of optionGroups) {
      const selectedValueId = selectedOptionValues[group.id] ?? group.options[0]?.id ?? null;
      const selectedOption = group.options.find((option) => option.id === selectedValueId) ?? null;

      if (selectedOption?.mainImageUrl) {
        const optionLabel = isArabic
          ? selectedOption.valueAr || selectedOption.valueEn
          : selectedOption.valueEn || selectedOption.valueAr;

        return {
          id: `option-${group.id}-${selectedOption.id}`,
          name: optionLabel || productName,
          url: selectedOption.mainImageUrl,
        };
      }
    }

    return null;
  }, [isArabic, optionGroups, productName, selectedOptionValues]);

  const descriptionParagraphs = fullDescription
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
      <ProductColorGallery
        colors={colors}
        selectedColorId={selectedColor?.id ?? null}
        selectedVariantImage={selectedVariantImage}
        galleryItems={galleryItems}
        features={features}
        productName={productName}
        isArabic={isArabic}
        colorFallback={copy.colorFallback}
        mainImagePlaceholder={copy.mainImagePlaceholder}
      />

      <div className="rounded-[30px] border border-[#e6dfd3] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          {brandLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brandLogoUrl}
              alt={brandName || "Brand logo"}
              className="h-10 max-w-[120px] object-contain"
            />
          ) : null}

          <span className="rounded-full bg-[#f4f0e7] px-3 py-1 text-xs font-medium text-[#6a7483]">
            {categoryName}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              stockStatus === "in_stock"
                ? "bg-[#eaf4f3] text-[#003b51]"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {stockStatus === "in_stock" ? copy.inStock : copy.outOfStock}
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#003b51] md:text-[2.65rem]">
          {productName}
        </h1>

        <p className="mt-3 text-sm font-medium tracking-[0.08em] text-[#7b8796]">
          {copy.productCode}: {selectedColor?.productCode || fallbackProductCode || "—"}
        </p>

        {shortDescription && (
          <p
            className={`mt-5 text-base leading-8 text-[#4f5a69] ${
              isArabic ? "font-arabic-medium" : "font-medium"
            }`}
          >
            {shortDescription}
          </p>
        )}

        {highlights.length > 0 && (
          <div className="mt-8">
            <p className="mb-4 text-sm font-semibold text-[#003b51]">
              {copy.highlights}
            </p>

            <div className="space-y-3">
              {highlights.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#003b51]" />
                  <p className="text-sm leading-7 text-[#4f5a69]">
                    {isArabic ? item.textAr || item.textEn : item.textEn || item.textAr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-7">
          <div>
            <p className="mb-4 text-sm font-semibold text-[#003b51]">
              {copy.availableColors}
            </p>

            <div className="flex flex-wrap gap-4">
              {colors.length > 0 ? (
                colors.map((color) => {
                  const isActive = color.id === selectedColor?.id;
                  const colorName = isArabic
                    ? color.nameAr || color.nameEn || copy.colorFallback
                    : color.nameEn || color.nameAr || copy.colorFallback;

                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColorId(color.id)}
                      className="group flex w-20 flex-col items-center gap-2 text-center"
                    >
                      <span
                        className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-white transition ${
                          isActive
                            ? "border-[#003b51] shadow-[0_0_0_3px_rgba(0,59,81,0.14)]"
                            : "border-[#d8d1c4] group-hover:border-[#003b51]/50"
                        }`}
                        style={!color.thumbnailUrl ? { backgroundColor: color.hex || "#ddd" } : undefined}
                      >
                        {color.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={color.thumbnailUrl}
                            alt={colorName}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </span>

                      <span className="line-clamp-2 text-xs font-semibold leading-5 text-[#1f2f4d]">
                        {colorName}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[18px] border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-4 text-sm text-[#6a7483]">
                  {copy.noColors}
                </div>
              )}
            </div>
          </div>

          {optionGroups.map((group) => {
            const selectedValueId = selectedOptionValues[group.id] ?? group.options[0]?.id ?? null;

            return (
              <div key={group.id}>
                <p className="mb-4 text-sm font-semibold text-[#003b51]">
                  {isArabic ? group.nameAr || group.nameEn : group.nameEn || group.nameAr}
                </p>

                <div className="flex flex-wrap gap-4">
                  {group.options.map((option) => {
                    const isActive = option.id === selectedValueId;
                    const optionLabel = isArabic
                      ? option.valueAr || option.valueEn
                      : option.valueEn || option.valueAr;

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
                        className="group flex w-20 flex-col items-center gap-2 text-center"
                      >
                        <span
                          className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border bg-white transition ${
                            isActive
                              ? "border-[#003b51] shadow-[0_0_0_3px_rgba(0,59,81,0.14)]"
                              : "border-[#d8d1c4] group-hover:border-[#003b51]/50"
                          }`}
                        >
                          {option.thumbnailUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={option.thumbnailUrl}
                              alt={optionLabel || "Option"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-[#003b51]">
                              {optionLabel?.slice(0, 2)}
                            </span>
                          )}
                        </span>

                        <span className="line-clamp-2 text-xs font-semibold leading-5 text-[#1f2f4d]">
                          {optionLabel}
                        </span>

                        {option.optionCode ? (
                          <span className="text-[11px] leading-none text-[#7b8796]">
                            {option.optionCode}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 border-t border-[#efe8db] pt-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#7b8796]">
            {copy.descriptionTitle}
          </p>

          <div
            className={`space-y-4 text-[15px] leading-8 text-[#4f5a69] ${
              isArabic ? "font-arabic-medium" : "font-medium"
            }`}
          >
            {descriptionParagraphs.length > 0 ? (
              descriptionParagraphs.map((paragraph, index) => (
                <p key={`${paragraph}-${index}`}>{paragraph}</p>
              ))
            ) : (
              <p>{shortDescription}</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`/contact?lang=${lang}`}
            className="rounded-xl bg-[#003b51] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {copy.inquiry}
          </a>

          <a
            href={`/products?lang=${lang}`}
            className="rounded-xl border border-[#d8d1c4] bg-white px-5 py-3 text-sm font-medium text-[#003b51] transition hover:bg-[#f8f6f2]"
          >
            {copy.back}
          </a>
        </div>
      </div>
    </section>
  );
}