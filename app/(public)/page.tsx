import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowRight,
  BadgeHelp,
  BriefcaseBusiness,
  FolderKanban,
  MessageSquareMore,
  PhoneCall,
} from "lucide-react";
import { listCatalogItems } from "../../lib/catalog/catalog-repository";
import { listPublishedProducts } from "../../lib/products/product-repository";
import { createClient } from "../../lib/supabase-server";
import { HomeBrandsCarousel } from "./home-brands-carousel";
import { HomeProductsCarousel } from "./home-products-carousel";
import { homePageCopy } from "./copy/home-copy";
import { PUBLIC_LANGUAGE_COOKIE, resolvePublicLang } from "./copy/shared";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = resolvePublicLang(cookieStore.get(PUBLIC_LANGUAGE_COOKIE)?.value);
  const isArabic = lang === "ar";
  const t = homePageCopy[lang];

  let products: Awaited<ReturnType<typeof listPublishedProducts>> = [];
  let brands: Awaited<ReturnType<typeof listCatalogItems>> = [];
  let categories: Awaited<ReturnType<typeof listCatalogItems>> = [];
  let loadError: string | null = null;

  try {
    const supabase = await createClient();
    [products, brands, categories] = await Promise.all([
      listPublishedProducts(supabase),
      listCatalogItems(supabase, "brands"),
      listCatalogItems(supabase, "categories"),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : t.loadErrorFallback;
  }

  const featuredCategories = categories
    .map((category) => {
      const count = products.filter((product) => product.category_slug === category.slug).length;

      return {
        ...category,
        count,
      };
    })
    .filter((category) => category.count > 0)
    .slice(0, 4);

  const supportCards = [
    {
      title: t.inquiryTitle,
      text: t.inquiryText,
      href: "/products",
      icon: <MessageSquareMore className="h-5 w-5" />,
    },
    {
      title: t.brandSupportTitle,
      text: t.brandSupportText,
      href: "/products",
      icon: <BadgeHelp className="h-5 w-5" />,
    },
    {
      title: t.contactCardTitle,
      text: t.contactCardText,
      href: "/contact",
      icon: <PhoneCall className="h-5 w-5" />,
    },
    {
      title: t.corporateTitle,
      text: t.corporateText,
      href: "/contact",
      icon: <BriefcaseBusiness className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-10 md:space-y-14">
      <section className="grid gap-6 overflow-hidden rounded-[30px] bg-[#f2ede3] p-5 md:grid-cols-[1.05fr_0.95fr] md:p-8 lg:p-10">
        <div className={`flex flex-col justify-center ${isArabic ? "text-right" : ""}`}>
          <span className="inline-flex w-fit rounded-full border border-[#d8d1c4] bg-white px-3 py-1 text-xs font-medium tracking-[0.16em] text-[#243b6b]">
            {t.heroBadge}
          </span>

          <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight text-[#1f2f4d] md:text-5xl">
            {t.heroTitle}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-[#566274]">
            {t.heroBody}
          </p>

          <div className={`mt-8 flex flex-wrap gap-3 ${isArabic ? "justify-end" : ""}`}>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(36,59,107,0.2)]"
            >
              {t.exploreProducts}
              <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-[#cfd6df] bg-white px-5 py-3 text-sm font-medium text-[#243b6b] transition hover:border-[#243b6b]/35 hover:bg-[#f7f9fc]"
            >
              {t.contactUs}
            </Link>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#f8f5ef_0%,#e5ebf3_55%,#d7e1ee_100%)] p-6 md:min-h-[440px]">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(31,47,77,0.12)_100%)]" />
          <div className="absolute left-8 top-8 h-28 w-28 rounded-full bg-white/45 blur-2xl" />
          <div className="absolute right-10 top-12 h-24 w-24 rounded-[28px] bg-[#d5dfec]/70" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[22px] bg-white/82 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#7b8796]">
                  {t.totalProducts}
                </p>
                <p className="mt-3 text-3xl font-semibold text-[#1f2f4d]">{products.length}</p>
              </div>
              <div className="rounded-[22px] bg-white/72 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#7b8796]">
                  {t.totalBrands}
                </p>
                <p className="mt-3 text-3xl font-semibold text-[#1f2f4d]">{brands.length}</p>
              </div>
              <div className="rounded-[22px] bg-white/72 p-4 shadow-sm backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#7b8796]">
                  {t.totalCategories}
                </p>
                <p className="mt-3 text-3xl font-semibold text-[#1f2f4d]">{categories.length}</p>
              </div>
            </div>

            <div className="relative mt-6 rounded-[28px] bg-[#1f2f4d] p-6 text-white shadow-[0_24px_60px_rgba(31,47,77,0.18)]">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                Chouha Catalog
              </p>
              <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight">
                {t.productsTitle}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-white/78">
                {products.length > 0
                  ? `${products.length} ${t.productCountSuffix}`
                  : t.noProducts}
              </p>
            </div>
          </div>
        </div>
      </section>

      {loadError && (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {loadError}
        </div>
      )}

      {featuredCategories.length > 0 && (
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className={isArabic ? "sm:text-right" : ""}>
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
                {t.familiesBadge}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#1f2f4d]">{t.familiesTitle}</h2>
            </div>

            <Link href="/products" className="text-sm font-medium text-[#243b6b] hover:underline">
              {t.familiesAction}
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group rounded-[24px] border border-[#e6dfd3] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(31,47,77,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3f8] text-[#243b6b] transition group-hover:bg-[#243b6b] group-hover:text-white">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[#f8f6f2] px-3 py-1 text-xs font-medium text-[#7b8796]">
                    {category.count}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[#1f2f4d]">
                  {isArabic ? category.name_ar : category.name_en}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5b6472]">
                  {category.count} {t.productCountSuffix}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 ? (
        <HomeProductsCarousel
          products={products.slice(0, 10)}
          isArabic={isArabic}
          copy={{
            title: t.productsTitle,
            action: t.productsAction,
            viewProduct: t.viewProduct,
            inStock: t.inStock,
            outOfStock: t.outOfStock,
            fallbackDescription: t.fallbackDescription,
          }}
        />
      ) : (
        <div className="rounded-[28px] border border-[#e6dfd3] bg-white px-6 py-12 text-center text-sm text-[#6a7483] shadow-sm">
          {t.noProducts}
        </div>
      )}

      {brands.length > 0 ? (
        <HomeBrandsCarousel
          brands={brands}
          isArabic={isArabic}
          copy={{
            title: t.brandTitle,
            action: t.brandAction,
            fallbackPrefix: t.brandFallbackPrefix,
          }}
        />
      ) : (
        <div className="rounded-[28px] border border-[#e6dfd3] bg-white px-6 py-12 text-center text-sm text-[#6a7483] shadow-sm">
          {t.noBrands}
        </div>
      )}

      <section className="grid gap-6 rounded-[30px] bg-[#dde7df] p-6 md:grid-cols-[0.94fr_1.06fr] md:p-8">
        <div className={`flex flex-col justify-center ${isArabic ? "text-right" : ""}`}>
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
              {t.contactBadge}
            </p>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
              {t.supportBadge}
            </p>
          </div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#1f2f4d]">
            {t.contactTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5b6472]">
            {t.contactBody}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex w-fit rounded-full bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(36,59,107,0.2)]"
          >
            {t.contactAction}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {supportCards.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[24px] border border-white/50 bg-white/80 p-5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(31,47,77,0.12)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3f8] text-[#243b6b] transition group-hover:bg-[#243b6b] group-hover:text-white">
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[#1f2f4d]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5b6472]">{item.text}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#243b6b]">
                {t.supportAction}
                <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
