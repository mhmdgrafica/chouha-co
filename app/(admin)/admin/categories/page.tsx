import { createAdminClient } from "../../../../lib/supabase-server";
import { listCatalogItems } from "../../../../lib/catalog/catalog-repository";
import type { CatalogItem } from "../../../../lib/catalog/catalog.types";
import { CatalogItemForm } from "../catalog-item-form";

export default async function AdminCategoriesPage() {
  let categories: CatalogItem[] = [];
  let loadError: string | null = null;

  try {
    const supabase = await createAdminClient();
    categories = await listCatalogItems(supabase, "categories");
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load categories right now.";
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-500">
          Catalog / Categories
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Categories
        </h2>
        <p className="text-sm text-slate-600">
          Manage bilingual category names used in product organization.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <CatalogItemForm
          endpoint="/api/admin/categories"
          title="Add Category"
          description="Create a new category in English and Arabic."
          submitLabel="Add Category"
        />

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          {loadError && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {loadError}
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Category List
            </h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {categories.length} items
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
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="border-b border-slate-100 px-4 py-4 text-sm font-medium text-slate-900">
                      {category.name_en}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-700">
                      {category.name_ar}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-4 text-sm text-slate-500">
                      {category.slug}
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && !loadError && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      No categories found yet.
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
