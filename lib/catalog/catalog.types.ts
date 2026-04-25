export type CatalogTable = "brands" | "categories";

export type CatalogItem = {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  created_at?: string;
};
