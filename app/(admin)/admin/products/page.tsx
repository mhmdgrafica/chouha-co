import Link from "next/link";
import { createClient } from "../../../../lib/supabase-server";
import { listAdminProducts } from "../../../../lib/products/product-repository";

function getPublishStatusLabel(status: "draft" | "published") {
  return status === "published" ? "Published" : "Draft";
}

function getStockStatusLabel(status: "in_stock" | "out_of_stock") {
  return status === "in_stock" ? "In Stock" : "Out of Stock";
}

export default async function AdminProductsPage() {
  let products: Awaited<ReturnType<typeof listAdminProducts>> = [];
  let loadError: string | null = null;

  try {
    const supabase = await createClient();
    products = await listAdminProducts(supabase);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load products right now.";
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Products
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage all products and create new ones.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        {loadError && (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 md:max-w-sm"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              All
            </button>
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Published
            </button>
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Draft
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Product
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Code
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Category
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Brand
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Visibility
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Stock
                </th>
                <th className="border-b border-slate-200 px-4 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border-b border-slate-100 px-4 py-4">
                    <div className="flex items-center gap-4">
                      {product.brand_logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.brand_logo_url}
                          alt={product.brand_name_en || product.name_en}
                          className="h-14 w-14 rounded-2xl border border-slate-200 bg-white object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f5ef] text-xs font-semibold text-slate-400">
                          IMG
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">
                          {product.name_en || product.name_ar}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                    {product.product_code}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                    {product.category_name_en || product.category_name_ar || "—"}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                    {product.brand_name_en || product.brand_name_ar || "—"}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        product.publishStatus === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {getPublishStatusLabel(product.publishStatus)}
                    </span>
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        product.stock_status === "in_stock"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {getStockStatusLabel(product.stock_status)}
                    </span>
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="inline-flex rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-slate-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
