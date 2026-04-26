"use client";

import { useState } from "react";
import type {
  ProductColorOption,
  ProductFeatureIcon,
  ProductHighlight,
  ProductMediaItem,
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
};

type ProductOverviewProps = {
  colors: ProductColorOption[];
  galleryItems: ProductMediaItem[];
  features: ProductFeatureIcon[];
  highlights: ProductHighlight[];
  productName: string;
  brandName: string;
  brandLogoUrl: string;
  categoryName: string;
  shortDescription: string;
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
  productName,
  brandName,
  brandLogoUrl,
  categoryName,
  shortDescription,
  stockStatus,
  fallbackProductCode,
  isArabic,
  lang,
  copy,
}: ProductOverviewProps) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    colors[0]?.id ?? null
  );

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <ProductColorGallery
        colors={colors}
        selectedColorId={selectedColorId}
        galleryItems={galleryItems}
        features={features}
        productName={productName}
        isArabic={isArabic}
        colorFallback={copy.colorFallback}
        mainImagePlaceholder={copy.mainImagePlaceholder}
      />

      <div
        className={`rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm md:p-8 ${
          isArabic ? "text-right" : ""
        }`}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-full bg-[#eef3f8] px-3 py-1.5">
            {brandLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandLogoUrl}
                alt={brandName || "Brand logo"}
                className="h-8 w-8 rounded-full bg-white object-contain p-1"
              />
            ) : null}
            <span className="text-xs font-medium text-[#243b6b]">{brandName}</span>
          </div>
          <span className="rounded-full bg-[#f4f0e7] px-3 py-1 text-xs font-medium text-[#6a7483]">
            {categoryName}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              stockStatus === "in_stock"
                ? "bg-blue-50 text-blue-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {stockStatus === "in_stock" ? copy.inStock : copy.outOfStock}
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d]">
          {productName}
        </h1>

        <p
          className={`mt-4 text-lg leading-8 text-[#4f5a69] ${
            isArabic ? "font-arabic-medium" : "font-medium"
          }`}
        >
          {shortDescription}
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">
              {copy.availableColors}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {colors.length > 0 ? (
                colors.map((color) => {
                  const isActive = color.id === selectedColorId;
                  const colorName = isArabic
                    ? color.nameAr || color.nameEn || copy.colorFallback
                    : color.nameEn || color.nameAr || copy.colorFallback;

                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColorId(color.id)}
                      className={`flex items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition ${
                        isActive
                          ? "border-[#243b6b] bg-[#eef3f8] shadow-[0_0_0_2px_rgba(36,59,107,0.12)]"
                          : "border-[#d8d1c4] bg-[#fbfaf7]"
                      }`}
                    >
                      {color.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={color.thumbnailUrl}
                          alt={colorName}
                          className="h-12 w-12 rounded-xl border border-[#d8d1c4] object-cover"
                        />
                      ) : (
                        <div
                          className="h-12 w-12 rounded-xl border border-[#d8d1c4]"
                          style={{ backgroundColor: color.hex || "#ddd" }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1f2f4d]">
                          {colorName}
                        </p>
                        <p className="mt-1 text-xs text-[#6a7483]">
                          {color.productCode || fallbackProductCode}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[18px] border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-4 text-sm text-[#6a7483] sm:col-span-2">
                  {copy.noColors}
                </div>
              )}
            </div>
          </div>

          {highlights.length > 0 && (
            <div>
              <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">
                {copy.highlights}
              </p>
              <div className="flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-2 text-sm text-[#4f5968]"
                  >
                    {isArabic ? item.textAr || item.textEn : item.textEn || item.textAr}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/contact"
            className="rounded-xl bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {copy.inquiry}
          </a>

          <a
            href={`/products?lang=${lang}`}
            className="rounded-xl border border-[#d8d1c4] bg-white px-5 py-3 text-sm font-medium text-[#243b6b] transition hover:bg-[#f8f6f2]"
          >
            {copy.back}
          </a>
        </div>
      </div>
    </section>
  );
}
