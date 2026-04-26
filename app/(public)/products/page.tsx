import Link from "next/link";
import { createClient } from "../../../lib/supabase-server";
import { listPublishedProducts } from "../../../lib/products/product-repository";

type ProductsPageProps = {
  searchParams?: Promise<{
    lang?: string;
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
    liveLabel: "Live from catalog",
    published: "Published",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    fallbackDescription: "Product description will appear here.",
    viewProduct: "View Product",
    empty: "No published products are available yet.",
    langLabel: "العربية",
  },
  ar: {
    badge: "كتالوج المنتجات",
    title: "اكتشف مجموعة القرطاسية واللوازم المكتبية لدينا.",
    description:
      "تصفح تشكيلة احترافية من أدوات الكتابة والأقلام واللوازم المكتبية والاحتياجات المدرسية ضمن عرض منظم وواضح.",
    showing: "عرض",
    publishedProducts: "منتج منشور",
    sectionTitle: "كتالوج المنتجات",
    liveLabel: "بيانات مباشرة من الكتالوج",
    published: "منشور",
    inStock: "متوفر",
    outOfStock: "غير متوفر",
    fallbackDescription: "سيظهر وصف المنتج هنا.",
    viewProduct: "عرض المنتج",
    empty: "لا توجد منتجات منشورة حالياً.",
    langLabel: "English",
  },
} as const;

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  let products: Awaited<ReturnType<typeof listPublishedProducts>> = [];
  let loadError: string | null = null;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const lang = resolvedSearchParams?.lang === "ar" ? "ar" : "en";
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

  return (
    <div className="space-y-10" dir={isArabic ? "rtl" : "ltr"}>
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
          <div className="flex flex-col gap-4 rounded-[24px] border border-[#e6dfd3] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className={isArabic ? "text-right" : ""}>
              <p className="text-sm text-[#7b8796]">
                {t.showing} {products.length} {t.publishedProducts}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1f2f4d]">
                {t.sectionTitle}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-[#eef3f8] px-4 py-2 text-sm font-medium text-[#243b6b]">
                {t.liveLabel}
              </span>
              <Link
                href={`/products?lang=${isArabic ? "en" : "ar"}`}
                className="inline-flex rounded-full border border-[#d8d1c4] bg-white px-4 py-2 text-sm font-medium text-[#243b6b] transition hover:bg-[#f8f6f2]"
              >
                {t.langLabel}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[24px] border border-[#e6dfd3] bg-white shadow-sm transition hover:-translate-y-0.5"
              >
                <div
                  className={`h-56 ${
                    index % 2 === 0
                      ? "bg-[linear-gradient(135deg,#ede6db_0%,#dce7f1_100%)]"
                      : "bg-[linear-gradient(135deg,#f4efe7_0%,#d6e1ec_100%)]"
                  }`}
                />

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]">
                      {isArabic
                        ? product.brand_name_ar || product.brand_name_en
                        : product.brand_name_en || product.brand_name_ar}
                    </span>

                    <span className="rounded-full bg-[#edf4ea] px-3 py-1 text-xs font-medium text-[#4f6b52]">
                      {t.published}
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

                  <p className="mt-3 text-sm leading-6 text-[#5b6472]">
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

          {products.length === 0 && !loadError && (
            <div className="rounded-[24px] border border-[#e6dfd3] bg-white px-6 py-12 text-center text-sm text-[#6a7483] shadow-sm">
              {t.empty}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
