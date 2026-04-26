"use client";

import { useMemo, useState } from "react";
import type {
  ProductColorOption,
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
          <div className="flex items-center justify-between border-b border-[#efe8db] bg-[#fbf8f2] px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b8796]">
                {isArabic ? "المعرض الرئيسي" : "Main Gallery"}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1f2f4d]">
                {isArabic
                  ? selectedColor?.nameAr || selectedColor?.nameEn || colorFallback
                  : selectedColor?.nameEn || selectedColor?.nameAr || colorFallback}
              </p>
            </div>

            {selectedColor && (
              <div className="flex items-center gap-2 rounded-full border border-[#d8d1c4] bg-white px-3 py-1.5">
                <span
                  className="h-3 w-3 rounded-full border border-white shadow-sm ring-1 ring-[#d8d1c4]"
                  style={{ backgroundColor: selectedColor.hex || "#ddd" }}
                />
                <span className="text-xs font-medium text-[#5b6472]">
                  {selectedColor.productCode || productName}
                </span>
              </div>
            )}
          </div>

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
              className={`overflow-hidden rounded-[18px] border bg-white transition ${
                selectedGalleryImage?.id === item.id
                  ? "border-[#243b6b] shadow-[0_0_0_2px_rgba(36,59,107,0.12)]"
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
                  ? "border-[#243b6b] bg-[#eef3f8] shadow-[0_0_0_2px_rgba(36,59,107,0.08)]"
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
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-[#1f2f4d]">
                    {isArabic
                      ? color.nameAr || color.nameEn || colorFallback
                      : color.nameEn || color.nameAr || colorFallback}
                  </p>
                  {selectedColor?.id === color.id && (
                    <span className="rounded-full bg-[#243b6b] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                      {isArabic ? "نشط" : "Active"}
                    </span>
                  )}
                </div>
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
