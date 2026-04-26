export const storageBuckets = {
  brands: process.env.NEXT_PUBLIC_SUPABASE_BRAND_BUCKET || "brand-assets",
  productMedia:
    process.env.NEXT_PUBLIC_SUPABASE_PRODUCT_MEDIA_BUCKET || "product-media",
} as const;
