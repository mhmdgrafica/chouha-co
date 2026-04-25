import { createAdminClient } from "../../../../lib/supabase-server";
import { listCatalogItems } from "../../../../lib/catalog/catalog-repository";
import type { CatalogItem } from "../../../../lib/catalog/catalog.types";
import { CatalogItemForm } from "../catalog-item-form";

export default async function AdminBrandsPage() {
  let brands: CatalogItem[] = [];
  let loadError: string | null = null;

  try {
    const supabase = await createAdminClient();
    brands = await listCatalogItems(supabase, "brands");
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load brands right now.";
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-500">Catalog / Brands</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Brands
        </h2>
        <p className="text-sm text-slate-600">
          Manage bilingual brand names used across the admin and product form.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <CatalogItemForm
          endpoint="/api/admin/brands"
          title="Add Brand"
          description="Create a new brand in English and Arabic."
          submitLabel="Add Brand"
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {loadError && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {loadError}
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Brand List</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {brands.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    English
                  </th>
                  <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Arabic
                  </th>
                  <th className="border-b border-slate-200 px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Slug
                  </th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr key={brand.id}>
                    <td className="border-b border-slate-100 px-4 py-4 text-sm font-medium text-slate-900">
                      {brand.name_en}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                      {brand.name_ar}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-500">
                      {brand.slug}
                    </td>
                  </tr>
                ))}

                {brands.length === 0 && !loadError && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      No brands found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
