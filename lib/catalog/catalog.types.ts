export type CatalogTable = "brands" | "categories";

export type CatalogItem = {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  logo_url?: string | null;
  created_at?: string;
};
