"use client";

import { useMemo, useState } from "react";
import type { ProductColorOption, ProductMediaItem } from "../../../../lib/products/product.types";

type Props = {
  colors: ProductColorOption[];
  galleryItems: ProductMediaItem[];
  productName: string;
  isArabic: boolean;
  colorFallback: string;
};

export function ProductColorGallery({
  colors,
  galleryItems,
  productName,
  isArabic,
  colorFallback,
}: Props) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(colors[0]?.id ?? null);

  const selectedColor = useMemo(
    () => colors.find((item) => item.id === selectedColorId) ?? colors[0] ?? null,
    [colors, selectedColorId]
  );

  const mainImageUrl = selectedColor?.mainImageUrl || galleryItems[0]?.url || "";

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[28px] border border-[#e6dfd3] bg-white shadow-sm">
          <div className="flex h-[420px] items-center justify-center bg-[linear-gradient(135deg,#eee7dc_0%,#dbe6f2_100%)]">
            {mainImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImageUrl} alt={productName} className="h-full w-full object-cover" />
            ) : (
              <div className="px-6 text-center">
                <p className="text-lg font-semibold text-[#1f2f4d]">{productName}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {galleryItems.slice(0, 4).map((item, index) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-[18px] border border-[#e6dfd3] bg-white"
            >
              {item.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.url}
                  alt={item.name || `Gallery ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div className="flex h-24 items-center justify-center px-3 text-center text-xs font-medium text-[#5b6472]">
                  {item.name || `Gallery ${index + 1}`}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">
          {isArabic ? "لون الحبر" : "Ink Color"}
        </p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => setSelectedColorId(color.id)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                selectedColor?.id === color.id
                  ? "bg-[#243b6b] text-white"
                  : "border border-[#d8d1c4] bg-[#fbfaf7] text-[#4f5968]"
              }`}
            >
              {isArabic
                ? color.nameAr || color.nameEn || colorFallback
                : color.nameEn || color.nameAr || colorFallback}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
