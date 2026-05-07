"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicProductListItem } from "../../lib/products/product-repository";

type HomeProductsCarouselProps = {
  products: PublicProductListItem[];
  isArabic: boolean;
  copy: {
    title: string;
    action: string;
    viewProduct: string;
    inStock: string;
    outOfStock: string;
    fallbackDescription: string;
  };
};

export function HomeProductsCarousel({
  products,
  isArabic,
  copy,
}: HomeProductsCarouselProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(products.length > 0);

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
  }, [products.length]);

  const scrollByCard = (direction: "prev" | "next") => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const amount = Math.max(container.clientWidth * 0.82, 280);
    container.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className={isArabic ? "sm:text-right" : ""}>
          <h2 className="text-3xl font-semibold text-[#1f2f4d]">{copy.title}</h2>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link href="/products" className="text-sm font-medium text-[#243b6b] hover:underline">
            {copy.action}
          </Link>

          <div className="inline-flex items-center rounded-full border border-[#d8d1c4] bg-white p-1 shadow-sm">
            <button
              type="button"
              aria-label="Previous products"
              onClick={() => scrollByCard("prev")}
              disabled={!canScrollPrev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#243b6b] transition hover:bg-[#eef3f8] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isArabic ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button
              type="button"
              aria-label="Next products"
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
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <article
            key={product.id}
            className="group min-w-[280px] flex-1 snap-start overflow-hidden rounded-[24px] border border-[#e6dfd3] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-[0_22px_60px_rgba(31,47,77,0.12)] sm:min-w-[320px] lg:min-w-[360px]"
          >
            <div className="relative h-56 overflow-hidden bg-[linear-gradient(135deg,#ede6db_0%,#dce7f1_100%)]">
              {product.card_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.card_image_url}
                  alt={isArabic ? product.name_ar || product.name_en : product.name_en || product.name_ar}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-end bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(36,59,107,0.22)_100%)] p-6">
                  <span className="text-lg font-semibold text-[#1f2f4d]">
                    {isArabic ? product.name_ar || product.name_en : product.name_en || product.name_ar}
                  </span>
                </div>
              )}
            </div>

            <div className={`space-y-4 p-5 ${isArabic ? "text-right" : ""}`}>
              <div className="flex items-center gap-3">
                {product.brand_logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.brand_logo_url}
                    alt={product.brand_name_en || "Brand logo"}
                    className="h-10 w-16 object-contain"
                  />
                ) : null}
                <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]">
                  {isArabic
                    ? product.brand_name_ar || product.brand_name_en
                    : product.brand_name_en || product.brand_name_ar}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-semibold leading-snug text-[#1f2f4d]">
                  {isArabic ? product.name_ar || product.name_en : product.name_en || product.name_ar}
                </h3>
                <p className="mt-2 text-sm font-medium text-[#7b8796]">
                  {isArabic
                    ? product.category_name_ar || product.category_name_en
                    : product.category_name_en || product.category_name_ar}
                </p>
              </div>

              <p className={`text-[15px] leading-7 text-[#4f5a69] ${isArabic ? "font-arabic-medium" : "font-medium"}`}>
                {isArabic
                  ? product.short_description_ar || product.short_description_en || copy.fallbackDescription
                  : product.short_description_en || product.short_description_ar || copy.fallbackDescription}
              </p>

              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    product.stock_status === "in_stock"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {product.stock_status === "in_stock" ? copy.inStock : copy.outOfStock}
                </span>

                <Link
                  href={`/products/${product.slug}`}
                  className="inline-flex rounded-full border border-[#d7dfe8] bg-[#f8fbff] px-4 py-2 text-sm font-medium text-[#243b6b] transition hover:bg-[#eef3f8]"
                >
                  {copy.viewProduct}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
