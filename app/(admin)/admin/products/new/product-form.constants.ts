import type { ProductFormValues } from "./product-form.types";

export const featureIconLabels: Record<
  string,
  { en: string; ar: string }
> = {
  refillable: {
    en: "Refillable",
    ar: "قابل لإعادة التعبئة",
  },
  xylene_free: {
    en: "Xylene Free",
    ar: "خالٍ من الزايلين",
  },
  dry_erase: {
    en: "Dry Erase",
    ar: "قابل للمسح الجاف",
  },
  non_toxic: {
    en: "Non-toxic",
    ar: "غير سام",
  },
  recycled_materials: {
    en: "Made from recycled materials",
    ar: "مصنوع من مواد معاد تدويرها",
  },
};

export const defaultProductFormValues: ProductFormValues = {
  productNameEn: "",
  productNameAr: "",
  productCode: "",
  brand: "",
  category: "",
  shortDescriptionEn: "",
  shortDescriptionAr: "",
  fullDescriptionEn: "",
  fullDescriptionAr: "",
  highlights: [
    { id: "h1", textEn: "", textAr: "" },
    { id: "h2", textEn: "", textAr: "" },
    { id: "h3", textEn: "", textAr: "" },
  ],
  featureIcons: [
    { id: "f1", key: "refillable", icon: "Droplets", selected: true },
    { id: "f2", key: "xylene_free", icon: "ShieldCheck", selected: true },
    { id: "f3", key: "dry_erase", icon: "Eraser", selected: true },
    { id: "f4", key: "non_toxic", icon: "Leaf", selected: false },
    {
      id: "f5",
      key: "recycled_materials",
      icon: "Recycle",
      selected: true,
    },
  ],
  mainCardImage: null,
  galleryImages: [],
  video: null,
  colors: [
    {
      id: "c1",
      nameEn: "Black",
      nameAr: "أسود",
      hex: "#111111",
      productCode: "660101",
      thumbnailPreview: "",
      mainImagePreview: "",
    },
    {
      id: "c2",
      nameEn: "Red",
      nameAr: "أحمر",
      hex: "#dc2626",
      productCode: "660103",
      thumbnailPreview: "",
      mainImagePreview: "",
    },
  ],
  selectedColorId: "c1",
};