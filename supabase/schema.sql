-- Chouha schema aligned with the current admin/product logic.
-- Development-friendly policies are included below. Tighten them before production auth launch.

create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop table if exists product_option_values cascade;
drop table if exists product_option_groups cascade;
drop table if exists product_features cascade;
drop table if exists feature_definitions cascade;
drop table if exists product_media cascade;
drop table if exists product_colors cascade;
drop table if exists product_highlights cascade;
drop table if exists products cascade;
drop table if exists brands cascade;
drop table if exists categories cascade;

create table brands (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  slug text not null unique,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_brands_updated_at
before update on brands
for each row execute function set_updated_at();

create table categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_categories_updated_at
before update on categories
for each row execute function set_updated_at();

create table feature_definitions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label_en text not null,
  label_ar text not null,
  icon_name text not null,
  description_en text,
  description_ar text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_feature_definitions_updated_at
before update on feature_definitions
for each row execute function set_updated_at();

create table products (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  slug text not null unique,
  product_code text not null,
  brand_id uuid references brands(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  short_description_en text,
  short_description_ar text,
  full_description_en text,
  full_description_ar text,
  stock_status text not null default 'in_stock'
    check (stock_status in ('in_stock', 'out_of_stock')),
  is_featured boolean not null default false,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_products_brand_id on products(brand_id);
create index idx_products_category_id on products(category_id);
create index idx_products_is_active on products(is_active);
create index idx_products_stock_status on products(stock_status);

create trigger trg_products_updated_at
before update on products
for each row execute function set_updated_at();

create table product_highlights (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  text_en text not null,
  text_ar text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_product_highlights_product_id on product_highlights(product_id);

create table product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name_en text not null,
  name_ar text not null,
  hex text,
  product_code text,
  thumbnail_url text,
  main_image_url text,
  position int not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_product_colors_product_id on product_colors(product_id);
create unique index uq_product_default_color
on product_colors(product_id)
where is_default = true;

create table product_features (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  feature_key text not null references feature_definitions(key) on delete restrict,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique(product_id, feature_key)
);

create index idx_product_features_product_id on product_features(product_id);
create index idx_product_features_feature_key on product_features(feature_key);

create table product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  url text not null,
  alt_en text default '',
  alt_ar text default '',
  is_main boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_product_media_product_id on product_media(product_id);
create unique index uq_product_one_main_media
on product_media(product_id)
where is_main = true;

create table product_option_groups (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name_en text not null,
  name_ar text not null,
  slug text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_product_option_groups_product_id on product_option_groups(product_id);
create unique index uq_product_option_group_slug on product_option_groups(product_id, slug);

create trigger trg_product_option_groups_updated_at
before update on product_option_groups
for each row execute function set_updated_at();

create table product_option_values (
  id uuid primary key default gen_random_uuid(),
  option_group_id uuid not null references product_option_groups(id) on delete cascade,
  value_en text not null,
  value_ar text not null,
  option_code text not null default '',
  position int not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_product_option_values_group_id on product_option_values(option_group_id);
create unique index uq_product_option_default_value
on product_option_values(option_group_id)
where is_default = true;

alter table brands enable row level security;
alter table categories enable row level security;
alter table feature_definitions enable row level security;
alter table products enable row level security;
alter table product_highlights enable row level security;
alter table product_colors enable row level security;
alter table product_features enable row level security;
alter table product_media enable row level security;
alter table product_option_groups enable row level security;
alter table product_option_values enable row level security;

create policy "allow read brands" on brands for select to anon, authenticated using (true);
create policy "allow insert brands" on brands for insert to anon, authenticated with check (true);
create policy "allow update brands" on brands for update to anon, authenticated using (true) with check (true);
create policy "allow delete brands" on brands for delete to anon, authenticated using (true);

create policy "allow read categories" on categories for select to anon, authenticated using (true);
create policy "allow insert categories" on categories for insert to anon, authenticated with check (true);
create policy "allow update categories" on categories for update to anon, authenticated using (true) with check (true);
create policy "allow delete categories" on categories for delete to anon, authenticated using (true);

create policy "allow read feature definitions" on feature_definitions for select to anon, authenticated using (true);
create policy "allow insert feature definitions" on feature_definitions for insert to anon, authenticated with check (true);
create policy "allow update feature definitions" on feature_definitions for update to anon, authenticated using (true) with check (true);
create policy "allow delete feature definitions" on feature_definitions for delete to anon, authenticated using (true);

create policy "allow read products" on products for select to anon, authenticated using (true);
create policy "allow insert products" on products for insert to anon, authenticated with check (true);
create policy "allow update products" on products for update to anon, authenticated using (true) with check (true);
create policy "allow delete products" on products for delete to anon, authenticated using (true);

create policy "allow read product_highlights" on product_highlights for select to anon, authenticated using (true);
create policy "allow insert product_highlights" on product_highlights for insert to anon, authenticated with check (true);
create policy "allow update product_highlights" on product_highlights for update to anon, authenticated using (true) with check (true);
create policy "allow delete product_highlights" on product_highlights for delete to anon, authenticated using (true);

create policy "allow read product_colors" on product_colors for select to anon, authenticated using (true);
create policy "allow insert product_colors" on product_colors for insert to anon, authenticated with check (true);
create policy "allow update product_colors" on product_colors for update to anon, authenticated using (true) with check (true);
create policy "allow delete product_colors" on product_colors for delete to anon, authenticated using (true);

create policy "allow read product_features" on product_features for select to anon, authenticated using (true);
create policy "allow insert product_features" on product_features for insert to anon, authenticated with check (true);
create policy "allow update product_features" on product_features for update to anon, authenticated using (true) with check (true);
create policy "allow delete product_features" on product_features for delete to anon, authenticated using (true);

create policy "allow read product_media" on product_media for select to anon, authenticated using (true);
create policy "allow insert product_media" on product_media for insert to anon, authenticated with check (true);
create policy "allow update product_media" on product_media for update to anon, authenticated using (true) with check (true);
create policy "allow delete product_media" on product_media for delete to anon, authenticated using (true);

create policy "allow read product_option_groups" on product_option_groups for select to anon, authenticated using (true);
create policy "allow insert product_option_groups" on product_option_groups for insert to anon, authenticated with check (true);
create policy "allow update product_option_groups" on product_option_groups for update to anon, authenticated using (true) with check (true);
create policy "allow delete product_option_groups" on product_option_groups for delete to anon, authenticated using (true);

create policy "allow read product_option_values" on product_option_values for select to anon, authenticated using (true);
create policy "allow insert product_option_values" on product_option_values for insert to anon, authenticated with check (true);
create policy "allow update product_option_values" on product_option_values for update to anon, authenticated using (true) with check (true);
create policy "allow delete product_option_values" on product_option_values for delete to anon, authenticated using (true);

insert into brands (name_en, name_ar, slug) values
  ('Pilot', 'بايلوت', 'pilot'),
  ('Chouha', 'شوحه', 'chouha')
on conflict (slug) do nothing;

insert into categories (name_en, name_ar, slug) values
  ('Markers', 'أقلام سبورة', 'markers'),
  ('Pens', 'أقلام', 'pens'),
  ('Office Supplies', 'لوازم مكتبية', 'office-supplies')
on conflict (slug) do nothing;

insert into feature_definitions (key, label_en, label_ar, icon_name) values
  ('refillable', 'Refillable', 'قابل لإعادة التعبئة', 'Droplets'),
  ('xylene_free', 'Xylene Free', 'خالٍ من الزايلين', 'ShieldCheck'),
  ('dry_erase', 'Dry Erase', 'قابل للمسح الجاف', 'Eraser'),
  ('non_toxic', 'Non-Toxic', 'غير سام', 'Leaf'),
  ('recycled_materials', 'Recycled Materials', 'مواد معاد تدويرها', 'Recycle')
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values
  ('brand-assets', 'brand-assets', true),
  ('product-media', 'product-media', true)
on conflict (id) do nothing;

drop policy if exists "public read brand assets" on storage.objects;
drop policy if exists "public upload brand assets" on storage.objects;
drop policy if exists "public update brand assets" on storage.objects;
drop policy if exists "public read product media" on storage.objects;
drop policy if exists "public upload product media" on storage.objects;
drop policy if exists "public update product media" on storage.objects;

create policy "public read brand assets"
on storage.objects for select
to public
using (bucket_id = 'brand-assets');

create policy "public upload brand assets"
on storage.objects for insert
to public
with check (bucket_id = 'brand-assets');

create policy "public update brand assets"
on storage.objects for update
to public
using (bucket_id = 'brand-assets')
with check (bucket_id = 'brand-assets');

create policy "public read product media"
on storage.objects for select
to public
using (bucket_id = 'product-media');

create policy "public upload product media"
on storage.objects for insert
to public
with check (bucket_id = 'product-media');

create policy "public update product media"
on storage.objects for update
to public
using (bucket_id = 'product-media')
with check (bucket_id = 'product-media');