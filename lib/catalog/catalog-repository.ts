import type { SupabaseClient } from "@supabase/supabase-js";
import type { CatalogItem, CatalogTable } from "./catalog.types";

type CatalogDatabaseClient = SupabaseClient;

type CreateCatalogItemInput = {
  table: CatalogTable;
  nameEn: string;
  nameAr: string;
  logoUrl?: string | null;
};

type UpdateCatalogItemInput = CreateCatalogItemInput & {
  id: string;
};

function normalizeSlugPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildCatalogSlug(nameEn: string) {
  return normalizeSlugPart(nameEn) || `item-${Date.now()}`;
}

export async function listCatalogItems(
  supabase: CatalogDatabaseClient,
  table: CatalogTable
): Promise<CatalogItem[]> {
  const { data, error } = await supabase
    .from(table)
    .select("id, name_en, name_ar, slug, logo_url, created_at")
    .order("name_en", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as CatalogItem[];
}

export async function createCatalogItem(
  supabase: CatalogDatabaseClient,
  input: CreateCatalogItemInput
): Promise<CatalogItem> {
  const nameEn = input.nameEn.trim();
  const nameAr = input.nameAr.trim();

  if (!nameEn || !nameAr) {
    throw new Error("English and Arabic names are required.");
  }

  const slug = buildCatalogSlug(nameEn);
  const { data, error } = await supabase
    .from(input.table)
    .insert({
      name_en: nameEn,
      name_ar: nameAr,
      slug,
      ...(input.table === "brands" ? { logo_url: input.logoUrl ?? null } : {}),
    })
    .select("id, name_en, name_ar, slug, logo_url, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("An item with the same English name already exists.");
    }

    throw error;
  }

  return data as CatalogItem;
}

export async function updateCatalogItem(
  supabase: CatalogDatabaseClient,
  input: UpdateCatalogItemInput
): Promise<CatalogItem> {
  const nameEn = input.nameEn.trim();
  const nameAr = input.nameAr.trim();

  if (!nameEn || !nameAr) {
    throw new Error("English and Arabic names are required.");
  }

  const slug = buildCatalogSlug(nameEn);
  const { data, error } = await supabase
    .from(input.table)
    .update({
      name_en: nameEn,
      name_ar: nameAr,
      slug,
      ...(input.table === "brands" ? { logo_url: input.logoUrl ?? null } : {}),
    })
    .eq("id", input.id)
    .select("id, name_en, name_ar, slug, logo_url, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("An item with the same English name already exists.");
    }

    throw error;
  }

  return data as CatalogItem;
}

export async function deleteCatalogItem(
  supabase: CatalogDatabaseClient,
  table: CatalogTable,
  id: string
) {
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function countCatalogItems(
  supabase: CatalogDatabaseClient,
  table: CatalogTable
): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });

  if (error) {
    throw error;
  }

  return count ?? 0;
}
