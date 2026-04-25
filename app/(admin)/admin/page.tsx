import Link from "next/link";
import { createAdminClient } from "../../../lib/supabase-server";
import { countCatalogItems } from "../../../lib/catalog/catalog-repository";
import { countProducts } from "../../../lib/products/product-repository";

export default async function AdminDashboardPage() {
  let cards = [
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
  let loadError: string | null = null;

  try {
    const supabase = await createAdminClient();
    const [productsCount, brandsCount, categoriesCount, publishedCount] =
      await Promise.all([
        countProducts(supabase),
        countCatalogItems(supabase, "brands"),
        countCatalogItems(supabase, "categories"),
        countProducts(supabase, "published"),
      ]);

    cards = [
      {
        title: "Products",
        value: String(productsCount),
        description: "All products in your catalog",
      },
      {
        title: "Brands",
        value: String(brandsCount),
        description: "Available brands",
      },
      {
        title: "Categories",
        value: String(categoriesCount),
        description: "Available categories",
      },
      {
        title: "Published",
        value: String(publishedCount),
        description: "Live products on the website",
      },
    ];
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load dashboard data right now.";
  }

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

      {loadError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {loadError}
        </div>
      )}

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
        <h3 className="text-xl font-semibold text-slate-900">Quick Actions</h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Keep your product form accurate by managing brands and categories here
          before adding new catalog items.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Add Product
          </Link>
          <Link
            href="/admin/brands"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Manage Brands
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Manage Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
