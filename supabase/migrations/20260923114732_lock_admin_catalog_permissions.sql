-- Public users can read the published catalog. Only app_metadata.role=admin
-- may mutate catalog rows or upload media.

do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and policyname like 'allow %'
  loop
    execute format('drop policy if exists %I on %I.%I', policy_record.policyname, policy_record.schemaname, policy_record.tablename);
  end loop;
end $$;

create policy "admin manage brands" on public.brands for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage categories" on public.categories for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage feature definitions" on public.feature_definitions for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage products" on public.products for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage product highlights" on public.product_highlights for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage product colors" on public.product_colors for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage product features" on public.product_features for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage product media" on public.product_media for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage product option groups" on public.product_option_groups for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin manage product option values" on public.product_option_values for all to authenticated
  using ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "public read published products" on public.products for select to anon, authenticated
  using (is_active = true);
create policy "public read active product highlights" on public.product_highlights for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active));
create policy "public read active product colors" on public.product_colors for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active));
create policy "public read active product features" on public.product_features for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active));
create policy "public read active product media" on public.product_media for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active));
create policy "public read active product option groups" on public.product_option_groups for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.is_active));
create policy "public read active product option values" on public.product_option_values for select to anon, authenticated
  using (exists (select 1 from public.product_option_groups g join public.products p on p.id = g.product_id where g.id = option_group_id and p.is_active));

drop policy if exists "public upload brand assets" on storage.objects;
drop policy if exists "public update brand assets" on storage.objects;
drop policy if exists "public upload product media" on storage.objects;
drop policy if exists "public update product media" on storage.objects;

create policy "admin upload brand assets" on storage.objects for insert to authenticated
  with check (bucket_id = 'brand-assets' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin update brand assets" on storage.objects for update to authenticated
  using (bucket_id = 'brand-assets' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'brand-assets' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin delete brand assets" on storage.objects for delete to authenticated
  using (bucket_id = 'brand-assets' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin upload product media" on storage.objects for insert to authenticated
  with check (bucket_id = 'product-media' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin update product media" on storage.objects for update to authenticated
  using (bucket_id = 'product-media' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check (bucket_id = 'product-media' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
create policy "admin delete product media" on storage.objects for delete to authenticated
  using (bucket_id = 'product-media' and (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
