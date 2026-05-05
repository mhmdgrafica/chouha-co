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
import { productDetailsCopy } from "../../copy/product-details-copy";
import { resolvePublicLang } from "../../copy/shared";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
};

export default async function ProductDetailsPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const lang = resolvePublicLang(resolvedSearchParams?.lang);
  const isArabic = lang === "ar";
  const t = productDetailsCopy[lang];
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
