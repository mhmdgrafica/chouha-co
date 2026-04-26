import { createAdminClient } from "../../../../lib/supabase-server";
import { listCatalogItems } from "../../../../lib/catalog/catalog-repository";
import type { CatalogItem } from "../../../../lib/catalog/catalog.types";
import { CatalogItemManager } from "../catalog-item-manager";

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

      <CatalogItemManager
        table="brands"
        items={brands}
        loadError={loadError}
      />
    </section>
  );
}
