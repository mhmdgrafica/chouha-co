import Link from "next/link";

const featuredCategories = [
  {
    title: "Writing Instruments",
    description: "Pens, pencils, gel pens, fountain pens, and everyday writing essentials.",
  },
  {
    title: "Markers & Highlighters",
    description: "Whiteboard markers, permanent markers, paint markers, and highlighters.",
  },
  {
    title: "Office Essentials",
    description: "Staplers, tapes, clips, organizers, correction tools, and desk supplies.",
  },
  {
    title: "School & Creative",
    description: "Student supplies, colouring tools, notebooks, and creative stationery.",
  },
];

const bestSellers = [
  { title: "Gel Pen Collection", subtitle: "Smooth writing with clean finishes" },
  { title: "Office Marker Set", subtitle: "Reliable daily-use marker solutions" },
  { title: "Premium Fountain Pen", subtitle: "Refined design for elegant writing" },
  { title: "School Essentials Pack", subtitle: "A practical mix for classrooms" },
];

const brands = [
  "Pilot",
  "Claro",
  "Pikasso",
  "C3",
  "Stronger",
  "TEXTA",
];

const helpCards = [
  { title: "Product Inquiry", text: "Need help choosing the right product range?" },
  { title: "Contact Us", text: "Get in touch with our team for catalog and orders." },
  { title: "Brand Support", text: "Looking for a specific brand or collection?" },
  { title: "Corporate Orders", text: "Bulk and business supply requests made simple." },
];

