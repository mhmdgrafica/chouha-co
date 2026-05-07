import Link from "next/link";
import { cookies } from "next/headers";
import { createClient } from "../../../lib/supabase-server";
import { listPublishedProducts } from "../../../lib/products/product-repository";
import { productsPageCopy } from "../copy/products-copy";
import { PUBLIC_LANGUAGE_COOKIE, resolvePublicLang } from "../copy/shared";

type ProductsPageProps = {
  searchParams?: Promise<{
    brand?: string;
    category?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  let products: Awaited<ReturnType<typeof listPublishedProducts>> = [];

  const cookieStore = await cookies();
  const lang = resolvePublicLang(cookieStore.get(PUBLIC_LANGUAGE_COOKIE)?.value);
  const isArabic = lang === "ar";
  const t = productsPageCopy[lang];

  let loadError: string | null = null;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const brandFilter = resolvedSearchParams?.brand?.trim() || "";
  const categoryFilter = resolvedSearchParams?.category?.trim() || "";

  try {
    const supabase = await createClient();
    products = await listPublishedProducts(supabase);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : t.loadErrorFallback;
  }

  const filteredProducts = products.filter((product) => {
    const matchesBrand = brandFilter ? product.brand_slug === brandFilter : true;
    const matchesCategory = categoryFilter
      ? product.category_slug === categoryFilter
      : true;

    return matchesBrand && matchesCategory;
  });

  const selectedBrand = brandFilter
    ? products.find((product) => product.brand_slug === brandFilter)
    : null;

  const selectedCategory = categoryFilter
    ? products.find((product) => product.category_slug === categoryFilter)
    : null;

  const selectedFilters = [
    selectedBrand
      ? isArabic
        ? selectedBrand.brand_name_ar || selectedBrand.brand_name_en
        : selectedBrand.brand_name_en || selectedBrand.brand_name_ar
      : null,
    selectedCategory
      ? isArabic
        ? selectedCategory.category_name_ar || selectedCategory.category_name_en
        : selectedCategory.category_name_en || selectedCategory.category_name_ar
      : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <div className="space-y-10">
      <section className="rounded-[28px] bg-[#f3efe7] p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-[#d8d1c4] bg-white px-3 py-1 text-xs font-medium tracking-wide text-[#003b51]">
            {t.badge}
          </span>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#003b51] md:text-5xl">
            {t.title}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5b6472]">
            {t.description}
          </p>
        </div>
      </section>

      <section className="space-y-6">
        {loadError && (
          <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {loadError}
          </div>
        )}

        <div className="space-y-6">
          <div className="rounded-[24px] border border-[#e6dfd3] bg-white p-5 shadow-sm">
            <p className="text-sm text-[#7b8796]">
              {t.showing} {filteredProducts.length} {t.publishedProducts}
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-[#003b51]">
              {t.sectionTitle}
            </h2>

            {selectedFilters.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-[#7b8796]">{t.filteredBy}</span>

                {selectedFilters.map((filterLabel) => (
                  <span
                    key={filterLabel}
                    className="rounded-full bg-[#eaf4f3] px-3 py-1 text-xs font-medium text-[#003b51]"
                  >
                    {filterLabel}
                  </span>
                ))}

                <Link
                  href="/products"
                  className="text-sm font-medium text-[#003b51] hover:underline"
                >
                  {t.clearFilter}
                </Link>
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const productName = isArabic
                ? product.name_ar || product.name_en
                : product.name_en || product.name_ar;

              const brandName = isArabic
                ? product.brand_name_ar || product.brand_name_en
                : product.brand_name_en || product.brand_name_ar;

              const categoryName = isArabic
                ? product.category_name_ar || product.category_name_en
                : product.category_name_en || product.category_name_ar;

              const description = isArabic
                ? product.short_description_ar ||
                  product.short_description_en ||
                  t.fallbackDescription
                : product.short_description_en ||
                  product.short_description_ar ||
                  t.fallbackDescription;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group block overflow-hidden rounded-[24px] border border-[#e6dfd3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(0,59,81,0.10)]"
                >
                  <div className="flex h-64 items-center justify-center overflow-hidden bg-white p-5">
                    {product.card_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.card_image_url}
                        alt={productName}
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="h-full w-full rounded-[20px] bg-[#f3efe7]" />
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-3">
                      {product.brand_logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.brand_logo_url}
                          alt={product.brand_name_en || "Brand logo"}
                          className="h-8 max-w-[110px] object-contain"
                        />
                      ) : null}

                      {brandName ? (
                        <span className="rounded-full bg-[#eaf4f3] px-3 py-1 text-xs font-medium text-[#003b51]">
                          {brandName}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-4 text-xl font-semibold leading-snug text-[#003b51]">
                      {productName}
                    </h3>

                    <p className="mt-2 text-sm font-medium text-[#7b8796]">
                      {categoryName}
                    </p>

                    <p
                      className={`mt-3 line-clamp-3 text-[15px] leading-7 text-[#4f5a69] ${
                        isArabic ? "font-arabic-medium" : "font-medium"
                      }`}
                    >
                      {description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                      <span
                        className={`rounded-full px-3 py-1 ${
                          product.stock_status === "in_stock"
                            ? "bg-[#eaf4f3] text-[#003b51]"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {product.stock_status === "in_stock"
                          ? t.inStock
                          : t.outOfStock}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredProducts.length === 0 && !loadError && (
            <div className="rounded-[24px] border border-[#e6dfd3] bg-white px-6 py-12 text-center text-sm text-[#6a7483] shadow-sm">
              {t.empty}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
