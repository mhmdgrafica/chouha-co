alter table public.product_colors
  add column if not exists is_default boolean not null default false;

create index if not exists idx_product_colors_product_id
  on public.product_colors(product_id);

create unique index if not exists uq_product_default_color
  on public.product_colors(product_id)
  where is_default = true;

with ranked_colors as (
  select
    id,
    product_id,
    row_number() over (
      partition by product_id
      order by position asc, created_at asc, id asc
    ) as color_rank,
    bool_or(is_default) over (partition by product_id) as has_default
  from public.product_colors
)
update public.product_colors as product_colors
set is_default = true
from ranked_colors
where product_colors.id = ranked_colors.id
  and ranked_colors.color_rank = 1
  and ranked_colors.has_default = false;

create table if not exists public.product_option_groups (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name_en text not null,
  name_ar text not null,
  slug text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_product_option_groups_product_id
  on public.product_option_groups(product_id);

create unique index if not exists uq_product_option_group_slug
  on public.product_option_groups(product_id, slug);

drop trigger if exists trg_product_option_groups_updated_at on public.product_option_groups;
create trigger trg_product_option_groups_updated_at
before update on public.product_option_groups
for each row execute function public.set_updated_at();

create table if not exists public.product_option_values (
  id uuid primary key default gen_random_uuid(),
  option_group_id uuid not null references public.product_option_groups(id) on delete cascade,
  value_en text not null,
  value_ar text not null,
  option_code text not null default '',
  position int not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_option_values_group_id
  on public.product_option_values(option_group_id);

create unique index if not exists uq_product_option_default_value
  on public.product_option_values(option_group_id)
  where is_default = true;

alter table public.product_option_groups enable row level security;
alter table public.product_option_values enable row level security;

drop policy if exists "allow read product_option_groups" on public.product_option_groups;
drop policy if exists "allow insert product_option_groups" on public.product_option_groups;
drop policy if exists "allow update product_option_groups" on public.product_option_groups;
drop policy if exists "allow delete product_option_groups" on public.product_option_groups;

drop policy if exists "allow read product_option_values" on public.product_option_values;
drop policy if exists "allow insert product_option_values" on public.product_option_values;
drop policy if exists "allow update product_option_values" on public.product_option_values;
drop policy if exists "allow delete product_option_values" on public.product_option_values;

create policy "allow read product_option_groups"
on public.product_option_groups for select to anon, authenticated
using (true);

create policy "allow insert product_option_groups"
on public.product_option_groups for insert to anon, authenticated
with check (true);

create policy "allow update product_option_groups"
on public.product_option_groups for update to anon, authenticated
using (true)
with check (true);

create policy "allow delete product_option_groups"
on public.product_option_groups for delete to anon, authenticated
using (true);

create policy "allow read product_option_values"
on public.product_option_values for select to anon, authenticated
using (true);

create policy "allow insert product_option_values"
on public.product_option_values for insert to anon, authenticated
with check (true);

create policy "allow update product_option_values"
on public.product_option_values for update to anon, authenticated
using (true)
with check (true);

create policy "allow delete product_option_values"
on public.product_option_values for delete to anon, authenticated
using (true);
