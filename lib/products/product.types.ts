export type ProductHighlight = {
  id: string;
  textEn: string;
  textAr: string;
};

export type ProductFeatureIcon = {
  id: string;
  key: string;
  labelEn: string;
  labelAr: string;
  iconName: string;
  selected: boolean;
};

export type ProductMediaItem = {
  id: string;
  type: "image" | "video";
  name: string;
  url: string;
  altEn: string;
  altAr: string;
};

export type ProductColorOption = {
  id: string;
  nameEn: string;
  nameAr: string;
  hex: string;
  productCode: string;
  thumbnailUrl: string;
  mainImageUrl: string;
};

export type ProductStockStatus = "in_stock" | "out_of_stock";
export type ProductPublishStatus = "draft" | "published";

export type ProductFormValues = {
  productNameEn: string;
  productNameAr: string;
  productCode: string;
  brandId: string;
  categoryId: string;
  shortDescriptionEn: string;
  shortDescriptionAr: string;
  fullDescriptionEn: string;
  fullDescriptionAr: string;
  stockStatus: ProductStockStatus;
  highlights: ProductHighlight[];
  featureIcons: ProductFeatureIcon[];
  colors: ProductColorOption[];
  selectedColorId: string | null;
  galleryImages: ProductMediaItem[];
  video: ProductMediaItem | null;
};

export type ProductRow = {
  id?: string;
  slug: string;
  name_en: string;
  name_ar: string;
  product_code: string;
  brand_id: string | null;
  category_id: string | null;
  short_description_en: string;
  short_description_ar: string;
  full_description_en: string;
  full_description_ar: string;
  stock_status: ProductStockStatus;
  is_active: boolean;
  is_featured: boolean;
};

export type ProductHighlightRow = {
  id?: string;
  product_id?: string;
  position: number;
  text_en: string;
  text_ar: string;
};

export type ProductFeatureRow = {
  id?: string;
  product_id?: string;
  feature_key: string;
  position: number;
};

export type ProductColorRow = {
  id?: string;
  product_id?: string;
  position: number;
  name_en: string;
  name_ar: string;
  hex: string;
  product_code: string;
  thumbnail_url: string;
  main_image_url: string;
};

export type ProductMediaRow = {
  id?: string;
  product_id?: string;
  position: number;
  media_type: "image" | "video";
  url: string;
  alt_en: string;
  alt_ar: string;
  is_main: boolean;
};

export type ProductRecord = {
  product: ProductRow;
  highlights: ProductHighlightRow[];
  features: ProductFeatureRow[];
  colors: ProductColorRow[];
  media: ProductMediaRow[];
  brands?: {
    name_en: string | null;
    name_ar: string | null;
    logo_url: string | null;
  } | null;
  categories?: {
    name_en: string | null;
    name_ar: string | null;
  } | null;
};

export type ProductFeatureDefinition = {
  id: string;
  key: string;
  label_en: string;
  label_ar: string;
  icon_name: string;
  description_en: string | null;
  description_ar: string | null;
  is_active: boolean;
};
