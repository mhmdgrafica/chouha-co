import type { ProductFormValues } from "./product-form.types";

export const defaultProductFormValues: ProductFormValues = {
  productNameEn: "",
  productNameAr: "",
  productCode: "",
  brandId: "",
  categoryId: "",
  shortDescriptionEn: "",
  shortDescriptionAr: "",
  fullDescriptionEn: "",
  fullDescriptionAr: "",
  stockStatus: "in_stock",
  highlights: [
    { id: "h1", textEn: "", textAr: "" },
    { id: "h2", textEn: "", textAr: "" },
    { id: "h3", textEn: "", textAr: "" },
  ],
  featureIcons: [],
  colors: [],
  selectedColorId: null,
  optionGroups: [],
  galleryImages: [],
  video: null,
};