import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ProductColorRow,
  ProductFeatureRow,
  ProductFormValues,
  ProductHighlightRow,
  ProductMediaRow,
  ProductRecord,
  ProductRow,
} from "./product.types";

type ProductDatabaseClient = SupabaseClient;

type SaveProductRecordInput = {
  productId?: string | null;
  form: ProductFormValues;
  status: "draft" | "published";
};

type SaveProductRecordResult = {
  id: string;
  slug: string;
};

type CatalogRelation = {
  name_en: string;
  name_ar: string;
  slug: string;
} | null;

type ProductDbRow = {
  id: string;
  slug: string;
  name_en: string;
  name_ar: string;
  product_code: string | null;
  short_description_en: string | null;
  short_description_ar: string | null;
  full_description_en: string | null;
  full_description_ar: string | null;
  is_active: boolean;
  brands: CatalogRelation;
  categories: CatalogRelation;
};

type ProductHighlightDbRow = {
  id?: string;
  product_id?: string;
  text_en: string;
  text_ar: string;
  position: number;
};

type ProductFeatureDbRow = {
  id?: string;
  product_id?: string;
  feature_key: string;
  position: number;
};

type ProductColorDbRow = {
  id?: string;
  product_id?: string;
  name_en: string;
  name_ar: string;
  hex: string | null;
  product_code: string | null;
  thumbnail_url: string | null;
  main_image_url: string | null;
  position: number;
};

type ProductMediaDbRow = {
  id?: string;
  product_id?: string;
  media_type: "image" | "video";
  url: string;
  alt_en: string | null;
  alt_ar: string | null;
  is_main: boolean;
  position: number;
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

function normalizeSlugPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProductSlug(form: ProductFormValues) {
  const slugFromName = normalizeSlugPart(form.productNameEn);
  const slugFromCode = normalizeSlugPart(form.productCode);

  return slugFromName || slugFromCode || "untitled-product";
}

function mapCatalogName(relation: CatalogRelation) {
  return relation?.name_en || relation?.name_ar || "";
}

function mapProductDbRowToRecord(product: ProductDbRow): ProductRow {
  return {
    id: product.id,
    slug: product.slug,
    product_name_en: product.name_en,
    product_name_ar: product.name_ar,
    product_code: product.product_code ?? "",
    brand: mapCatalogName(product.brands),
    category: mapCatalogName(product.categories),
    short_description_en: product.short_description_en ?? "",
    short_description_ar: product.short_description_ar ?? "",
    full_description_en: product.full_description_en ?? "",
    full_description_ar: product.full_description_ar ?? "",
    status: product.is_active ? "published" : "draft",
  };
}

async function findCatalogItemId(
  supabase: ProductDatabaseClient,
  table: "brands" | "categories",
  value: string
) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const slugCandidate = normalizeSlugPart(trimmedValue);
  const queries = [
    supabase.from(table).select("id").eq("slug", slugCandidate).maybeSingle(),
    supabase.from(table).select("id").eq("name_en", trimmedValue).maybeSingle(),
    supabase.from(table).select("id").eq("name_ar", trimmedValue).maybeSingle(),
  ];

  for (const query of queries) {
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (data?.id) {
      return data.id;
    }
  }

  throw new Error(
    `${table === "brands" ? "Brand" : "Category"} must exist in the admin catalog first.`
  );
}

