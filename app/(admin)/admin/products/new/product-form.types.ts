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