"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  ProductColorOption,
  ProductFeatureIcon,
  ProductMediaItem,
} from "../../../../lib/products/product.types";

type Props = {
  colors: ProductColorOption[];
  selectedColorId: string | null;
  galleryItems: ProductMediaItem[];
  features: ProductFeatureIcon[];
  productName: string;
  isArabic: boolean;
  colorFallback: string;
  mainImagePlaceholder: string;
};

export function ProductColorGallery({
  colors,
  selectedColorId,
  galleryItems,
  features,
  productName,
  isArabic,
  colorFallback,
  mainImagePlaceholder,
}: Props) {
  const [selectedGalleryImageId, setSelectedGalleryImageId] = useState<string | null>(null);

  const selectedColor = useMemo(
    () => colors.find((item) => item.id === selectedColorId) ?? colors[0] ?? null,
    [colors, selectedColorId]
  );

  useEffect(() => {
    setSelectedGalleryImageId(null);
  }, [selectedColorId]);

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
          {isArabic ? "الميزات" : "Features"}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="rounded-[18px] border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-4"
            >
              <p className="text-sm font-semibold text-[#1f2f4d]">
                {isArabic ? item.labelAr || item.labelEn : item.labelEn || item.labelAr}
              </p>
              <p className="mt-1 text-xs text-[#7b8796]">{item.key}</p>
            </div>
          ))}
          {features.length === 0 && (
            <div className="rounded-[18px] border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-4 text-sm text-[#6a7483] sm:col-span-2">
              {isArabic ? "لا توجد ميزات مفعلة لهذا المنتج بعد." : "No product features are active yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
