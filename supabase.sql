-- Run this in Supabase SQL Editor.
-- Your browser code uses only the ANON/PUBLISHABLE key.
-- Do NOT expose service_role/secret keys.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null default 0,
  description text default '',
  image_url text default '',
  image_path text default '',
  category text default 'অন্যান্য',
  stock integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Customers can read products.
drop policy if exists "Public can view products" on public.products;
create policy "Public can view products"
on public.products for select
to anon, authenticated
using (true);

-- Logged-in admin can manage products.
drop policy if exists "Authenticated can insert products" on public.products;
create policy "Authenticated can insert products"
on public.products for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update products" on public.products;
create policy "Authenticated can update products"
on public.products for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete products" on public.products;
create policy "Authenticated can delete products"
on public.products for delete
to authenticated
using (true);

-- Storage bucket: create a PUBLIC bucket named products in Supabase Dashboard.
-- Storage policies below allow logged-in users to upload/update/delete objects.
-- Public image viewing is handled by the public bucket setting.

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'products');

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images"
on storage.objects for update
to authenticated
using (bucket_id = 'products')
with check (bucket_id = 'products');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
on storage.objects for delete
to authenticated
using (bucket_id = 'products');
