import Link from "next/link";
import { notFound } from "next/navigation";
import { listActiveFeatureIcons } from "../../../../lib/features/feature-definitions-repository";
import { mapProductRecordToForm } from "../../../../lib/products/product-mappers";
import {
  getPublishedProductRecordBySlug,
  listPublishedProducts,
} from "../../../../lib/products/product-repository";
import { createClient } from "../../../../lib/supabase-server";
import { ProductColorGallery } from "./product-color-gallery";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
};

const copy = {
  en: {
    home: "Home",
    products: "Products",
    mainImagePlaceholder: "Main product image",
    colorFallback: "Colour",
    highlights: "Product Highlights",
    inquiry: "Send Inquiry",
    back: "Back to Products",
    info: "Product information",
    infoBody: "Additional features will appear here when available.",
    details: "Product Details",
    detailsTitle: "Description & specifications",
    detailsFallback:
      "Full product description will appear here once it is added from the admin panel.",
    brand: "Brand",
    category: "Category",
    availableColors: "Available Colors",
    noColors: "No colors added yet.",
    productCode: "Product Code",
    stock: "Availability",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    related: "Related Products",
    relatedEmptyTitle: "More products coming soon",
    relatedEmptyBody: "Related published products will appear here automatically.",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    mainImagePlaceholder: "الصورة الرئيسية للمنتج",
    colorFallback: "لون",
    highlights: "أبرز الميزات",
    inquiry: "إرسال استفسار",
    back: "العودة إلى المنتجات",
    info: "معلومات المنتج",
    infoBody: "ستظهر الميزات الإضافية هنا عند توفرها.",
    details: "تفاصيل المنتج",
    detailsTitle: "الوصف والمواصفات",
    detailsFallback: "سيظهر الوصف الكامل هنا بعد إضافته من لوحة الأدمن.",
    brand: "العلامة التجارية",
    category: "الفئة",
    availableColors: "الألوان المتوفرة",
    noColors: "لا توجد ألوان مضافة بعد.",
    productCode: "رمز المنتج",
    stock: "التوفر",
    inStock: "متوفر",
    outOfStock: "غير متوفر",
    related: "منتجات ذات صلة",
    relatedEmptyTitle: "منتجات أخرى قريباً",
    relatedEmptyBody: "ستظهر المنتجات المنشورة ذات الصلة هنا تلقائياً.",
  },
} as const;

