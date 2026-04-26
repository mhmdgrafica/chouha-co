"use client";

import { useMemo, useState } from "react";
import type {
  ProductColorOption,
  ProductFeatureIcon,
  ProductMediaItem,
} from "../../../../lib/products/product.types";

type Props = {
  colors: ProductColorOption[];
  galleryItems: ProductMediaItem[];
  productName: string;
  isArabic: boolean;
  colorFallback: string;
  mainImagePlaceholder: string;
};

export function ProductColorGallery({
  colors,
  galleryItems,
  productName,
  isArabic,
  colorFallback,
  mainImagePlaceholder,
}: Props) {
  const [selectedColorId, setSelectedColorId] = useState<string | null>(
    colors[0]?.id ?? null
  );
  const [selectedGalleryImageId, setSelectedGalleryImageId] = useState<string | null>(null);

  const selectedColor = useMemo(
    () => colors.find((item) => item.id === selectedColorId) ?? colors[0] ?? null,
    [colors, selectedColorId]
  );

  const selectedGalleryImage = useMemo(
    () =>
      galleryItems.find((item) => item.id === selectedGalleryImageId) ??
      galleryItems[0] ??
      null,
    [galleryItems, selectedGalleryImageId]
  );

  const mainImageUrl =
    selectedGalleryImage?.url ||
    selectedColor?.mainImageUrl ||
    galleryItems[0]?.url ||
    "";

  const handleSelectColor = (colorId: string) => {
    setSelectedColorId(colorId);
    setSelectedGalleryImageId(null);
  };

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
                <p className="mt-2 text-sm text-[#6a7483]">{mainImagePlaceholder}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {galleryItems.slice(0, 4).map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedGalleryImageId(item.id)}
              className={`overflow-hidden rounded-[18px] border bg-white ${
                selectedGalleryImage?.id === item.id
                  ? "border-[#243b6b]"
                  : "border-[#e6dfd3]"
              }`}
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
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-[#e6dfd3] bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">
          {isArabic ? "ألوان المنتج" : "Product Colors"}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {colors.map((color) => (
            <button
              key={color.id}
              type="button"
              onClick={() => handleSelectColor(color.id)}
              className={`flex items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition ${
                selectedColor?.id === color.id
                  ? "border-[#243b6b] bg-[#eef3f8]"
                  : "border-[#d8d1c4] bg-[#fbfaf7]"
              }`}
            >
              {color.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={color.thumbnailUrl}
                  alt={color.nameEn || color.nameAr || colorFallback}
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
                  {isArabic
                    ? color.nameAr || color.nameEn || colorFallback
                    : color.nameEn || color.nameAr || colorFallback}
                </p>
                <p className="mt-1 text-xs text-[#6a7483]">
                  {color.productCode || productName}
                </p>
              </div>
            </button>
          ))}
          {colors.length === 0 && (
            <div className="rounded-[18px] border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-4 text-sm text-[#6a7483] sm:col-span-2">
              {isArabic ? "لا توجد ألوان مضافة لهذا المنتج بعد." : "No product colors are available yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
