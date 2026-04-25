import Link from "next/link";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const mockProduct = {
  name: "V Board Whiteboard Marker",
  brand: "Pilot",
  category: "Markers",
  description:
    "A refined whiteboard marker designed for smooth writing, clean visibility, and reliable daily performance. This layout is a dynamic product template that will later read real data from Supabase.",
  stock: "In Stock",
  colors: ["Black", "Blue", "Red", "Green"],
  tipSizes: ["Fine", "Medium", "Chisel"],
};

export default async function ProductDetailsPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

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
        <span className="text-[#1f2f4d]">{slug}</span>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-[#e6dfd3] bg-white shadow-sm">
            <div className="h-[420px] bg-[linear-gradient(135deg,#eee7dc_0%,#dbe6f2_100%)]" />
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="h-24 rounded-[18px] border border-[#e6dfd3] bg-[linear-gradient(135deg,#f2ede5_0%,#dde7f1_100%)]" />
            <div className="h-24 rounded-[18px] border border-[#e6dfd3] bg-[linear-gradient(135deg,#f5f1e9_0%,#e2ebf5_100%)]" />
            <div className="h-24 rounded-[18px] border border-[#e6dfd3] bg-[linear-gradient(135deg,#f0eadf_0%,#dbe4ef_100%)]" />
            <div className="h-24 rounded-[18px] border border-[#e6dfd3] bg-[linear-gradient(135deg,#f7f3ec_0%,#d7e1ec_100%)]" />
          </div>
        </div>

        <div className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]">
              {mockProduct.brand}
            </span>
            <span className="rounded-full bg-[#f4f0e7] px-3 py-1 text-xs font-medium text-[#6a7483]">
              {mockProduct.category}
            </span>
            <span className="rounded-full bg-[#edf4ea] px-3 py-1 text-xs font-medium text-[#4f6b52]">
              {mockProduct.stock}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d]">
            {mockProduct.name}
          </h1>

          <p className="mt-4 text-base leading-7 text-[#5b6472]">
            {mockProduct.description}
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">Ink Color</p>
              <div className="flex flex-wrap gap-2">
                {mockProduct.colors.map((color, index) => (
                  <button
                    key={color}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      index === 0
                        ? "bg-[#243b6b] text-white"
                        : "border border-[#d8d1c4] bg-[#fbfaf7] text-[#4f5968] hover:bg-[#eef3f8]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">Tip Size</p>
              <div className="flex flex-wrap gap-2">
                {mockProduct.tipSizes.map((size, index) => (
                  <button
                    key={size}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      index === 0
                        ? "bg-[#243b6b] text-white"
                        : "border border-[#d8d1c4] bg-[#fbfaf7] text-[#4f5968] hover:bg-[#eef3f8]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
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
            <div className="rounded-[18px] bg-[#f8f6f2] p-4">
              <p className="text-sm font-semibold text-[#1f2f4d]">Professional Finish</p>
              <p className="mt-1 text-xs leading-6 text-[#6a7483]">
                Clean and modern presentation.
              </p>
            </div>

            <div className="rounded-[18px] bg-[#f8f6f2] p-4">
              <p className="text-sm font-semibold text-[#1f2f4d]">Variant Ready</p>
              <p className="mt-1 text-xs leading-6 text-[#6a7483]">
                Supports colors and tip sizes.
              </p>
            </div>

            <div className="rounded-[18px] bg-[#f8f6f2] p-4">
              <p className="text-sm font-semibold text-[#1f2f4d]">Catalog Focused</p>
              <p className="mt-1 text-xs leading-6 text-[#6a7483]">
                Optimized for product browsing.
              </p>
            </div>
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
              This section will later contain the real product description pulled from the database,
              including usage details, materials, compatibility, and commercial presentation notes.
            </p>
            <p>
              We can also add bullet points, technical specifications, refill information, packaging
              details, and downloadable PDFs if needed.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">Brand</p>
              <p className="mt-2 text-sm text-[#5b6472]">{mockProduct.brand}</p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">Category</p>
              <p className="mt-2 text-sm text-[#5b6472]">{mockProduct.category}</p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">Available Colors</p>
              <p className="mt-2 text-sm text-[#5b6472]">{mockProduct.colors.join(", ")}</p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-5">
              <p className="text-sm font-semibold text-[#1f2f4d]">Tip Options</p>
              <p className="mt-2 text-sm text-[#5b6472]">{mockProduct.tipSizes.join(", ")}</p>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-[#e6dfd3] bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
            Related Products
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-[20px] bg-[#f8f6f2] p-4">
              <p className="font-semibold text-[#1f2f4d]">Gel Pen Collection</p>
              <p className="mt-1 text-sm text-[#5b6472]">Smooth daily writing essentials.</p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-4">
              <p className="font-semibold text-[#1f2f4d]">Office Marker Set</p>
              <p className="mt-1 text-sm text-[#5b6472]">Reliable professional marker range.</p>
            </div>

            <div className="rounded-[20px] bg-[#f8f6f2] p-4">
              <p className="font-semibold text-[#1f2f4d]">Premium Fountain Pen</p>
              <p className="mt-1 text-sm text-[#5b6472]">Refined writing presentation.</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}