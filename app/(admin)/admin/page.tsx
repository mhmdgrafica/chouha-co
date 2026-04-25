const cards = [
  {
    title: "Products",
    value: "0",
    description: "All products in your catalog",
  },
  {
    title: "Brands",
    value: "0",
    description: "Available brands",
  },
  {
    title: "Categories",
    value: "0",
    description: "Available categories",
  },
  {
    title: "Published",
    value: "0",
    description: "Live products on the website",
  },
];

export default function AdminDashboardPage() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome back 👋
        </h2>
        <p className="mt-2 text-slate-600">
          Start managing your catalog from here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{card.title}</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-slate-500">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-8">
        <h3 className="text-xl font-semibold text-slate-900">
          Next step: Products
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          We will build the products list page, then the add product page with
          live preview, highlights, icons, media upload, and color options.
        </p>
      </div>
    </section>
  );
}