# Chouha Co

Bilingual product-catalog website for Chouha, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## What this repo now supports

- Public bilingual product catalog
- Public product details pages
- Admin product create/edit flow
- Admin brand management with logo upload
- Admin category management
- Admin feature icon management
- Product stock status: `in_stock` / `out_of_stock`
- Product color-specific main image switching data
- Direct file upload flow to Supabase Storage from the admin UI

## Required environment variables

Create `.env.local` from `.env.example` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_BRAND_BUCKET`
- `NEXT_PUBLIC_SUPABASE_PRODUCT_MEDIA_BUCKET`

## Database setup

Run the SQL in [supabase/schema.sql](/workspace/chouha-co/supabase/schema.sql) inside the Supabase SQL editor.

That file creates:

- the catalog tables
- feature icon definitions
- stock status support
- storage buckets
- development-friendly RLS policies

## Local development

```bash
npm install
npm run dev
```

The app runs on:

```bash
http://localhost:4000
```

## Important note

The included database and storage policies are intentionally permissive for development so the current admin UI can work without a full auth gate yet. Tighten them before production launch.
