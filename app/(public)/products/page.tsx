import Link from "next/link";
import { createClient } from "../../../lib/supabase-server";
import { listPublishedProducts } from "../../../lib/products/product-repository";

export default async function ProductsPage() {
  let products: Awaited<ReturnType<typeof listPublishedProducts>> = [];
  let loadError: string | null = null;

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
    <div className="space-y-10">
      <section className="rounded-[28px] bg-[#f3efe7] p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-[#d8d1c4] bg-white px-3 py-1 text-xs font-medium tracking-wide text-[#243b6b]">
            PRODUCT CATALOG
          </span>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d] md:text-5xl">
            Explore our stationery and office product range.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5b6472]">
            Browse a modern collection of writing instruments, markers, office tools,
            and school essentials presented in a clean and professional catalog style.
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
            <div>
              <p className="text-sm text-[#7b8796]">
                Showing {products.length} published products
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1f2f4d]">
                Product catalog
              </h2>
            </div>

            <span className="inline-flex rounded-full bg-[#eef3f8] px-4 py-2 text-sm font-medium text-[#243b6b]">
              Live from catalog
            </span>
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
                      {product.brand}
                    </span>

                    <span className="rounded-full bg-[#edf4ea] px-3 py-1 text-xs font-medium text-[#4f6b52]">
                      Published
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold leading-snug text-[#1f2f4d]">
                    {product.product_name_en || product.product_name_ar}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#7b8796]">
                    {product.category}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[#5b6472]">
                    {product.short_description_en ||
                      product.short_description_ar ||
                      "Product description will appear here."}
                  </p>

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-5 inline-flex rounded-xl border border-[#d7dfe8] bg-[#f8fbff] px-4 py-2.5 text-sm font-medium text-[#243b6b] transition hover:bg-[#eef3f8]"
                  >
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {products.length === 0 && !loadError && (
            <div className="rounded-[24px] border border-[#e6dfd3] bg-white px-6 py-12 text-center text-sm text-[#6a7483] shadow-sm">
              No published products are available yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
