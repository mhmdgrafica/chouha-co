import Link from "next/link";
import { notFound } from "next/navigation";
import { listActiveFeatureIcons } from "../../../../lib/features/feature-definitions-repository";
import { mapProductRecordToForm } from "../../../../lib/products/product-mappers";
import {
  getPublishedProductRecordBySlug,
  listPublishedProducts,
} from "../../../../lib/products/product-repository";
import { createClient } from "../../../../lib/supabase-server";
import { ProductOverview } from "./product-overview";

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
    detailsFallback:
      "Full product description will appear here once it is added from the admin panel.",
    availableColors: "Available Colors",
    noColors: "No colors added yet.",
    productCode: "Product Code",
    descriptionTitle: "Description",
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
    detailsFallback: "سيظهر الوصف الكامل هنا بعد إضافته من لوحة الأدمن.",
    availableColors: "الألوان المتوفرة",
    noColors: "لا توجد ألوان مضافة بعد.",
    productCode: "رمز المنتج",
    descriptionTitle: "الوصف",
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

      <ProductOverview
        colors={form.colors}
        galleryItems={form.galleryImages}
        features={features}
        highlights={highlights}
        optionGroups={form.optionGroups}
        productName={productName}
        brandName={
          isArabic
            ? productRecord.brands?.name_ar || productRecord.brands?.name_en || ""
            : productRecord.brands?.name_en || productRecord.brands?.name_ar || ""
        }
        brandLogoUrl={productRecord.brands?.logo_url || ""}
        categoryName={
          isArabic
            ? productRecord.categories?.name_ar || productRecord.categories?.name_en || ""
            : productRecord.categories?.name_en || productRecord.categories?.name_ar || ""
        }
        shortDescription={
          isArabic
            ? productRecord.product.short_description_ar ||
              productRecord.product.short_description_en ||
              t.detailsFallback
            : productRecord.product.short_description_en ||
              productRecord.product.short_description_ar ||
              t.detailsFallback
        }
        fullDescription={
          isArabic
            ? productRecord.product.full_description_ar ||
              productRecord.product.full_description_en ||
              t.detailsFallback
            : productRecord.product.full_description_en ||
              productRecord.product.full_description_ar ||
              t.detailsFallback
        }
        stockStatus={productRecord.product.stock_status}
        fallbackProductCode={productRecord.product.product_code}
        isArabic={isArabic}
        lang={lang}
        copy={{
          availableColors: t.availableColors,
          noColors: t.noColors,
          colorFallback: t.colorFallback,
          mainImagePlaceholder: t.mainImagePlaceholder,
          highlights: t.highlights,
          inquiry: t.inquiry,
          back: t.back,
          inStock: t.inStock,
          outOfStock: t.outOfStock,
          productCode: t.productCode,
          descriptionTitle: t.descriptionTitle,
        }}
      />

      <section className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
          {t.related}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
            <div className="rounded-[20px] bg-[#f8f6f2] p-4 md:col-span-2 xl:col-span-3">
              <p className="font-semibold text-[#1f2f4d]">{t.relatedEmptyTitle}</p>
              <p className="mt-1 text-sm text-[#5b6472]">{t.relatedEmptyBody}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}