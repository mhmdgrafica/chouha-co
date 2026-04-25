import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../lib/supabase-server";
import { mapProductRecordToForm } from "../../../../lib/products/product-mappers";
import {
  getPublishedProductRecordBySlug,
  listPublishedProducts,
} from "../../../../lib/products/product-repository";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    lang?: string;
  }>;
};

const copy = {
  en: {
    home: "Home",
    products: "Products",
    published: "Published",
    mainImageFallback: "Product image",
    mainImagePlaceholder: "Main product image placeholder",
    inkColor: "Ink Color",
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
    related: "Related Products",
    relatedEmptyTitle: "More products coming soon",
    relatedEmptyBody: "Related published products will appear here automatically.",
    langLabel: "العربية",
  },
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    published: "منشور",
    mainImageFallback: "صورة المنتج",
    mainImagePlaceholder: "معاينة مؤقتة للصورة الرئيسية",
    inkColor: "لون الحبر",
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
    related: "منتجات ذات صلة",
    relatedEmptyTitle: "منتجات أخرى قريباً",
    relatedEmptyBody: "ستظهر المنتجات المنشورة ذات الصلة هنا تلقائياً.",
    langLabel: "English",
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
  const productRecord = await getPublishedProductRecordBySlug(supabase, slug);

  if (!productRecord) {
    notFound();
  }

  const form = mapProductRecordToForm(productRecord);
  const relatedProducts = (await listPublishedProducts(supabase))
    .filter((item) => item.slug !== slug)
    .filter((item) => item.category === productRecord.product.category)
    .slice(0, 3);
  const highlights = form.highlights.filter(
    (item) => item.textEn.trim() !== "" || item.textAr.trim() !== ""
  );
  const features = form.featureIcons.filter((item) => item.selected);
  const galleryItems =
    form.galleryImages.length > 0
      ? form.galleryImages
      : [
          { id: "placeholder-1", name: "Gallery 1", type: "image" as const, preview: "" },
          { id: "placeholder-2", name: "Gallery 2", type: "image" as const, preview: "" },
          { id: "placeholder-3", name: "Gallery 3", type: "image" as const, preview: "" },
          { id: "placeholder-4", name: "Gallery 4", type: "image" as const, preview: "" },
        ];

  return (
    <div className="space-y-10" dir={isArabic ? "rtl" : "ltr"}>
      <div className="text-sm text-[#7b8796]">
        <Link href="/" className="hover:text-[#1f2f4d]">
          {t.home}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/products?lang=${lang}`} className="hover:text-[#1f2f4d]">
          {t.products}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#1f2f4d]">
          {isArabic
            ? productRecord.product.product_name_ar ||
              productRecord.product.product_name_en
            : productRecord.product.product_name_en ||
              productRecord.product.product_name_ar}
        </span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-[#e6dfd3] bg-white shadow-sm">
            <div className="flex h-[420px] items-center justify-center bg-[linear-gradient(135deg,#eee7dc_0%,#dbe6f2_100%)] px-6 text-center">
              <div>
                <p className="text-lg font-semibold text-[#1f2f4d]">
                  {form.mainCardImage?.name ||
                    (isArabic
                      ? productRecord.product.product_name_ar ||
                        productRecord.product.product_name_en
                      : productRecord.product.product_name_en ||
                        productRecord.product.product_name_ar) ||
                    t.mainImageFallback}
                </p>
                <p className="mt-2 text-sm text-[#6a7483]">
                  {t.mainImagePlaceholder}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {galleryItems.slice(0, 4).map((item, index) => (
              <div
                key={item.id}
                className="flex h-24 items-center justify-center rounded-[18px] border border-[#e6dfd3] bg-[linear-gradient(135deg,#f2ede5_0%,#dde7f1_100%)] px-3 text-center text-xs font-medium text-[#5b6472]"
              >
                {item.name || `Gallery ${index + 1}`}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]">
              {productRecord.product.brand}
            </span>
            <span className="rounded-full bg-[#f4f0e7] px-3 py-1 text-xs font-medium text-[#6a7483]">
              {productRecord.product.category}
            </span>
            <span className="rounded-full bg-[#edf4ea] px-3 py-1 text-xs font-medium text-[#4f6b52]">
              {t.published}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d]">
            {isArabic
              ? productRecord.product.product_name_ar ||
                productRecord.product.product_name_en
              : productRecord.product.product_name_en ||
                productRecord.product.product_name_ar}
          </h1>

          <p className="mt-4 text-base leading-7 text-[#5b6472]">
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
                {t.inkColor}
              </p>
              <div className="flex flex-wrap gap-2">
                {form.colors.map((color, index) => (
                  <button
                    key={color.id}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      index === 0
                        ? "bg-[#243b6b] text-white"
                        : "border border-[#d8d1c4] bg-[#fbfaf7] text-[#4f5968] hover:bg-[#eef3f8]"
                    }`}
                  >
                    {isArabic
                      ? color.nameAr || color.nameEn || t.colorFallback
                      : color.nameEn || color.nameAr || t.colorFallback}
                  </button>
                ))}
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
                      {isArabic
                        ? item.textAr || item.textEn
                        : item.textEn || item.textAr}
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

            <Link
              href={`/products/${slug}?lang=${isArabic ? "en" : "ar"}`}
              className="rounded-xl border border-[#d8d1c4] bg-white px-5 py-3 text-sm font-medium text-[#243b6b] transition hover:bg-[#f8f6f2]"
            >
              {t.langLabel}
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {features.length > 0 ? (
              features.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-[18px] bg-[#f8f6f2] p-4">
                  <p className="text-sm font-semibold text-[#1f2f4d]">
                    {item.key}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[#6a7483]">
                    {item.icon}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[18px] bg-[#f8f6f2] p-4 sm:col-span-3">
                <p className="text-sm font-semibold text-[#1f2f4d]">
                  {t.info}
                </p>
                <p className="mt-1 text-xs leading-6 text-[#6a7483]">
                  {t.infoBody}
                </p>
              </div>
            )}
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

          <div className="mt-6 space-y-4 text-sm leading-7 text-[#5b6472]">
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
                {productRecord.product.brand}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">{t.category}</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {productRecord.product.category}
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
              <p className="text-sm font-semibold text-[#1f2f4d]">
                {t.productCode}
              </p>
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
                    {isArabic
                      ? item.product_name_ar || item.product_name_en
                      : item.product_name_en || item.product_name_ar}
                  </p>
                  <p className="mt-1 text-sm text-[#5b6472]">
                    {isArabic
                      ? item.short_description_ar ||
                        item.short_description_en ||
                        item.category
                      : item.short_description_en ||
                        item.short_description_ar ||
                        item.category}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-[20px] bg-[#f8f6f2] p-4">
                <p className="font-semibold text-[#1f2f4d]">
                  {t.relatedEmptyTitle}
                </p>
                <p className="mt-1 text-sm text-[#5b6472]">
                  {t.relatedEmptyBody}
                </p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
