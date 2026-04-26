import Link from "next/link";
import { createClient } from "../../../lib/supabase-server";
import { listPublishedProducts } from "../../../lib/products/product-repository";

type ProductsPageProps = {
  searchParams?: Promise<{
    lang?: string;
    brand?: string;
    category?: string;
  }>;
};

const copy = {
  en: {
    badge: "PRODUCT CATALOG",
    title: "Explore our stationery and office product range.",
    description:
      "Browse a modern collection of writing instruments, markers, office tools, and school essentials presented in a clean and professional catalog style.",
    showing: "Showing",
    publishedProducts: "published products",
    sectionTitle: "Product catalog",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    fallbackDescription: "Product description will appear here.",
    viewProduct: "View Product",
    empty: "No published products are available yet.",
    clearFilter: "Clear filter",
    filteredBy: "Filtered by",
  },
  ar: {
    badge: "كتالوج المنتجات",
    title: "اكتشف مجموعة القرطاسية واللوازم المكتبية لدينا.",
    description:
      "تصفح تشكيلة احترافية من أدوات الكتابة والأقلام واللوازم المكتبية والاحتياجات المدرسية ضمن عرض منظم وواضح.",
    showing: "عرض",
    publishedProducts: "منتج منشور",
    sectionTitle: "كتالوج المنتجات",
    inStock: "متوفر",
    outOfStock: "غير متوفر",
    fallbackDescription: "سيظهر وصف المنتج هنا.",
    viewProduct: "عرض المنتج",
    empty: "لا توجد منتجات منشورة حالياً.",
    clearFilter: "إزالة الفلتر",
    filteredBy: "تصفية حسب",
  },
} as const;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  let products: Awaited<ReturnType<typeof listPublishedProducts>> = [];
  let loadError: string | null = null;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const lang = resolvedSearchParams?.lang === "ar" ? "ar" : "en";
  const brandFilter = resolvedSearchParams?.brand?.trim() || "";
  const categoryFilter = resolvedSearchParams?.category?.trim() || "";
  const isArabic = lang === "ar";
  const t = copy[lang];

  try {
    const supabase = await createClient();
    products = await listPublishedProducts(supabase);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load products right now.";
  }

  const filteredProducts = products.filter((product) => {
    const matchesBrand = brandFilter ? product.brand_slug === brandFilter : true;
    const matchesCategory = categoryFilter ? product.category_slug === categoryFilter : true;

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
        <div className={`max-w-3xl ${isArabic ? "mr-auto text-right" : ""}`}>
          <span className="inline-flex rounded-full border border-[#d8d1c4] bg-white px-3 py-1 text-xs font-medium tracking-wide text-[#243b6b]">
            {t.badge}
          </span>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d] md:text-5xl">
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
            <div className={isArabic ? "text-right" : ""}>
              <p className="text-sm text-[#7b8796]">
                {t.showing} {filteredProducts.length} {t.publishedProducts}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1f2f4d]">
                {t.sectionTitle}
              </h2>
              {selectedFilters.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-[#7b8796]">{t.filteredBy}</span>
                  {selectedFilters.map((filterLabel) => (
                    <span
                      key={filterLabel}
                      className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]"
                    >
                      {filterLabel}
                    </span>
                  ))}
                  <Link
                    href={`/products?lang=${lang}`}
                    className="text-sm font-medium text-[#243b6b] hover:underline"
                  >
                    {t.clearFilter}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[24px] border border-[#e6dfd3] bg-white shadow-sm transition hover:-translate-y-0.5"
              >
                <div className="h-56 overflow-hidden bg-[linear-gradient(135deg,#ede6db_0%,#dce7f1_100%)]">
                  {product.card_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.card_image_url}
                      alt={isArabic ? product.name_ar || product.name_en : product.name_en || product.name_ar}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>

                <div className={`p-5 ${isArabic ? "text-right" : ""}`}>
                  <div className="flex items-center gap-3">
                    {product.brand_logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.brand_logo_url}
                        alt={product.brand_name_en || "Brand logo"}
                        className="h-10 w-10 rounded-xl border border-[#d8d1c4] bg-white object-contain p-1"
                      />
                    ) : null}
                    <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]">
                      {isArabic
                        ? product.brand_name_ar || product.brand_name_en
                        : product.brand_name_en || product.brand_name_ar}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold leading-snug text-[#1f2f4d]">
                    {isArabic
                      ? product.name_ar || product.name_en
                      : product.name_en || product.name_ar}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#7b8796]">
                    {isArabic
                      ? product.category_name_ar || product.category_name_en
                      : product.category_name_en || product.category_name_ar}
                  </p>

                  <p
                    className={`mt-3 text-[15px] leading-7 text-[#4f5a69] ${
                      isArabic ? "font-arabic-medium" : "font-medium"
                    }`}
                  >
                    {isArabic
                      ? product.short_description_ar ||
                        product.short_description_en ||
                        t.fallbackDescription
                      : product.short_description_en ||
                        product.short_description_ar ||
                        t.fallbackDescription}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium">
                    <span
                      className={`rounded-full px-3 py-1 ${
                        product.stock_status === "in_stock"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {product.stock_status === "in_stock" ? t.inStock : t.outOfStock}
                    </span>
                  </div>

                  <Link
                    href={`/products/${product.slug}?lang=${lang}`}
                    className="mt-5 inline-flex rounded-xl border border-[#d7dfe8] bg-[#f8fbff] px-4 py-2.5 text-sm font-medium text-[#243b6b] transition hover:bg-[#eef3f8]"
                  >
                    {t.viewProduct}
                  </Link>
                </div>
              </article>
            ))}
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
