import Link from "next/link";

const filters = ["All", "Writing", "Markers", "Office", "School", "Creative"];

const products = [
  {
    name: "V Board Whiteboard Marker",
    brand: "Pilot",
    category: "Markers",
    description: "Refillable marker with clean ink flow and professional presentation.",
    stock: "In Stock",
  },
  {
    name: "Premium Gel Pen",
    brand: "Claro",
    category: "Writing",
    description: "Smooth daily-writing pen with elegant body and refined finish.",
    stock: "In Stock",
  },
  {
    name: "Office Essentials Set",
    brand: "Chouha",
    category: "Office",
    description: "A practical selection of core office tools for daily desk use.",
    stock: "Out of Stock",
  },
  {
    name: "Fine Tip Paint Marker",
    brand: "Uni",
    category: "Markers",
    description: "Multi-surface marker ideal for labeling, art, and creative work.",
    stock: "In Stock",
  },
  {
    name: "School Writing Kit",
    brand: "Stabilo",
    category: "School",
    description: "Student-friendly stationery collection with balanced essentials.",
    stock: "In Stock",
  },
  {
    name: "Professional Fountain Pen",
    brand: "Pilot",
    category: "Writing",
    description: "Premium writing instrument designed for elegant presentation.",
    stock: "In Stock",
  },
  {
    name: "Correction & Tape Pack",
    brand: "Faber-Castell",
    category: "Office",
    description: "Reliable correction and adhesive tools for organized workspaces.",
    stock: "Out of Stock",
  },
  {
    name: "Creative Color Marker Set",
    brand: "Schneider",
    category: "Creative",
    description: "Vibrant markers for sketching, design work, and visual projects.",
    stock: "In Stock",
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-[28px] bg-[#f3efe7] p-6 md:p-8 lg:p-10">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-[#d8d1c4] bg-white px-3 py-1 text-xs font-medium tracking-wide text-[#243b6b]">
            PRODUCT CATALOG
          </span>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f2f4d] md:text-5xl">
            Explore our stationery and office product range.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5b6472]">
            Browse a modern collection of writing instruments, markers, office tools,
            and school essentials presented in a clean and professional catalog style.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[24px] border border-[#e6dfd3] bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
              Filters
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#1f2f4d]">
              Refine products
            </h2>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">Category</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className={`rounded-full px-4 py-2 text-sm transition ${
                      filter === "All"
                        ? "bg-[#243b6b] text-white"
                        : "bg-[#f8f6f2] text-[#4f5968] hover:bg-[#eef3f8]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">Brand</p>
              <div className="space-y-2 text-sm text-[#5b6472]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Pilot</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Claro</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Uni</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span>Stabilo</span>
                </label>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-[#1f2f4d]">Availability</p>
              <div className="space-y-2 text-sm text-[#5b6472]">
                <label className="flex items-center gap-2">
                  <input type="radio" name="stock" />
                  <span>All</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="stock" />
                  <span>In Stock</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="stock" />
                  <span>Out of Stock</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-[24px] border border-[#e6dfd3] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-[#7b8796]">Showing 8 products</p>
              <h2 className="mt-1 text-2xl font-semibold text-[#1f2f4d]">
                All products
              </h2>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-xl border border-[#dcd6ca] bg-[#fbfaf7] px-4 py-3 text-sm outline-none placeholder:text-[#9aa3af] md:w-64"
              />
              <button className="rounded-xl bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90">
                Search
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <article
                key={product.name}
                className="overflow-hidden rounded-[24px] border border-[#e6dfd3] bg-white shadow-sm transition hover:-translate-y-0.5"
              >
                <div
                  className={`h-56 ${
                    index % 2 === 0
                      ? "bg-[linear-gradient(135deg,#ede6db_0%,#dce7f1_100%)]"
                      : "bg-[linear-gradient(135deg,#f4efe7_0%,#d6e1ec_100%)]"
                  }`}
                />

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]">
                      {product.brand}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.stock === "In Stock"
                          ? "bg-[#edf4ea] text-[#4f6b52]"
                          : "bg-[#f4ecea] text-[#8a5a52]"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold leading-snug text-[#1f2f4d]">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-[#7b8796]">
                    {product.category}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[#5b6472]">
                    {product.description}
                  </p>

                  <Link
                    href="/products/sample-product"
                    className="mt-5 inline-flex rounded-xl border border-[#d7dfe8] bg-[#f8fbff] px-4 py-2.5 text-sm font-medium text-[#243b6b] transition hover:bg-[#eef3f8]"
                  >
                    View Product
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button className="rounded-xl border border-[#d8d1c4] bg-white px-5 py-3 text-sm font-medium text-[#243b6b] transition hover:bg-[#f8f6f2]">
              Load More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}