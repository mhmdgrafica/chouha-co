import { listCatalogItems } from "../../../../../lib/catalog/catalog-repository";
import { listActiveFeatureIcons } from "../../../../../lib/features/feature-definitions-repository";
import { createAdminClient } from "../../../../../lib/supabase-server";
import { ProductFormShell } from "./product-form-shell";

export default async function NewProductPage() {
  let brandOptions = [];
  let categoryOptions = [];
  let featureOptions = [];

  try {
    const supabase = await createAdminClient();
    [brandOptions, categoryOptions, featureOptions] = await Promise.all([
      listCatalogItems(supabase, "brands"),
      listCatalogItems(supabase, "categories"),
      listActiveFeatureIcons(supabase),
    ]);
  } catch {}

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-500">Products / New</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Add New Product
        </h2>
        <p className="text-sm text-slate-600">
          Build the product visually and preview how it will appear on the website.
        </p>
      </div>

      <ProductFormShell
        brandOptions={brandOptions}
        categoryOptions={categoryOptions}
        featureOptions={featureOptions}
      />
    </section>
  );
}
