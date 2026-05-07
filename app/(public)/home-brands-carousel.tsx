"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CatalogItem } from "../../lib/catalog/catalog.types";

type HomeBrandsCarouselProps = {
  brands: CatalogItem[];
  isArabic: boolean;
  copy: {
    title: string;
    action: string;
    fallbackPrefix: string;
  };
};

export function HomeBrandsCarousel({
  brands,
  isArabic,
  copy,
}: HomeBrandsCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(brands.length > 0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setCanScrollPrev(container.scrollLeft > 8);
      setCanScrollNext(container.scrollLeft < maxScrollLeft - 8);
    };

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [brands.length]);

  const scrollByCard = (direction: "prev" | "next") => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const amount = Math.max(container.clientWidth * 0.72, 220);
    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-5 rounded-[28px] bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className={`text-3xl font-semibold text-[#1f2f4d] ${isArabic ? "sm:text-right" : ""}`}>
          {copy.title}
        </h2>

        <div className="flex items-center justify-between gap-3">
          <Link href="/products" className="text-sm font-medium text-[#243b6b] hover:underline">
            {copy.action}
          </Link>

          <div className="inline-flex items-center rounded-full border border-[#d8d1c4] bg-[#fbfaf7] p-1">
            <button
              type="button"
              aria-label="Previous brands"
              onClick={() => scrollByCard("prev")}
              disabled={!canScrollPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#243b6b] transition hover:bg-[#eef3f8] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isArabic ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button
              type="button"
              aria-label="Next brands"
              onClick={() => scrollByCard("next")}
              disabled={!canScrollNext}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#243b6b] transition hover:bg-[#eef3f8] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isArabic ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.slug}`}
            className="group flex min-w-[180px] snap-start items-center justify-center rounded-[24px] px-5 py-6 transition duration-300 hover:-translate-y-1 hover:bg-[#f8f6f2]"
          >
            {brand.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logo_url}
                alt={brand.name_en}
                className="h-16 w-full object-contain opacity-90 transition duration-300 group-hover:opacity-100 group-hover:scale-[1.03]"
              />
            ) : (
              <span className="text-center text-base font-semibold text-[#243b6b]">
                {copy.fallbackPrefix} {isArabic ? brand.name_ar : brand.name_en}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
