"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FeatureIcon } from "../../../../components/feature-icon";
import type {
  ProductColorOption,
  ProductFeatureIcon,
  ProductMediaItem,
} from "../../../../lib/products/product.types";

type SelectedVariantImage = {
  id: string;
  name: string;
  url: string;
};

type Props = {
  colors: ProductColorOption[];
  selectedColorId: string | null;
  selectedVariantImage: SelectedVariantImage | null;
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
  selectedVariantImage,
  galleryItems,
  features,
  productName,
  isArabic,
  colorFallback,
  mainImagePlaceholder,
}: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const selectedColor = useMemo(
    () => colors.find((item) => item.id === selectedColorId) ?? colors[0] ?? null,
    [colors, selectedColorId]
  );

  const displayImages = useMemo(() => {
    const leadingImage = selectedVariantImage
      ? [selectedVariantImage]
      : selectedColor?.mainImageUrl
        ? [
            {
              id: `selected-color-${selectedColor.id}`,
              name:
                (isArabic
                  ? selectedColor.nameAr || selectedColor.nameEn
                  : selectedColor.nameEn || selectedColor.nameAr) || colorFallback,
              url: selectedColor.mainImageUrl,
            },
          ]
        : [];

    return [
      ...leadingImage,
      ...galleryItems.map((item) => ({
        id: item.id,
        name: item.name,
        url: item.url,
      })),
    ];
  }, [colorFallback, galleryItems, isArabic, selectedColor, selectedVariantImage]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedColorId, selectedVariantImage?.id]);

  useEffect(() => {
    if (activeImageIndex > displayImages.length - 1) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, displayImages.length]);

  const activeImage = displayImages[activeImageIndex] ?? null;

  const cycleImage = (direction: "prev" | "next") => {
    if (displayImages.length <= 1) return;

    setActiveImageIndex((currentIndex) =>
      direction === "next"
        ? (currentIndex + 1) % displayImages.length
        : (currentIndex - 1 + displayImages.length) % displayImages.length
    );
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[30px] border border-[#e6dfd3] bg-white shadow-sm">
        <div className="relative flex aspect-square min-h-[420px] items-center justify-center overflow-hidden bg-white">
          {activeImage?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage.url}
              alt={activeImage.name || productName}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="px-6 text-center">
              <p className="text-lg font-semibold text-[#003b51]">{productName}</p>
              <p className="mt-2 text-sm text-[#6a7483]">{mainImagePlaceholder}</p>
            </div>
          )}

          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => cycleImage("prev")}
                aria-label={isArabic ? "الصورة السابقة" : "Previous image"}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6dfd3] bg-white/95 text-[#003b51] shadow-sm transition hover:scale-105 hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => cycleImage("next")}
                aria-label={isArabic ? "الصورة التالية" : "Next image"}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-[#e6dfd3] bg-white/95 text-[#003b51] shadow-sm transition hover:scale-105 hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-[#e6dfd3] bg-white px-5 py-6 shadow-sm">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.length > 0 ? (
            features.map((item) => (
              <div key={item.id} className="flex flex-col items-center text-center">
                <FeatureIcon name={item.iconName} className="h-9 w-9 text-[#003b51]" />
                <p className="mt-3 text-sm font-semibold leading-6 text-[#1f2f4d]">
                  {isArabic ? item.labelAr || item.labelEn : item.labelEn || item.labelAr}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-[#6a7483] sm:col-span-2 xl:col-span-4">
              {isArabic
                ? "لا توجد ميزات مفعلة لهذا المنتج بعد."
                : "No product features are active yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}