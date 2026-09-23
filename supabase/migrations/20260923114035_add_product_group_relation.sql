-- Keep the main category and the nested product group as separate relations.
-- Existing category_id data remains untouched.

alter table public.products
  add column if not exists group_id uuid references public.categories(id) on delete set null;

create index if not exists idx_products_group_id
  on public.products (group_id);
