import type {
  ProductColorOption,
  ProductColorRow,
  ProductFeatureIcon,
  ProductFeatureRow,
  ProductFormValues,
  ProductHighlight,
  ProductHighlightRow,
  ProductMediaItem,
  ProductMediaRow,
  ProductPublishStatus,
  ProductRecord,
  ProductRow,
} from "./product.types";

const fallbackSlug = "untitled-product";

function normalizeSlugPart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildProductSlug(form: ProductFormValues) {
  const slugFromName = normalizeSlugPart(form.productNameEn);
  const slugFromCode = normalizeSlugPart(form.productCode);

  return slugFromName || slugFromCode || fallbackSlug;
}

function toProductRow(
  form: ProductFormValues,
  publishStatus: ProductPublishStatus
): ProductRow {
  return {
    slug: buildProductSlug(form),
    name_en: form.productNameEn.trim(),
    name_ar: form.productNameAr.trim(),
    product_code: form.productCode.trim(),
    brand_id: form.brandId || null,
    category_id: form.categoryId || null,
    short_description_en: form.shortDescriptionEn.trim(),
    short_description_ar: form.shortDescriptionAr.trim(),
    full_description_en: form.fullDescriptionEn.trim(),
    full_description_ar: form.fullDescriptionAr.trim(),
    stock_status: form.stockStatus,
    is_active: publishStatus === "published",
    is_featured: false,
  };
}

function toHighlightRows(highlights: ProductHighlight[]): ProductHighlightRow[] {
  return highlights
    .filter((item) => item.textEn.trim() !== "" || item.textAr.trim() !== "")
    .map((item, index) => ({
      position: index,
      text_en: item.textEn.trim(),
      text_ar: item.textAr.trim(),
    }));
}

function toFeatureRows(featureIcons: ProductFeatureIcon[]): ProductFeatureRow[] {
  return featureIcons
    .filter((item) => item.selected)
    .map((item, index) => ({
      position: index,
      feature_key: item.key,
    }));
}

function toColorRows(colors: ProductColorOption[]): ProductColorRow[] {
  return colors.map((item, index) => ({
    position: index,
    name_en: item.nameEn.trim(),
    name_ar: item.nameAr.trim(),
    hex: item.hex.trim(),
    product_code: item.productCode.trim(),
    thumbnail_url: item.thumbnailUrl.trim(),
    main_image_url: item.mainImageUrl.trim(),
  }));
}

function toMediaRows(form: ProductFormValues): ProductMediaRow[] {
  const media: ProductMediaRow[] = [];

  form.galleryImages.forEach((item, index) => {
    media.push({
      position: index,
      media_type: item.type,
      url: item.url.trim(),
      alt_en: item.altEn.trim(),
      alt_ar: item.altAr.trim(),
      is_main: false,
    });
  });

  if (form.video) {
    media.push({
      position: media.length,
      media_type: "video",
      url: form.video.url.trim(),
      alt_en: form.video.altEn.trim(),
      alt_ar: form.video.altAr.trim(),
      is_main: false,
    });
  }

  return media;
}

export function mapProductFormToRecord(
  form: ProductFormValues,
  publishStatus: ProductPublishStatus = "draft"
): ProductRecord {
  return {
    product: toProductRow(form, publishStatus),
    highlights: toHighlightRows(form.highlights),
    features: toFeatureRows(form.featureIcons),
    colors: toColorRows(form.colors),
    media: toMediaRows(form),
  };
}

function fromHighlightRows(rows: ProductHighlightRow[]): ProductHighlight[] {
  return rows
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((item, index) => ({
      id: item.id ?? `highlight-${index + 1}`,
      textEn: item.text_en,
      textAr: item.text_ar,
    }));
}

export function mergeFeatureDefinitionsWithSelections(
  definitions: ProductFeatureIcon[],
  rows: ProductFeatureRow[]
): ProductFeatureIcon[] {
  const selectedKeys = new Set(rows.map((item) => item.feature_key));

  return definitions.map((definition) => ({
    ...definition,
    selected: selectedKeys.has(definition.key),
  }));
}

function fromColorRows(rows: ProductColorRow[]): ProductColorOption[] {
  return rows
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((item, index) => ({
      id: item.id ?? `color-${index + 1}`,
      nameEn: item.name_en,
      nameAr: item.name_ar,
      hex: item.hex,
      productCode: item.product_code,
      thumbnailUrl: item.thumbnail_url,
      mainImageUrl: item.main_image_url,
    }));
}

function toMediaItem(item: ProductMediaRow, fallbackId: string): ProductMediaItem {
  return {
    id: item.id ?? fallbackId,
    type: item.media_type,
    name: item.url.split("/").pop() ?? fallbackId,
    url: item.url,
    altEn: item.alt_en,
    altAr: item.alt_ar,
  };
}

export function mapProductRecordToForm(
  record: ProductRecord,
  featureIcons: ProductFeatureIcon[]
): ProductFormValues {
  const colors = fromColorRows(record.colors);
  const galleryMedia = record.media
    .filter((item) => item.media_type === "image")
    .sort((a, b) => a.position - b.position);
  const videoMedia =
    record.media.find((item) => item.media_type === "video") ?? null;

  return {
    productNameEn: record.product.name_en,
    productNameAr: record.product.name_ar,
    productCode: record.product.product_code,
    brandId: record.product.brand_id ?? "",
    categoryId: record.product.category_id ?? "",
    shortDescriptionEn: record.product.short_description_en,
    shortDescriptionAr: record.product.short_description_ar,
    fullDescriptionEn: record.product.full_description_en,
    fullDescriptionAr: record.product.full_description_ar,
    stockStatus: record.product.stock_status,
    highlights: fromHighlightRows(record.highlights),
    featureIcons: mergeFeatureDefinitionsWithSelections(featureIcons, record.features),
    colors,
    selectedColorId: colors[0]?.id ?? null,
    galleryImages: galleryMedia.map((item, index) =>
      toMediaItem(item, `gallery-${index + 1}`)
    ),
    video: videoMedia ? toMediaItem(videoMedia, "video-1") : null,
  };
}