async function upsertProductRow(
  supabase: ProductDatabaseClient,
  row: {
    slug: string;
    name_en: string;
    name_ar: string;
    product_code: string | null;
    brand_id: string | null;
    category_id: string | null;
    short_description_en: string | null;
    short_description_ar: string | null;
    full_description_en: string | null;
    full_description_ar: string | null;
    is_active: boolean;
  },
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

function toHighlightInsertRows(form: ProductFormValues): ProductHighlightDbRow[] {
  return form.highlights
    .filter((item) => item.textEn.trim() !== "" || item.textAr.trim() !== "")
    .map((item, index) => ({
      text_en: item.textEn.trim(),
      text_ar: item.textAr.trim(),
      position: index,
    }));
}

function toFeatureInsertRows(form: ProductFormValues): ProductFeatureDbRow[] {
  return form.featureIcons
    .filter((item) => item.selected)
    .map((item, index) => ({
      feature_key: item.key,
      position: index,
    }));
}

function toColorInsertRows(form: ProductFormValues): ProductColorDbRow[] {
  return form.colors
    .filter((item) => item.nameEn.trim() !== "" || item.nameAr.trim() !== "")
    .map((item, index) => ({
      name_en: item.nameEn.trim(),
      name_ar: item.nameAr.trim(),
      hex: item.hex.trim() || null,
      product_code: item.productCode.trim() || null,
      thumbnail_url: item.thumbnailPreview.trim() || null,
      main_image_url: item.mainImagePreview.trim() || null,
      position: index,
    }));
}

function toMediaInsertRows(form: ProductFormValues): ProductMediaDbRow[] {
  const mediaRows: ProductMediaDbRow[] = [];

  if (form.mainCardImage) {
    mediaRows.push({
      media_type: "image",
      url: form.mainCardImage.preview.trim() || `placeholder://${form.mainCardImage.id}`,
      alt_en: form.mainCardImage.name.trim() || null,
      alt_ar: form.mainCardImage.name.trim() || null,
      is_main: true,
      position: 0,
    });
  }

  form.galleryImages.forEach((item, index) => {
    mediaRows.push({
      media_type: "image",
      url: item.preview.trim() || `placeholder://${item.id}`,
      alt_en: item.name.trim() || null,
      alt_ar: item.name.trim() || null,
      is_main: false,
      position: index,
    });
  });

  if (form.video) {
    mediaRows.push({
      media_type: "video",
      url: form.video.preview.trim() || `placeholder://${form.video.id}`,
      alt_en: form.video.name.trim() || null,
      alt_ar: form.video.name.trim() || null,
      is_main: false,
      position: 0,
    });
  }

  return mediaRows;
}

export async function saveProductRecord(
  supabase: ProductDatabaseClient,
  input: SaveProductRecordInput
): Promise<SaveProductRecordResult> {
  const brandId = await findCatalogItemId(supabase, "brands", input.form.brand);
  const categoryId = await findCatalogItemId(
    supabase,
    "categories",
    input.form.category
  );

  const savedProduct = await upsertProductRow(
    supabase,
    {
      slug: buildProductSlug(input.form),
      name_en: input.form.productNameEn.trim(),
      name_ar: input.form.productNameAr.trim(),
      product_code: input.form.productCode.trim() || null,
      brand_id: brandId,
      category_id: categoryId,
      short_description_en: input.form.shortDescriptionEn.trim() || null,
      short_description_ar: input.form.shortDescriptionAr.trim() || null,
      full_description_en: input.form.fullDescriptionEn.trim() || null,
      full_description_ar: input.form.fullDescriptionAr.trim() || null,
      is_active: input.status === "published",
    },
    input.productId
  );

  const productId = savedProduct.id;

  await replaceChildRows<ProductHighlightDbRow>(
    supabase,
    "product_highlights",
    productId,
    toHighlightInsertRows(input.form)
  );
  await replaceChildRows<ProductFeatureDbRow>(
    supabase,
    "product_features",
    productId,
    toFeatureInsertRows(input.form)
  );
  await replaceChildRows<ProductColorDbRow>(
    supabase,
    "product_colors",
    productId,
    toColorInsertRows(input.form)
  );
  await replaceChildRows<ProductMediaDbRow>(
    supabase,
    "product_media",
    productId,
    toMediaInsertRows(input.form)
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
      "id, slug, name_en, name_ar, product_code, is_active, brands(name_en, name_ar, slug), categories(name_en, name_ar, slug)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProductDbRow[]).map((item) => ({
    id: item.id,
    slug: item.slug,
    product_name_en: item.name_en,
    product_name_ar: item.name_ar,
    product_code: item.product_code ?? "",
    category: mapCatalogName(item.categories),
    brand: mapCatalogName(item.brands),
    status: item.is_active ? "published" : "draft",
  }));
}

export async function countProducts(
  supabase: ProductDatabaseClient,
  status?: "draft" | "published"
): Promise<number> {
  let query = supabase.from("products").select("*", { count: "exact", head: true });

  if (status) {
    query = query.eq("is_active", status === "published");
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
      "id, slug, name_en, name_ar, short_description_en, short_description_ar, is_active, brands(name_en, name_ar, slug), categories(name_en, name_ar, slug)"
    )
    .eq("is_active", true)
    .order("name_en", { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProductDbRow[]).map((item) => ({
    id: item.id,
    slug: item.slug,
    product_name_en: item.name_en,
    product_name_ar: item.name_ar,
    short_description_en: item.short_description_en ?? "",
    short_description_ar: item.short_description_ar ?? "",
    category: mapCatalogName(item.categories),
    brand: mapCatalogName(item.brands),
    status: item.is_active ? "published" : "draft",
  }));
}

export async function getProductRecordById(
  supabase: ProductDatabaseClient,
  productId: string
): Promise<ProductRecord | null> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select(
      "id, slug, name_en, name_ar, product_code, short_description_en, short_description_ar, full_description_en, full_description_ar, is_active, brands(name_en, name_ar, slug), categories(name_en, name_ar, slug)"
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
        "id, product_id, position, name_en, name_ar, hex, product_code, thumbnail_url, main_image_url"
      )
      .eq("product_id", productId)
      .order("position", { ascending: true }),
    supabase
      .from("product_media")
      .select("id, product_id, media_type, url, alt_en, alt_ar, is_main, position")
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

  return {
    product: mapProductDbRowToRecord(product as ProductDbRow),
    highlights: ((highlights ?? []) as ProductHighlightDbRow[]).map((item) => ({
      id: item.id,
      product_id: item.product_id,
      sort_order: item.position,
      text_en: item.text_en,
      text_ar: item.text_ar,
    })),
    features: ((features ?? []) as ProductFeatureDbRow[]).map((item, index) => ({
      id: item.id,
      product_id: item.product_id,
      sort_order: item.position,
      feature_key: item.feature_key,
      icon: `feature-${index + 1}`,
      selected: true,
    })),
    colors: ((colors ?? []) as ProductColorDbRow[]).map((item) => ({
      id: item.id,
      product_id: item.product_id,
      sort_order: item.position,
      name_en: item.name_en,
      name_ar: item.name_ar,
      hex: item.hex ?? "",
      product_code: item.product_code ?? "",
      thumbnail_preview: item.thumbnail_url ?? "",
      main_image_preview: item.main_image_url ?? "",
    })),
    media: ((media ?? []) as ProductMediaDbRow[]).map((item) => ({
      id: item.id,
      product_id: item.product_id,
      sort_order: item.position,
      media_type:
        item.media_type === "video"
          ? "video"
          : item.is_main
            ? "main"
            : "gallery",
      file_kind: item.media_type,
      name: item.alt_en || item.alt_ar || item.url,
      preview: item.url,
    })),
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
