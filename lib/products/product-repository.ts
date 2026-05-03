import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ProductColorRow,
  ProductFeatureRow,
  ProductHighlightRow,
  ProductMediaRow,
  ProductOptionGroupRow,
  ProductOptionValueRow,
  ProductPublishStatus,
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
  name_en: string;
  name_ar: string;
  product_code: string;
  slug: string;
  publishStatus: ProductPublishStatus;
  stock_status: "in_stock" | "out_of_stock";
  brand_name_en: string | null;
  brand_name_ar: string | null;
  brand_logo_url: string | null;
  category_name_en: string | null;
  category_name_ar: string | null;
  card_image_url: string | null;
  color_thumbnail_url: string | null;
};

export type PublicProductListItem = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  short_description_en: string;
  short_description_ar: string;
  stock_status: "in_stock" | "out_of_stock";
  brand_slug: string | null;
  brand_name_en: string | null;
  brand_name_ar: string | null;
  brand_logo_url: string | null;
  category_slug: string | null;
  category_name_en: string | null;
  category_name_ar: string | null;
  card_image_url: string | null;
  color_thumbnail_url: string | null;
};

type ProductQueryRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  product_code: string;
  short_description_en: string;
  short_description_ar: string;
  stock_status: "in_stock" | "out_of_stock";
  is_active: boolean;
  brands:
    | {
        slug: string | null;
        name_en: string | null;
        name_ar: string | null;
        logo_url: string | null;
      }
    | {
        slug: string | null;
        name_en: string | null;
        name_ar: string | null;
        logo_url: string | null;
      }[]
    | null;
  categories:
    | {
        slug: string | null;
        name_en: string | null;
        name_ar: string | null;
      }
    | {
        slug: string | null;
        name_en: string | null;
        name_ar: string | null;
      }[]
    | null;
  product_colors:
    | {
        main_image_url: string | null;
        thumbnail_url: string | null;
        position: number;
        is_default: boolean;
      }[]
    | null;
};

type ProductOptionGroupDbRow = {
  id: string;
  product_id: string;
  position: number;
  name_en: string;
  name_ar: string;
  slug: string;
};

type ProductOptionValueDbRow = {
  id: string;
  option_group_id: string;
  position: number;
  value_en: string;
  value_ar: string;
  option_code: string;
  is_default: boolean;
};

function toSingleObject<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function toPublishStatus(isActive: boolean): ProductPublishStatus {
  return isActive ? "published" : "draft";
}

function sortColors<T extends { position: number; is_default: boolean }>(colors?: T[] | null) {
  return (colors ?? [])
    .slice()
    .sort((a, b) => Number(b.is_default) - Number(a.is_default) || a.position - b.position);
}

function mapAdminListItem(item: ProductQueryRow): AdminProductListItem {
  const brand = toSingleObject(item.brands);
  const category = toSingleObject(item.categories);
  const defaultColor = sortColors(item.product_colors)[0] ?? null;

  return {
    id: item.id,
    name_en: item.name_en,
    name_ar: item.name_ar,
    product_code: item.product_code,
    slug: item.slug,
    publishStatus: toPublishStatus(item.is_active),
    stock_status: item.stock_status,
    brand_name_en: brand?.name_en ?? null,
    brand_name_ar: brand?.name_ar ?? null,
    brand_logo_url: brand?.logo_url ?? null,
    category_name_en: category?.name_en ?? null,
    category_name_ar: category?.name_ar ?? null,
    card_image_url: defaultColor?.main_image_url ?? null,
    color_thumbnail_url: defaultColor?.thumbnail_url ?? null,
  };
}

function mapPublicListItem(item: ProductQueryRow): PublicProductListItem {
  const brand = toSingleObject(item.brands);
  const category = toSingleObject(item.categories);
  const defaultColor = sortColors(item.product_colors)[0] ?? null;

  return {
    id: item.id,
    slug: item.slug,
    name_en: item.name_en,
    name_ar: item.name_ar,
    short_description_en: item.short_description_en,
    short_description_ar: item.short_description_ar,
    stock_status: item.stock_status,
    brand_slug: brand?.slug ?? null,
    brand_name_en: brand?.name_en ?? null,
    brand_name_ar: brand?.name_ar ?? null,
    brand_logo_url: brand?.logo_url ?? null,
    category_slug: category?.slug ?? null,
    category_name_en: category?.name_en ?? null,
    category_name_ar: category?.name_ar ?? null,
    card_image_url: defaultColor?.main_image_url ?? null,
    color_thumbnail_url: defaultColor?.thumbnail_url ?? null,
  };
}

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

