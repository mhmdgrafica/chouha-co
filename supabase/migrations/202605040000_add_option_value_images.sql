alter table public.product_option_values
  add column if not exists thumbnail_url text not null default '';

alter table public.product_option_values
  add column if not exists main_image_url text not null default '';