export default function HomePage() {
  return (
    <div className="space-y-10 md:space-y-14">
      <section className="grid gap-6 rounded-[28px] bg-[#f3efe7] p-5 md:grid-cols-2 md:gap-8 md:p-8 lg:p-10">
        <div className="flex flex-col justify-center">
          <span className="mb-3 inline-flex w-fit rounded-full border border-[#d8d1c4] bg-white px-3 py-1 text-xs font-medium tracking-wide text-[#243b6b]">
            CHOUHA STATIONERY & OFFICE SUPPLIES
          </span>

          <h1 className="max-w-xl text-4xl font-semibold leading-tight text-[#1f2f4d] md:text-5xl">
            Smart stationery solutions for school, office, and professional use.
          </h1>

          <p className="mt-4 max-w-lg text-base leading-7 text-[#5b6472]">
            A modern catalog website for premium stationery, office tools, and branded writing
            products — designed for clear browsing, strong presentation, and smooth inquiries.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-xl bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Explore Products
            </Link>

            <Link
              href="/contact"
              className="rounded-xl border border-[#cfd6df] bg-white px-5 py-3 text-sm font-medium text-[#243b6b] transition hover:bg-[#f7f9fc]"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="min-h-[320px] overflow-hidden rounded-[24px] border border-white/60 bg-white shadow-sm md:min-h-[460px]">
          <div className="relative h-full w-full bg-[linear-gradient(135deg,#eae4d8_0%,#f8f6f2_40%,#d9e3ef_100%)]">
            <div className="absolute left-6 top-6 h-24 w-24 rounded-full bg-[#dfe8f3]" />
            <div className="absolute right-8 top-10 h-16 w-16 rounded-2xl bg-[#c9d8ea]" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(36,59,107,0.08)_100%)]" />

            <div className="absolute inset-x-8 bottom-8 rounded-[24px] bg-white/85 p-5 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#7b8796]">
                FEATURED COLLECTION
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#1f2f4d]">
                Premium writing & office presentation
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#5b6472]">
                Clean visual presentation for branded products, featured categories, and elegant
                catalog browsing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[24px] bg-[#1f2f4d] p-6 shadow-sm md:p-8">
          <div className="flex h-full min-h-[260px] flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                FEATURED STORY
              </span>
              <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight text-white">
                Present your stationery collections with a polished corporate feel.
              </h2>
            </div>

            <div className="mt-6">
              <p className="max-w-md text-sm leading-7 text-white/80">
                Highlight premium products, launch featured categories, and guide visitors toward
                inquiry or catalog browsing with a clean visual structure.
              </p>

              <Link
                href="/about"
                className="mt-5 inline-flex rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#1f2f4d] transition hover:opacity-90"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e5dfd4] bg-white p-6 shadow-sm md:p-8">
          <span className="inline-flex rounded-full bg-[#eef3f8] px-3 py-1 text-xs font-medium text-[#243b6b]">
            COMPANY FOCUS
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#1f2f4d]">
            Reliable sourcing, modern display, and strong brand presentation.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5b6472]">
            This section can later present your company strengths, supply capability, brand
            partnerships, or import/export specialization in a more refined way.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#f8f6f2] p-4">
              <p className="text-sm font-semibold text-[#1f2f4d]">Catalog-first</p>
              <p className="mt-1 text-xs leading-6 text-[#6a7483]">Built for product discovery</p>
            </div>
            <div className="rounded-2xl bg-[#f8f6f2] p-4">
              <p className="text-sm font-semibold text-[#1f2f4d]">Brand-ready</p>
              <p className="mt-1 text-xs leading-6 text-[#6a7483]">Supports categories & brands</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
              Featured Categories
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#1f2f4d]">Browse product families</h2>
          </div>

          <Link href="/products" className="text-sm font-medium text-[#243b6b] hover:underline">
            View all products
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featuredCategories.map((category) => (
            <div
              key={category.title}
              className="rounded-[22px] border border-[#e6dfd3] bg-white p-5 shadow-sm transition hover:-translate-y-0.5"
            >
              <div className="mb-4 h-36 rounded-[18px] bg-[linear-gradient(135deg,#f0ebe2_0%,#dde7f1_100%)]" />
              <h3 className="text-lg font-semibold text-[#1f2f4d]">{category.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5b6472]">{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
              Best Sellers
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#1f2f4d]">Popular product highlights</h2>
          </div>

          <Link href="/products" className="text-sm font-medium text-[#243b6b] hover:underline">
            Browse catalog
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bestSellers.map((item, index) => (
            <div
              key={item.title}
              className="overflow-hidden rounded-[22px] border border-[#e6dfd3] bg-white shadow-sm"
            >
              <div
                className={`h-48 ${
                  index % 2 === 0
                    ? "bg-[linear-gradient(135deg,#ebe5da_0%,#dce7f3_100%)]"
                    : "bg-[linear-gradient(135deg,#f3eee7_0%,#d6e0ec_100%)]"
                }`}
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-[#1f2f4d]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5b6472]">{item.subtitle}</p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex text-sm font-medium text-[#243b6b] hover:underline"
                >
                  View details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
              Featured Brands
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#1f2f4d]">
              Trusted names in stationery
            </h2>
          </div>

          <Link href="/products" className="text-sm font-medium text-[#243b6b] hover:underline">
            Explore all brands
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {brands.map((brand) => (
            <div
              key={brand}
              className="flex min-h-[88px] items-center justify-center rounded-[18px] border border-[#e6dfd3] bg-[#fbfaf7] px-4 text-center text-sm font-semibold text-[#243b6b]"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[28px] bg-[#eef1ea] p-6 md:grid-cols-2 md:p-8">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#f6f3ec_0%,#dce5dd_100%)] min-h-[280px]" />
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
            About the Company
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#1f2f4d]">
            A modern stationery company website with clear structure and strong presentation.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5b6472]">
            This block can later present your story, import/export capabilities, product range,
            partnerships, or business values — all within a refined and readable format.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex w-fit rounded-xl bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Read More
          </Link>
        </div>
      </section>

      <section className="grid gap-6 rounded-[28px] bg-[#dde7df] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
            Contact & Inquiry
          </p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-[#1f2f4d]">
            Looking for products, brands, or supply inquiries?
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#5b6472]">
            Invite customers and business partners to reach out for product details, brand requests,
            quotations, and distribution opportunities.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex w-fit rounded-xl bg-[#243b6b] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Find Us
          </Link>
        </div>

        <div className="rounded-[24px] bg-[linear-gradient(135deg,#f3eee5_0%,#ffffff_100%)] min-h-[280px]" />
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.15em] text-[#7b8796]">
            We&apos;re Here to Help
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[#1f2f4d]">Support & quick access</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {helpCards.map((item) => (
            <div
              key={item.title}
              className="rounded-[22px] border border-[#e6dfd3] bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3f8] text-lg text-[#243b6b]">
                •
              </div>
              <h3 className="text-lg font-semibold text-[#1f2f4d]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5b6472]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}