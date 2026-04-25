import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ProductColorRow,
  ProductFeatureRow,
  ProductHighlightRow,
  ProductMediaRow,
  ProductRecord,
  ProductRow,
} from "./product.types";

type ProductDatabaseClient = SupabaseClient;

type SaveProductRecordInput = {
  productId?: string | null;
  record: ProductRecord;
};

type SaveProductRecordResult = {
  id: string;
  slug: string;
};

export type AdminProductListItem = {
  id: string;
  product_name_en: string;
  product_name_ar: string;
  product_code: string;
  category: string;
  brand: string;
  status: "draft" | "published";
  slug: string;
};

export type PublicProductListItem = {
  id: string;
  slug: string;
  product_name_en: string;
  product_name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  category: string;
  brand: string;
  status: "draft" | "published";
};

function withProductId<T extends { product_id?: string }>(
  rows: T[],
  productId: string
): T[] {
  return rows.map((row) => ({
    ...row,
    product_id: productId,
  }));
}

async function upsertProductRow(
  supabase: ProductDatabaseClient,
  row: ProductRow,
  productId?: string | null
) {
  if (productId) {
    const { data, error } = await supabase
      .from("products")
      .update(row)
      .eq("id", productId)
      .select("id, slug")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const { data, error } = await supabase
    .from("products")
    .insert(row)
    .select("id, slug")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function replaceChildRows<T extends { product_id?: string }>(
  supabase: ProductDatabaseClient,
  table: "product_highlights" | "product_features" | "product_colors" | "product_media",
  productId: string,
  rows: T[]
) {
  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .eq("product_id", productId);

  if (deleteError) {
    throw deleteError;
  }

  if (rows.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from(table)
    .insert(withProductId(rows, productId));

  if (insertError) {
    throw insertError;
  }
}

export async function saveProductRecord(
  supabase: ProductDatabaseClient,
  input: SaveProductRecordInput
): Promise<SaveProductRecordResult> {
  const savedProduct = await upsertProductRow(
    supabase,
    input.record.product,
    input.productId
  );

  const productId = savedProduct.id;

  await replaceChildRows<ProductHighlightRow>(
    supabase,
    "product_highlights",
    productId,
    input.record.highlights
  );
  await replaceChildRows<ProductFeatureRow>(
    supabase,
    "product_features",
    productId,
    input.record.features
  );
  await replaceChildRows<ProductColorRow>(
    supabase,
    "product_colors",
    productId,
    input.record.colors
  );
  await replaceChildRows<ProductMediaRow>(
    supabase,
    "product_media",
    productId,
    input.record.media
  );

  return {
    id: savedProduct.id,
    slug: savedProduct.slug,
  };
}

export async function listAdminProducts(
  supabase: ProductDatabaseClient
): Promise<AdminProductListItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, product_name_en, product_name_ar, product_code, category, brand, status"
    );

  if (error) {
    throw error;
  }

  return (data ?? []) as AdminProductListItem[];
}

export async function listPublishedProducts(
  supabase: ProductDatabaseClient
): Promise<PublicProductListItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, product_name_en, product_name_ar, short_description_en, short_description_ar, category, brand, status"
    )
    .eq("status", "published")
    .order("product_name_en", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as PublicProductListItem[];
}

export async function getProductRecordById(
  supabase: ProductDatabaseClient,
  productId: string
): Promise<ProductRecord | null> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, slug, product_name_en, product_name_ar, product_code, brand, category, short_description_en, short_description_ar, full_description_en, full_description_ar, status"
    )
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    throw productError;
  }

  if (!product) {
    return null;
  }

  const [
    { data: highlights, error: highlightsError },
    { data: features, error: featuresError },
    { data: colors, error: colorsError },
    { data: media, error: mediaError },
  ] = await Promise.all([
    supabase
      .from("product_highlights")
      .select("id, product_id, sort_order, text_en, text_ar")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_features")
      .select("id, product_id, sort_order, feature_key, icon, selected")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_colors")
      .select(
        "id, product_id, sort_order, name_en, name_ar, hex, product_code, thumbnail_preview, main_image_preview"
      )
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
    supabase
      .from("product_media")
      .select("id, product_id, sort_order, media_type, file_kind, name, preview")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true }),
  ]);

  if (highlightsError) {
    throw highlightsError;
  }

  if (featuresError) {
    throw featuresError;
  }

  if (colorsError) {
    throw colorsError;
  }

  if (mediaError) {
    throw mediaError;
  }

  return {
    product: product as ProductRow,
    highlights: (highlights ?? []) as ProductHighlightRow[],
    features: (features ?? []) as ProductFeatureRow[],
    colors: (colors ?? []) as ProductColorRow[],
    media: (media ?? []) as ProductMediaRow[],
  };
}

export async function getPublishedProductRecordBySlug(
  supabase: ProductDatabaseClient,
  slug: string
): Promise<ProductRecord | null> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, slug, product_name_en, product_name_ar, product_code, brand, category, short_description_en, short_description_ar, full_description_en, full_description_ar, status"
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (productError) {
    throw productError;
  }

  if (!product) {
    return null;
  }

  return getProductRecordById(supabase, product.id);
}
