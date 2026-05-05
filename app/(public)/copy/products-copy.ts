import type { PublicLang } from "./shared";

export const productsPageCopy = {
  en: {
    badge: "PRODUCT CATALOG",
    title: "Explore our stationery and office product range.",
    description:
      "Browse a modern collection of writing instruments, markers, office tools, and school essentials presented in a clean and professional catalog style.",
    showing: "Showing",
    publishedProducts: "published products",
    sectionTitle: "Product catalog",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    fallbackDescription: "Product description will appear here.",
    viewProduct: "View Product",
    empty: "No published products are available yet.",
    clearFilter: "Clear filter",
    filteredBy: "Filtered by",
    loadErrorFallback: "Unable to load products right now.",
  },
  ar: {
    badge: "كتالوج المنتجات",
    title: "اكتشف مجموعة القرطاسية واللوازم المكتبية لدينا.",
    description:
      "تصفح تشكيلة احترافية من أدوات الكتابة والأقلام واللوازم المكتبية والاحتياجات المدرسية ضمن عرض منظم وواضح.",
    showing: "عرض",
    publishedProducts: "منتج منشور",
    sectionTitle: "كتالوج المنتجات",
    inStock: "متوفر",
    outOfStock: "غير متوفر",
    fallbackDescription: "سيظهر وصف المنتج هنا.",
    viewProduct: "عرض المنتج",
    empty: "لا توجد منتجات منشورة حالياً.",
    clearFilter: "إزالة الفلتر",
    filteredBy: "تصفية حسب",
    loadErrorFallback: "تعذر تحميل المنتجات حالياً.",
  },
} as const satisfies Record<PublicLang, Record<string, string>>;
