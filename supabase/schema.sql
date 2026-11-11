-- ============================================================================
-- ORBITA Store — Supabase schema
-- Run this once in your Supabase project: Dashboard → SQL Editor → New query.
-- Safe to re-run (uses IF NOT EXISTS / CREATE OR REPLACE).
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_first_name text,
  customer_last_name text,
  customer_phone text,
  shipping_address text not null,
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_city text,
  shipping_state text,
  shipping_zip text,
  shipping_country text,
  total_amount numeric(10, 2) not null default 0 check (total_amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  tracking_number text,
  carrier text,
  tracking_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text,
  product_name text not null,
  variant text,
  quantity integer not null default 1 check (quantity > 0),
  price numeric(10, 2) not null default 0 check (price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  old_status text,
  new_status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_email_idx on public.orders (lower(customer_email));
create index if not exists orders_status_idx on public.orders (status);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_status_history_order_id_idx
  on public.order_status_history (order_id, created_at);

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Admin login helper
-- SECURITY DEFINER keeps admin_users / password hashes out of the browser.
-- The storefront calls: supabase.rpc('verify_admin_password', { input_email, input_password })
-- ----------------------------------------------------------------------------

create or replace function public.verify_admin_password(input_email text, input_password text)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions, pg_catalog
as $$
declare
  admin_row public.admin_users;
begin
  select * into admin_row
  from public.admin_users
  where lower(email) = lower(trim(input_email))
  limit 1;

  if admin_row.id is null then
    return null;
  end if;

  if admin_row.password_hash = crypt(input_password, admin_row.password_hash) then
    return jsonb_build_object(
      'id', admin_row.id,
      'email', admin_row.email,
      'name', coalesce(admin_row.name, 'ORBITA Admin')
    );
  end if;

  return null;
end;
$$;

revoke all on function public.verify_admin_password(text, text) from public;
grant execute on function public.verify_admin_password(text, text) to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Row Level Security
--
-- IMPORTANT: the current storefront talks to Supabase with the public anon key
-- only (custom admin login, no Supabase Auth session). For the admin panel and
-- order tracking to work, anon needs read/insert/update access on these tables.
-- That means anyone holding the public key could read or modify orders.
-- For a real production launch, switch the admin panel to Supabase Auth and
-- replace the permissive policies below with role-based ones.
-- ----------------------------------------------------------------------------

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.admin_users enable row level security;

-- orders
drop policy if exists "orders_select_anon" on public.orders;
create policy "orders_select_anon" on public.orders
  for select to anon, authenticated using (true);

drop policy if exists "orders_insert_anon" on public.orders;
create policy "orders_insert_anon" on public.orders
  for insert to anon, authenticated with check (true);

drop policy if exists "orders_update_anon" on public.orders;
create policy "orders_update_anon" on public.orders
  for update to anon, authenticated using (true) with check (true);

-- order_items
drop policy if exists "order_items_select_anon" on public.order_items;
create policy "order_items_select_anon" on public.order_items
  for select to anon, authenticated using (true);

drop policy if exists "order_items_insert_anon" on public.order_items;
create policy "order_items_insert_anon" on public.order_items
  for insert to anon, authenticated with check (true);

-- order_status_history
drop policy if exists "history_select_anon" on public.order_status_history;
create policy "history_select_anon" on public.order_status_history
  for select to anon, authenticated using (true);

drop policy if exists "history_insert_anon" on public.order_status_history;
create policy "history_insert_anon" on public.order_status_history
  for insert to anon, authenticated with check (true);

-- admin_users: no policies on purpose. Only the SECURITY DEFINER function
-- above can read it, so password hashes never reach the browser.

-- ----------------------------------------------------------------------------
-- Grants
-- ----------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.orders to anon, authenticated;
grant select, insert on public.order_items to anon, authenticated;
grant select, insert on public.order_status_history to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Create the first admin account
-- 1) Replace the email / name / password below.
-- 2) Uncomment the block and run it (or run just the INSERT).
-- 3) Log in at /admin/login.
-- ----------------------------------------------------------------------------

-- insert into public.admin_users (email, name, password_hash)
-- values (
--   'admin@orbita.com',
--   'ORBITA Admin',
--   crypt('ChangeMe123!', gen_salt('bf'))
-- )
-- on conflict (email) do update
--   set password_hash = excluded.password_hash,
--       name = excluded.name;

-- Refresh PostgREST's schema cache so the new tables are queryable immediately.
notify pgrst, 'reload schema';
