-- Safe catalog foundation fields.
-- This migration is additive and intentionally does not drop or rewrite data.

alter table public.products
  add column if not exists is_best_seller boolean not null default false;

alter table public.products
  add column if not exists display_order integer not null default 0;

alter table public.products
  add column if not exists usage_instructions_en text not null default '';

alter table public.products
  add column if not exists usage_instructions_ar text not null default '';

alter table public.products
  add column if not exists seo_title_en text not null default '';

alter table public.products
  add column if not exists seo_title_ar text not null default '';

alter table public.products
  add column if not exists seo_description_en text not null default '';

alter table public.products
  add column if not exists seo_description_ar text not null default '';

create index if not exists idx_products_catalog_order
  on public.products (display_order, created_at desc);

create index if not exists idx_products_is_best_seller
  on public.products (is_best_seller)
  where is_best_seller = true;
