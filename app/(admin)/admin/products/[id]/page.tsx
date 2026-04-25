import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductFormShell } from "../new/product-form-shell";
import { createClient } from "../../../../../lib/supabase-server";
import { mapProductRecordToForm } from "../../../../../lib/products/product-mappers";
import { getProductRecordById } from "../../../../../lib/products/product-repository";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const productRecord = await getProductRecordById(supabase, id);

  if (!productRecord) {
    notFound();
  }

  const form = mapProductRecordToForm(productRecord);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-500">
          <Link href="/admin/products" className="transition hover:text-slate-700">
            Products
          </Link>{" "}
          / Edit
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Edit Product
        </h2>
        <p className="text-sm text-slate-600">
          Update the saved product details and keep the website preview in sync.
        </p>
      </div>

      <ProductFormShell initialForm={form} initialProductId={id} />
    </section>
  );
}
