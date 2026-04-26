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
  ProductRecord,
  ProductRow,
  ProductStatus,
} from "./product.types";

const fallbackSlug = "untitled-product";
const defaultFeatureDefinitions = [
  { key: "refillable", icon: "Droplets" },
  { key: "xylene_free", icon: "ShieldCheck" },
  { key: "dry_erase", icon: "Eraser" },
  { key: "non_toxic", icon: "Leaf" },
  { key: "recycled_materials", icon: "Recycle" },
] as const;

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
  status: ProductStatus
): ProductRow {
  return {
    slug: buildProductSlug(form),
    product_name_en: form.productNameEn.trim(),
    product_name_ar: form.productNameAr.trim(),
    product_code: form.productCode.trim(),
    brand: form.brand.trim(),
    category: form.category.trim(),
    short_description_en: form.shortDescriptionEn.trim(),
    short_description_ar: form.shortDescriptionAr.trim(),
    full_description_en: form.fullDescriptionEn.trim(),
    full_description_ar: form.fullDescriptionAr.trim(),
    status,
  };
}

function toHighlightRows(
  highlights: ProductHighlight[]
): ProductHighlightRow[] {
  return highlights
    .filter((item) => item.textEn.trim() !== "" || item.textAr.trim() !== "")
    .map((item, index) => ({
      sort_order: index,
      text_en: item.textEn.trim(),
      text_ar: item.textAr.trim(),
    }));
}

function toFeatureRows(
  featureIcons: ProductFeatureIcon[]
): ProductFeatureRow[] {
  return featureIcons.map((item, index) => ({
    sort_order: index,
    feature_key: item.key,
    icon: item.icon,
    selected: item.selected,
  }));
}

function toColorRows(colors: ProductColorOption[]): ProductColorRow[] {
  return colors.map((item, index) => ({
    sort_order: index,
    name_en: item.nameEn.trim(),
    name_ar: item.nameAr.trim(),
    hex: item.hex.trim(),
    product_code: item.productCode.trim(),
    thumbnail_preview: item.thumbnailPreview.trim(),
    main_image_preview: item.mainImagePreview.trim(),
  }));
}

function toMediaRows(form: ProductFormValues): ProductMediaRow[] {
  const media: ProductMediaRow[] = [];

  if (form.mainCardImage) {
    media.push({
      sort_order: 0,
      media_type: "main",
      file_kind: form.mainCardImage.type,
      name: form.mainCardImage.name.trim(),
      preview: form.mainCardImage.preview.trim(),
    });
  }

  form.galleryImages.forEach((item, index) => {
    media.push({
      sort_order: index,
      media_type: "gallery",
      file_kind: item.type,
      name: item.name.trim(),
      preview: item.preview.trim(),
    });
  });

  if (form.video) {
    media.push({
      sort_order: 0,
      media_type: "video",
      file_kind: form.video.type,
      name: form.video.name.trim(),
      preview: form.video.preview.trim(),
    });
  }

  return media;
}

export function mapProductFormToRecord(
  form: ProductFormValues,
  status: ProductStatus = "draft"
): ProductRecord {
  return {
    product: toProductRow(form, status),
    highlights: toHighlightRows(form.highlights),
    features: toFeatureRows(form.featureIcons),
    colors: toColorRows(form.colors),
    media: toMediaRows(form),
  };
}

function fromHighlightRows(rows: ProductHighlightRow[]): ProductHighlight[] {
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item, index) => ({
      id: item.id ?? `highlight-${index + 1}`,
      textEn: item.text_en,
      textAr: item.text_ar,
    }));
}

function fromFeatureRows(rows: ProductFeatureRow[]): ProductFeatureIcon[] {
  const orderedRows = rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order);
  const selectedIds = new Map(
    orderedRows.map((item) => [item.feature_key, item.id ?? item.feature_key])
  );
  const selectedKeys = new Set(orderedRows.map((item) => item.feature_key));

  const defaultRows = defaultFeatureDefinitions.map((item, index) => ({
    id: selectedIds.get(item.key) ?? `feature-${index + 1}`,
    key: item.key,
    icon: item.icon,
    selected: selectedKeys.has(item.key),
  }));

  const extraRows = orderedRows
    .filter((item) => !defaultFeatureDefinitions.some((entry) => entry.key === item.feature_key))
    .map((item, index) => ({
      id: item.id ?? `feature-extra-${index + 1}`,
      key: item.feature_key,
      icon: item.icon,
      selected: item.selected,
    }));

  return [...defaultRows, ...extraRows];
}

function fromColorRows(rows: ProductColorRow[]): ProductColorOption[] {
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item, index) => ({
      id: item.id ?? `color-${index + 1}`,
      nameEn: item.name_en,
      nameAr: item.name_ar,
      hex: item.hex,
      productCode: item.product_code,
      thumbnailPreview: item.thumbnail_preview,
      mainImagePreview: item.main_image_preview,
    }));
}

function toMediaItem(item: ProductMediaRow, fallbackId: string): ProductMediaItem {
  return {
    id: item.id ?? fallbackId,
    type: item.file_kind,
    name: item.name,
    preview: item.preview,
  };
}

export function mapProductRecordToForm(record: ProductRecord): ProductFormValues {
  const colors = fromColorRows(record.colors);
  const mainMedia = record.media.find((item) => item.media_type === "main") ?? null;
  const videoMedia = record.media.find((item) => item.media_type === "video") ?? null;
  const galleryMedia = record.media
    .filter((item) => item.media_type === "gallery")
    .sort((a, b) => a.sort_order - b.sort_order);

  return {
    productNameEn: record.product.product_name_en,
    productNameAr: record.product.product_name_ar,
    productCode: record.product.product_code,
    brand: record.product.brand,
    category: record.product.category,
    shortDescriptionEn: record.product.short_description_en,
    shortDescriptionAr: record.product.short_description_ar,
    fullDescriptionEn: record.product.full_description_en,
    fullDescriptionAr: record.product.full_description_ar,
    highlights: fromHighlightRows(record.highlights),
    featureIcons: fromFeatureRows(record.features),
    mainCardImage: mainMedia ? toMediaItem(mainMedia, "main-image") : null,
    galleryImages: galleryMedia.map((item, index) =>
      toMediaItem(item, `gallery-${index + 1}`)
    ),
    video: videoMedia ? toMediaItem(videoMedia, "video-1") : null,
    colors,
    selectedColorId: colors[0]?.id ?? null,
  };
}
