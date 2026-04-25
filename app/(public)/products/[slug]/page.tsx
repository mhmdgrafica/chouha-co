import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "../../../../lib/supabase-server";
import { mapProductRecordToForm } from "../../../../lib/products/product-mappers";
import {
  getPublishedProductRecordBySlug,
  listPublishedProducts,
} from "../../../../lib/products/product-repository";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const productRecord = await getPublishedProductRecordBySlug(supabase, slug);

  if (!productRecord) {
    notFound();
  }

  const form = mapProductRecordToForm(productRecord);
  const relatedProducts = (await listPublishedProducts(supabase))
    .filter((item) => item.slug !== slug)
    .filter((item) => item.category === productRecord.product.category)
    .slice(0, 3);
  const highlights = form.highlights.filter(
    (item) => item.textEn.trim() !== "" || item.textAr.trim() !== ""
  );
  const features = form.featureIcons.filter((item) => item.selected);
  const galleryItems =
    form.galleryImages.length > 0
      ? form.galleryImages
      : [
          { id: "placeholder-1", name: "Gallery 1", type: "image" as const, preview: "" },
          { id: "placeholder-2", name: "Gallery 2", type: "image" as const, preview: "" },
          { id: "placeholder-3", name: "Gallery 3", type: "image" as const, preview: "" },
          { id: "placeholder-4", name: "Gallery 4", type: "image" as const, preview: "" },
        ];

  return (
    <div className="space-y-10">
      <div className="text-sm text-[#7b8796]">
        <Link href="/" className="hover:text-[#1f2f4d]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-[#1f2f4d]">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#1f2f4d]">
          {productRecord.product.product_name_en || productRecord.product.product_name_ar}
        </span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-[#e6dfd3] bg-white shadow-sm">
            <div className="flex h-[420px] items-center justify-center bg-[linear-gradient(135deg,#eee7dc_0%,#dbe6f2_100%)] px-6 text-center">
              <div>
                <p className="text-lg font-semibold text-[#1f2f4d]">
                  {form.mainCardImage?.name ||
                    productRecord.product.product_name_en ||
                    "Product image"}
                </p>
                <p className="mt-2 text-sm text-[#6a7483]">
                  Main product image placeholder
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {galleryItems.slice(0, 4).map((item, index) => (
              <div
                key={item.id}
                className="flex h-24 items-center justify-center rounded-[18px] border border-[#e6dfd3] bg-[linear-gradient(135deg,#f2ede5_0%,#dde7f1_100%)] px-3 text-center text-xs font-medium text-[#5b6472]"
              >
                {item.name || `Gallery ${index + 1}`}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]">
              {productRecord.product.brand}
            </span>
            <span className="rounded-full bg-[#f4f0e7] px-3 py-1 text-xs font-medium text-[#6a7483]">
              {productRecord.product.category}
            </span>
            <span className="rounded-full bg-[#edf4ea] px-3 py-1 text-xs font-medium text-[#4f6b52]">
              Published
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d]">
            {productRecord.product.product_name_en || productRecord.product.product_name_ar}
          </h1>

          <p className="mt-4 text-base leading-7 text-[#5b6472]">
            {productRecord.product.short_description_en ||
              productRecord.product.short_description_ar ||
              "Product short description will appear here."}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">Ink Color</p>
              <div className="flex flex-wrap gap-2">
                {form.colors.map((color, index) => (
                  <button
                    key={color.id}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      index === 0
                        ? "bg-[#243b6b] text-white"
                        : "border border-[#d8d1c4] bg-[#fbfaf7] text-[#4f5968] hover:bg-[#eef3f8]"
                    }`}
                  >
                    {color.nameEn || color.nameAr || "Colour"}
                  </button>
                ))}
              </div>
            </div>

            {highlights.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">
                  Product Highlights
                </p>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full border border-[#d8d1c4] bg-[#fbfaf7] px-4 py-2 text-sm text-[#4f5968]"
                    >
                      {item.textEn || item.textAr}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/contact"
              className="rounded-xl bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Send Inquiry
            </a>

            <a
              href="/products"
              className="rounded-xl border border-[#d8d1c4] bg-white px-5 py-3 text-sm font-medium text-[#243b6b] transition hover:bg-[#f8f6f2]"
            >
              Back to Products
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {features.length > 0 ? (
              features.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-[18px] bg-[#f8f6f2] p-4">
                  <p className="text-sm font-semibold text-[#1f2f4d]">{item.key}</p>
                  <p className="mt-1 text-xs leading-6 text-[#6a7483]">
                    {item.icon}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[18px] bg-[#f8f6f2] p-4 sm:col-span-3">
                <p className="text-sm font-semibold text-[#1f2f4d]">
                  Product information
                </p>
                <p className="mt-1 text-xs leading-6 text-[#6a7483]">
                  Additional features will appear here when available.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
            Product Details
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-[#1f2f4d]">
            Description & specifications
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-7 text-[#5b6472]">
            <p>
              {productRecord.product.full_description_en ||
                productRecord.product.full_description_ar ||
                "Full product description will appear here once it is added from the admin panel."}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">Brand</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {productRecord.product.brand}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">Category</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {productRecord.product.category}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">Available Colors</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {form.colors.length > 0
                  ? form.colors
                      .map((item) => item.nameEn || item.nameAr)
                      .filter(Boolean)
                      .join(", ")
                  : "No colors added yet."}
              </p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">Product Code</p>
              <p className="mt-2 text-sm text-[#5b6472]">
                {productRecord.product.product_code}
              </p>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
            Related Products
          </p>

          <div className="mt-5 space-y-4">
            {relatedProducts.length > 0 ? (
              relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.slug}`}
                  className="block rounded-[20px] bg-[#f8f6f2] p-4 transition hover:bg-[#eef3f8]"
                >
                  <p className="font-semibold text-[#1f2f4d]">
                    {item.product_name_en || item.product_name_ar}
                  </p>
                  <p className="mt-1 text-sm text-[#5b6472]">
                    {item.short_description_en ||
                      item.short_description_ar ||
                      item.category}
                  </p>
                </Link>
              ))
            ) : (
              <div className="rounded-[20px] bg-[#f8f6f2] p-4">
                <p className="font-semibold text-[#1f2f4d]">
                  More products coming soon
                </p>
                <p className="mt-1 text-sm text-[#5b6472]">
                  Related published products will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