async function replaceOptionGroups(
  supabase: ProductDatabaseClient,
  productId: string,
  optionGroups: ProductOptionGroupRow[]
) {
  const { data: existingGroups, error: existingGroupsError } = await supabase
    .from("product_option_groups")
    .select("id")
    .eq("product_id", productId);

  if (existingGroupsError) {
    throw existingGroupsError;
  }

  const existingGroupIds = (existingGroups ?? []).map((item) => item.id);

  if (existingGroupIds.length > 0) {
    const { error: deleteValuesError } = await supabase
      .from("product_option_values")
      .delete()
      .in("option_group_id", existingGroupIds);

    if (deleteValuesError) {
      throw deleteValuesError;
    }
  }

  const { error: deleteGroupsError } = await supabase
    .from("product_option_groups")
    .delete()
    .eq("product_id", productId);

  if (deleteGroupsError) {
    throw deleteGroupsError;
  }

  for (const group of optionGroups) {
    const { data: savedGroup, error: insertGroupError } = await supabase
      .from("product_option_groups")
      .insert({
        product_id: productId,
        position: group.position,
        name_en: group.name_en,
        name_ar: group.name_ar,
        slug: group.slug,
      })
      .select("id")
      .single();

    if (insertGroupError) {
      throw insertGroupError;
    }

    if ((group.values ?? []).length === 0) {
      continue;
    }

    const { error: insertValuesError } = await supabase
      .from("product_option_values")
      .insert(
        group.values.map((value) => ({
          option_group_id: savedGroup.id,
          position: value.position,
          value_en: value.value_en,
          value_ar: value.value_ar,
          option_code: value.option_code,
          is_default: value.is_default,
        }))
      );

    if (insertValuesError) {
      throw insertValuesError;
    }
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
  await replaceOptionGroups(supabase, productId, input.record.optionGroups);

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
      "id, slug, name_en, name_ar, product_code, short_description_en, short_description_ar, stock_status, is_active, brands(name_en, name_ar, logo_url), categories(name_en, name_ar), product_colors(main_image_url, thumbnail_url, position, is_default)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProductQueryRow[]).map(mapAdminListItem);
}

export async function countProducts(
  supabase: ProductDatabaseClient,
  publishStatus?: ProductPublishStatus
): Promise<number> {
  let query = supabase.from("products").select("*", { count: "exact", head: true });

  if (publishStatus === "published") {
    query = query.eq("is_active", true);
  }

  if (publishStatus === "draft") {
    query = query.eq("is_active", false);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function listPublishedProducts(
  supabase: ProductDatabaseClient
): Promise<PublicProductListItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name_en, name_ar, short_description_en, short_description_ar, stock_status, is_active, brands(slug, name_en, name_ar, logo_url), categories(slug, name_en, name_ar), product_colors(main_image_url, thumbnail_url, position, is_default)"
    )
    .eq("is_active", true)
    .order("name_en", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProductQueryRow[]).map(mapPublicListItem);
}

export async function getProductRecordById(
  supabase: ProductDatabaseClient,
  productId: string
): Promise<ProductRecord | null> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, slug, name_en, name_ar, product_code, brand_id, category_id, short_description_en, short_description_ar, full_description_en, full_description_ar, stock_status, is_active, is_featured, brands(name_en, name_ar, logo_url), categories(name_en, name_ar)"
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
    { data: optionGroups, error: optionGroupsError },
  ] = await Promise.all([
    supabase
      .from("product_highlights")
      .select("id, product_id, position, text_en, text_ar")
      .eq("product_id", productId)
      .order("position", { ascending: true }),
    supabase
      .from("product_features")
      .select("id, product_id, position, feature_key")
      .eq("product_id", productId)
      .order("position", { ascending: true }),
    supabase
      .from("product_colors")
      .select(
        "id, product_id, position, name_en, name_ar, hex, product_code, thumbnail_url, main_image_url, is_default"
      )
      .eq("product_id", productId)
      .order("position", { ascending: true }),
    supabase
      .from("product_media")
      .select("id, product_id, position, media_type, url, alt_en, alt_ar, is_main")
      .eq("product_id", productId)
      .order("position", { ascending: true }),
    supabase
      .from("product_option_groups")
      .select("id, product_id, position, name_en, name_ar, slug")
      .eq("product_id", productId)
      .order("position", { ascending: true }),
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

  if (optionGroupsError) {
    throw optionGroupsError;
  }

  const optionGroupIds = (optionGroups ?? []).map((group) => group.id);
  let optionValues: ProductOptionValueDbRow[] = [];

  if (optionGroupIds.length > 0) {
    const { data: optionValuesData, error: optionValuesError } = await supabase
      .from("product_option_values")
      .select(
        "id, option_group_id, position, value_en, value_ar, option_code, is_default"
      )
      .in("option_group_id", optionGroupIds)
      .order("position", { ascending: true });

    if (optionValuesError) {
      throw optionValuesError;
    }

    optionValues = (optionValuesData ?? []) as ProductOptionValueDbRow[];
  }

  const mappedOptionGroups = ((optionGroups ?? []) as ProductOptionGroupDbRow[]).map(
    (group) => ({
      ...group,
      values: optionValues
        .filter((item) => item.option_group_id === group.id)
        .map((value) => ({
          id: value.id,
          option_group_id: value.option_group_id,
          position: value.position,
          value_en: value.value_en,
          value_ar: value.value_ar,
          option_code: value.option_code,
          is_default: value.is_default,
        })),
    })
  );

  return {
    product: product as ProductRow,
    highlights: (highlights ?? []) as ProductHighlightRow[],
    features: (features ?? []) as ProductFeatureRow[],
    colors: (colors ?? []) as ProductColorRow[],
    media: (media ?? []) as ProductMediaRow[],
    optionGroups: mappedOptionGroups as ProductOptionGroupRow[],
    brands: toSingleObject(
      (product as ProductQueryRow & { brands?: ProductQueryRow["brands"] }).brands
    ),
    categories: toSingleObject(
      (product as ProductQueryRow & { categories?: ProductQueryRow["categories"] }).categories
    ),
  };
}

export async function getPublishedProductRecordBySlug(
  supabase: ProductDatabaseClient,
  slug: string
): Promise<ProductRecord | null> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (productError) {
    throw productError;
  }

  if (!product) {
    return null;
  }

  return getProductRecordById(supabase, product.id);
}