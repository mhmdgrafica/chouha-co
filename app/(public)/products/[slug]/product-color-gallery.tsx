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
    if (displayImages.length <= 1) {
      return;
    }

    setActiveImageIndex((currentIndex) => {
      if (direction === "next") {
        return (currentIndex + 1) % displayImages.length;
      }

      return (currentIndex - 1 + displayImages.length) % displayImages.length;
    });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[30px] border border-[#e6dfd3] bg-white shadow-sm">
        <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-white px-6 py-8">
          {activeImage?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeImage.url}
              alt={activeImage.name || productName}
              className="h-full max-h-[460px] w-full bg-white object-contain p-3"
            />
          ) : (
            <div className="px-6 text-center">
              <p className="text-lg font-semibold text-[#1f2f4d]">{productName}</p>
              <p className="mt-2 text-sm text-[#6a7483]">{mainImagePlaceholder}</p>
            </div>
          )}

          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => cycleImage("prev")}
                aria-label={isArabic ? "الصورة السابقة" : "Previous image"}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8d1c4] bg-white text-[#1f2f4d] shadow-sm transition hover:bg-[#f8f6f2]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => cycleImage("next")}
                aria-label={isArabic ? "الصورة التالية" : "Next image"}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d8d1c4] bg-white text-[#1f2f4d] shadow-sm transition hover:bg-[#f8f6f2]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {displayImages.length > 0 && (
          <div className="border-t border-[#efe8db] bg-white px-4 py-4">
            <div className="flex flex-wrap gap-3">
              {displayImages.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`overflow-hidden rounded-[18px] border bg-white transition ${
                    activeImageIndex === index
                      ? "border-[#243b6b] shadow-[0_0_0_2px_rgba(36,59,107,0.12)]"
                      : "border-[#e6dfd3]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.url}
                    alt={item.name || `Image ${index + 1}`}
                    className="h-20 w-20 bg-white object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-[28px] border border-[#e6dfd3] bg-white p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {features.length > 0 ? (
            features.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-[20px] border border-[#e6dfd3] bg-[#fbfaf7] px-4 py-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3f8] text-[#243b6b]">
                  <FeatureIcon name={item.iconName} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1f2f4d]">
                    {isArabic ? item.labelAr || item.labelEn : item.labelEn || item.labelAr}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-[#e6dfd3] bg-[#fbfaf7] px-4 py-4 text-sm text-[#6a7483] sm:col-span-2 xl:col-span-4">
              {isArabic ? "لا توجد ميزات مفعلة لهذا المنتج بعد." : "No product features are active yet."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
