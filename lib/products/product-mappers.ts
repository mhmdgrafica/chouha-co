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
  ProductOptionGroup,
  ProductOptionGroupRow,
  ProductOptionValue,
  ProductOptionValueRow,
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

function normalizeOptionKey(value: string) {
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
  const hasExplicitDefault = colors.some((item) => item.isDefault);

  return colors
    .filter(
      (item) =>
        item.nameEn.trim() !== "" ||
        item.nameAr.trim() !== "" ||
        item.mainImageUrl.trim() !== ""
    )
    .map((item, index) => ({
      position: index,
      name_en: item.nameEn.trim(),
      name_ar: item.nameAr.trim(),
      hex: item.hex.trim(),
      product_code: item.productCode.trim(),
      thumbnail_url: item.thumbnailUrl.trim(),
      main_image_url: item.mainImageUrl.trim(),
      is_default: hasExplicitDefault ? item.isDefault : index === 0,
    }));
}

function toOptionValueRows(values: ProductOptionValue[]): ProductOptionValueRow[] {
  const activeValues = values.filter(
    (item) => item.valueEn.trim() !== "" || item.valueAr.trim() !== ""
  );
  const hasExplicitDefault = activeValues.some((item) => item.isDefault);

  return activeValues.map((item, index) => ({
    position: index,
    value_en: item.valueEn.trim(),
    value_ar: item.valueAr.trim(),
    option_code: item.optionCode.trim(),
    is_default: hasExplicitDefault ? item.isDefault : index === 0,
  }));
}

function toOptionGroupRows(optionGroups: ProductOptionGroup[]): ProductOptionGroupRow[] {
  return optionGroups
    .map((group, index) => {
      const values = toOptionValueRows(group.options);
      const fallbackName = group.options[0]?.valueEn || group.options[0]?.valueAr || "option";
      const groupNameEn = group.nameEn.trim();
      const groupNameAr = group.nameAr.trim();

      if ((groupNameEn === "" && groupNameAr === "") || values.length === 0) {
        return null;
      }

      return {
        position: index,
        name_en: groupNameEn,
        name_ar: groupNameAr,
        slug: normalizeOptionKey(group.slug || groupNameEn || fallbackName) || `option-${index + 1}`,
        values,
      };
    })
    .filter((group): group is ProductOptionGroupRow => group !== null);
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
    optionGroups: toOptionGroupRows(form.optionGroups),
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
  const sortedRows = rows
    .slice()
    .sort((a, b) => Number(b.is_default) - Number(a.is_default) || a.position - b.position);

  return sortedRows.map((item, index) => ({
    id: item.id ?? `color-${index + 1}`,
    nameEn: item.name_en,
    nameAr: item.name_ar,
    hex: item.hex,
    productCode: item.product_code,
    thumbnailUrl: item.thumbnail_url,
    mainImageUrl: item.main_image_url,
    isDefault: item.is_default,
  }));
}

function fromOptionValueRows(rows: ProductOptionValueRow[]): ProductOptionValue[] {
  const sortedRows = rows
    .slice()
    .sort((a, b) => Number(b.is_default) - Number(a.is_default) || a.position - b.position);

  return sortedRows.map((item, index) => ({
    id: item.id ?? `option-value-${index + 1}`,
    valueEn: item.value_en,
    valueAr: item.value_ar,
    optionCode: item.option_code,
    isDefault: item.is_default,
  }));
}

function fromOptionGroupRows(rows: ProductOptionGroupRow[]): ProductOptionGroup[] {
  return rows
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((group, index) => {
      const options = fromOptionValueRows(group.values);
      const defaultValue = options.find((item) => item.isDefault) ?? options[0] ?? null;

      return {
        id: group.id ?? `option-group-${index + 1}`,
        nameEn: group.name_en,
        nameAr: group.name_ar,
        slug: group.slug,
        options,
        selectedValueId: defaultValue?.id ?? null,
      };
    });
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
  const defaultColor = colors.find((item) => item.isDefault) ?? colors[0] ?? null;
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
    selectedColorId: defaultColor?.id ?? null,
    optionGroups: fromOptionGroupRows(record.optionGroups),
    galleryImages: galleryMedia.map((item, index) =>
      toMediaItem(item, `gallery-${index + 1}`)
    ),
    video: videoMedia ? toMediaItem(videoMedia, "video-1") : null,
  };
}