export default async function ProductDetailsPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const lang = resolvedSearchParams?.lang === "ar" ? "ar" : "en";
  const isArabic = lang === "ar";
  const t = copy[lang];
  const supabase = await createClient();
  const featureOptions = await listActiveFeatureIcons(supabase);
  const productRecord = await getPublishedProductRecordBySlug(supabase, slug);

  if (!productRecord) {
    notFound();
  }

  const form = mapProductRecordToForm(productRecord, featureOptions);
  const relatedProducts = (await listPublishedProducts(supabase))
    .filter((item) => item.slug !== slug)
    .filter(
      (item) =>
        item.category_name_en === productRecord.categories?.name_en ||
        item.category_name_ar === productRecord.categories?.name_ar
    )
    .slice(0, 3);
  const highlights = form.highlights.filter(
    (item) => item.textEn.trim() !== "" || item.textAr.trim() !== ""
  );
  const features = form.featureIcons.filter((item) => item.selected);
  const productName = isArabic
    ? productRecord.product.name_ar || productRecord.product.name_en
    : productRecord.product.name_en || productRecord.product.name_ar;

  return (
    <div className="space-y-10">
      <div className="text-sm text-[#7b8796]">
        <Link href="/" className="hover:text-[#1f2f4d]">
          {t.home}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/products?lang=${lang}`} className="hover:text-[#1f2f4d]">
          {t.products}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#1f2f4d]">{productName}</span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductColorGallery
          galleryItems={form.galleryImages}
          features={features}
          productName={productName}
          isArabic={isArabic}
          mainImagePlaceholder={t.mainImagePlaceholder}
        />

        <div className={`rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm md:p-8 ${isArabic ? "text-right" : ""}`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-full bg-[#eef3f8] px-3 py-1.5">
              {productRecord.brands?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={productRecord.brands.logo_url}
                  alt={productRecord.brands.name_en || "Brand logo"}
                  className="h-8 w-8 rounded-full bg-white object-contain p-1"
                />
              ) : null}
              <span className="text-xs font-medium text-[#243b6b]">
                {isArabic
                  ? productRecord.brands?.name_ar || productRecord.brands?.name_en
                  : productRecord.brands?.name_en || productRecord.brands?.name_ar}
              </span>
            </div>
            <span className="rounded-full bg-[#f4f0e7] px-3 py-1 text-xs font-medium text-[#6a7483]">
              {isArabic
                ? productRecord.categories?.name_ar || productRecord.categories?.name_en
                : productRecord.categories?.name_en || productRecord.categories?.name_ar}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                productRecord.product.stock_status === "in_stock"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {productRecord.product.stock_status === "in_stock"
                ? t.inStock
                : t.outOfStock}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d]">
            {productName}
          </h1>

          <p
            className={`mt-4 text-lg leading-8 text-[#4f5a69] ${
              isArabic ? "font-arabic-medium" : "font-medium"
            }`}
          >
            {isArabic
              ? productRecord.product.short_description_ar ||
                productRecord.product.short_description_en ||
                t.detailsFallback
              : productRecord.product.short_description_en ||
                productRecord.product.short_description_ar ||
                t.detailsFallback}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">
                {t.availableColors}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {form.colors.length > 0 ? (
                  form.colors.map((color) => (
                    <div
                      key={color.id}
                      className="flex items-center gap-3 rounded-[18px] border border-[#d8d1c4] bg-[#fbfaf7] px-3 py-3"
                    >
                      {color.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={color.thumbnailUrl}
                          alt={color.nameEn || color.nameAr || t.colorFallback}
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
                            ? color.nameAr || color.nameEn || t.colorFallback
                            : color.nameEn || color.nameAr || t.colorFallback}
                        </p>
                        <p className="mt-1 text-xs text-[#6a7483]">
                          {color.productCode || productRecord.product.product_code}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[18px] border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-4 text-sm text-[#6a7483] sm:col-span-2">
                    {t.noColors}
                  </div>
                )}
              </div>
            </div>

            {highlights.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">
                  {t.highlights}
                </p>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-2 text-sm text-[#4f5968]"
                    >
                      {isArabic ? item.textAr || item.textEn : item.textEn || item.textAr}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="rounded-xl bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t.inquiry}
            </a>

            <a
              href={`/products?lang=${lang}`}
              className="rounded-xl border border-[#d8d1c4] bg-white px-5 py-3 text-sm font-medium text-[#243b6b] transition hover:bg-[#f8f6f2]"
            >
              {t.back}
            </a>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
            {t.details}
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-[#1f2f4d]">
            {t.detailsTitle}
          </h2>

          <div
            className={`mt-6 space-y-4 text-[15px] leading-8 text-[#4f5a69] ${
              isArabic ? "font-arabic-medium" : "font-medium"
            }`}
          >
            <p>
              {isArabic
                ? productRecord.product.full_description_ar ||
                  productRecord.product.full_description_en ||
                  t.detailsFallback
                : productRecord.product.full_description_en ||
                  productRecord.product.full_description_ar ||
                  t.detailsFallback}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">{t.brand}</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {isArabic
                  ? productRecord.brands?.name_ar || productRecord.brands?.name_en
                  : productRecord.brands?.name_en || productRecord.brands?.name_ar}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">{t.category}</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {isArabic
                  ? productRecord.categories?.name_ar || productRecord.categories?.name_en
                  : productRecord.categories?.name_en || productRecord.categories?.name_ar}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">
                {t.availableColors}
              </p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {form.colors.length > 0
                  ? form.colors
                      .map((item) =>
                        isArabic ? item.nameAr || item.nameEn : item.nameEn || item.nameAr
                      )
                      .filter(Boolean)
                      .join(", ")
                  : t.noColors}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">{t.stock}</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {productRecord.product.stock_status === "in_stock"
                  ? t.inStock
                  : t.outOfStock}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">{t.productCode}</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {productRecord.product.product_code}
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
            {t.related}
          </p>

          <div className="mt-5 space-y-4">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}?lang=${lang}`}
                  className="block rounded-[20px] bg-[#f8f6f2] p-4 transition hover:bg-[#eef3f8]"
                >
                  <p className="font-semibold text-[#1f2f4d]">
                    {isArabic ? item.name_ar || item.name_en : item.name_en || item.name_ar}
                  </p>
                  <p className="mt-1 text-sm text-[#5b6472]">
                    {isArabic
                      ? item.short_description_ar ||
                        item.short_description_en ||
                        item.category_name_ar ||
                        item.category_name_en
                      : item.short_description_en ||
                        item.short_description_ar ||
                        item.category_name_en ||
                        item.category_name_ar}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-[20px] bg-[#f8f6f2] p-4">
                <p className="font-semibold text-[#1f2f4d]">{t.relatedEmptyTitle}</p>
                <p className="mt-1 text-sm text-[#5b6472]">{t.relatedEmptyBody}</p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
