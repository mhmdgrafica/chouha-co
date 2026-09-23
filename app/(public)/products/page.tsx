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
    group?: string;
    q?: string;
    stock?: "in_stock" | "out_of_stock";
    bestSeller?: string;
    sort?: "name-asc" | "name-desc" | "newest" | "best-seller" | "manual";
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
  const groupFilter = resolvedSearchParams?.group?.trim() || "";
  const searchFilter = resolvedSearchParams?.q?.trim() || "";
  const stockFilter = resolvedSearchParams?.stock || "";
  const bestSellerFilter = resolvedSearchParams?.bestSeller === "true";
  const sort = resolvedSearchParams?.sort || "manual";

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
    const matchesGroup = groupFilter ? product.group_slug === groupFilter : true;
    const normalizedSearch = searchFilter.toLocaleLowerCase();
    const matchesSearch = normalizedSearch
      ? [
          product.name_en,
          product.name_ar,
          product.product_code,
          product.brand_name_en,
          product.brand_name_ar,
        ]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase().includes(normalizedSearch))
      : true;
    const matchesStock = stockFilter ? product.stock_status === stockFilter : true;
    const matchesBestSeller = bestSellerFilter ? product.is_best_seller : true;

    return matchesBrand && matchesCategory && matchesGroup && matchesSearch && matchesStock && matchesBestSeller;
  });

  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    if (sort === "name-desc") return b.name_en.localeCompare(a.name_en);
    if (sort === "name-asc") return a.name_en.localeCompare(b.name_en);
    if (sort === "best-seller") {
      return Number(b.is_best_seller) - Number(a.is_best_seller) || a.display_order - b.display_order;
    }
    if (sort === "manual") return a.display_order - b.display_order || a.name_en.localeCompare(b.name_en);
    return Date.parse(b.created_at) - Date.parse(a.created_at);
  });

  const brandOptions = Array.from(
    new Map(
      products
        .filter((product) => product.brand_slug)
        .map((product) => [product.brand_slug, product.brand_name_en || product.brand_name_ar])
    )
  );
  const categoryOptions = Array.from(
    new Map(
      products
        .filter((product) => product.category_slug)
        .map((product) => [product.category_slug, product.category_name_en || product.category_name_ar])
    )
  );
  const groupOptions = Array.from(
    new Map(
      products
        .filter((product) => product.group_slug)
        .map((product) => [product.group_slug, product.group_name_en || product.group_name_ar])
    )
  );

  const selectedBrand = brandFilter
    ? products.find((product) => product.brand_slug === brandFilter)
    : null;

  const selectedCategory = categoryFilter
    ? products.find((product) => product.category_slug === categoryFilter)
    : null;
  const selectedGroup = groupFilter
    ? products.find((product) => product.group_slug === groupFilter)
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
    selectedGroup
      ? isArabic
        ? selectedGroup.group_name_ar || selectedGroup.group_name_en
        : selectedGroup.group_name_en || selectedGroup.group_name_ar
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
              {t.showing} {sortedProducts.length} {t.publishedProducts}
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

            <form method="get" className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <input
                name="q"
                defaultValue={searchFilter}
                placeholder={t.searchPlaceholder}
                className="rounded-2xl border border-[#e6dfd3] px-4 py-3 text-sm outline-none focus:border-[#003b51]"
              />
              <select name="brand" defaultValue={brandFilter} className="rounded-2xl border border-[#e6dfd3] bg-white px-4 py-3 text-sm outline-none focus:border-[#003b51]">
                <option value="">{t.allBrands}</option>
                {brandOptions.map(([value, label]) => <option key={value} value={value ?? ""}>{label}</option>)}
              </select>
              <select name="category" defaultValue={categoryFilter} className="rounded-2xl border border-[#e6dfd3] bg-white px-4 py-3 text-sm outline-none focus:border-[#003b51]">
                <option value="">{t.allCategories}</option>
                {categoryOptions.map(([value, label]) => <option key={value} value={value ?? ""}>{label}</option>)}
              </select>
              <select name="group" defaultValue={groupFilter} className="rounded-2xl border border-[#e6dfd3] bg-white px-4 py-3 text-sm outline-none focus:border-[#003b51]">
                <option value="">{t.allGroups}</option>
                {groupOptions.map(([value, label]) => <option key={value} value={value ?? ""}>{label}</option>)}
              </select>
              <select name="stock" defaultValue={stockFilter} className="rounded-2xl border border-[#e6dfd3] bg-white px-4 py-3 text-sm outline-none focus:border-[#003b51]">
                <option value="">{t.allAvailability}</option>
                <option value="in_stock">{t.inStock}</option>
                <option value="out_of_stock">{t.outOfStock}</option>
              </select>
              <select name="sort" defaultValue={sort} className="rounded-2xl border border-[#e6dfd3] bg-white px-4 py-3 text-sm outline-none focus:border-[#003b51]">
                <option value="manual">{t.sortManual}</option>
                <option value="name-asc">{t.sortNameAsc}</option>
                <option value="name-desc">{t.sortNameDesc}</option>
                <option value="newest">{t.sortNewest}</option>
                <option value="best-seller">{t.sortBestSeller}</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-[#4f5a69] md:col-span-2">
                <input type="checkbox" name="bestSeller" value="true" defaultChecked={bestSellerFilter} className="h-4 w-4 accent-[#003b51]" />
                {t.onlyBestSellers}
              </label>
              <button type="submit" className="rounded-2xl bg-[#003b51] px-5 py-3 text-sm font-semibold text-white hover:bg-[#00516b]">
                {t.applyFilters}
              </button>
            </form>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {sortedProducts.map((product) => {
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
                    <div className="flex min-h-7 flex-wrap items-center gap-3">
                      {product.brand_logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.brand_logo_url}
                          alt={product.brand_name_en || "Brand logo"}
                          className="h-5 max-w-[72px] object-contain"
                        />
                      ) : brandName ? (
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

                    {product.group_name_en && (
                      <p className="mt-1 text-xs font-medium text-[#9a8f80]">
                        {isArabic
                          ? product.group_name_ar || product.group_name_en
                          : product.group_name_en || product.group_name_ar}
                      </p>
                    )}

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

          {sortedProducts.length === 0 && !loadError && (
            <div className="rounded-[24px] border border-[#e6dfd3] bg-white px-6 py-12 text-center text-sm text-[#6a7483] shadow-sm">
              {t.empty}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
