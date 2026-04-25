import Link from "next/link";

const products = [
  {
    id: "1",
    name: "V Board Master Whiteboard Marker",
    productCode: "660103",
    category: "Markers",
    brand: "Pilot",
    status: "Published",
  },
  {
    id: "2",
    name: "Sample Product",
    productCode: "220045",
    category: "Pens",
    brand: "Chouha",
    status: "Draft",
  },
];

export default function AdminProductsPage() {
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
                  Status
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
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f5ef] text-xs font-semibold text-slate-400">
                        IMG
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Product item
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                    {product.productCode}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                    {product.category}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                    {product.brand}
                  </td>

                  <td className="border-b border-slate-100 px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        product.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {product.status}
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
                    colSpan={6}
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