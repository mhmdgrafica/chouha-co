import { createAdminClient } from "../../../../lib/supabase-server";
import { listCatalogItems } from "../../../../lib/catalog/catalog-repository";
import type { CatalogItem } from "../../../../lib/catalog/catalog.types";
import { CatalogItemManager } from "../catalog-item-manager";

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

      <CatalogItemManager
        table="categories"
        items={categories}
        loadError={loadError}
      />
    </section>
  );
}
