import { FeatureDefinitionsManager } from "../feature-definitions-manager";
import { listFeatureDefinitions } from "../../../../lib/features/feature-definitions-repository";
import { createAdminClient } from "../../../../lib/supabase-server";
import type { ProductFeatureDefinition } from "../../../../lib/products/product.types";

export default async function AdminOptionsPage() {
  let items: ProductFeatureDefinition[] = [];
  let loadError: string | null = null;

  try {
    const supabase = await createAdminClient();
    items = await listFeatureDefinitions(supabase);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Unable to load feature icons right now.";
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-500">Catalog / Feature Icons</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Feature Icons
        </h2>
        <p className="text-sm text-slate-600">
          Manage the icon definitions used when selecting product features.
        </p>
      </div>

      <FeatureDefinitionsManager items={items} loadError={loadError} />
    </section>
  );
}
