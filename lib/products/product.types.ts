export type ProductHighlight = {
  id: string;
  textEn: string;
  textAr: string;
};

export type ProductFeatureIcon = {
  id: string;
  key: string;
  icon: string;
  selected: boolean;
};

export type ProductMediaItem = {
  id: string;
  type: "image" | "video";
  name: string;
  preview: string;
};

export type ProductColorOption = {
  id: string;
  nameEn: string;
  nameAr: string;
  hex: string;
  productCode: string;
  thumbnailPreview: string;
  mainImagePreview: string;
};

export type ProductFormValues = {
  productNameEn: string;
  productNameAr: string;
  productCode: string;
  brand: string;
  category: string;
  shortDescriptionEn: string;
  shortDescriptionAr: string;
  fullDescriptionEn: string;
  fullDescriptionAr: string;
  highlights: ProductHighlight[];
  featureIcons: ProductFeatureIcon[];
  mainCardImage: ProductMediaItem | null;
  galleryImages: ProductMediaItem[];
  video: ProductMediaItem | null;
  colors: ProductColorOption[];
  selectedColorId: string | null;
};

export type ProductStatus = "draft" | "published";

export type ProductRow = {
  id?: string;
  slug: string;
  product_name_en: string;
  product_name_ar: string;
  product_code: string;
  brand: string;
  category: string;
  short_description_en: string;
  short_description_ar: string;
  full_description_en: string;
  full_description_ar: string;
  status: ProductStatus;
};

export type ProductHighlightRow = {
  id?: string;
  product_id?: string;
  sort_order: number;
  text_en: string;
  text_ar: string;
};

export type ProductFeatureRow = {
  id?: string;
  product_id?: string;
  feature_key: string;
  icon: string;
  selected: boolean;
  sort_order: number;
};

export type ProductColorRow = {
  id?: string;
  product_id?: string;
  sort_order: number;
  name_en: string;
  name_ar: string;
  hex: string;
  product_code: string;
  thumbnail_preview: string;
  main_image_preview: string;
};

export type ProductMediaRow = {
  id?: string;
  product_id?: string;
  sort_order: number;
  media_type: "main" | "gallery" | "video";
  file_kind: "image" | "video";
  name: string;
  preview: string;
};

export type ProductRecord = {
  product: ProductRow;
  highlights: ProductHighlightRow[];
  features: ProductFeatureRow[];
  colors: ProductColorRow[];
  media: ProductMediaRow[];
};
