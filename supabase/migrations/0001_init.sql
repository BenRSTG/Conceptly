-- Conceptly – initial schema
-- Konventionen: uuid PKs (gen_random_uuid), timestamptz, snake_case.
-- RLS: Produkte/Kategorien öffentlich lesbar (nur published). customers/addresses/
-- orders/customer_messages nur für den jeweiligen Kunden (auth.uid()) + Admin.
-- Newsletter-Tabellen nur Admin-Schreibzugriff, öffentlicher Insert nur für Neuanmeldung.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Admin-Rolle
-- ---------------------------------------------------------------------------
-- Es gibt keine eingebaute "Rolle" in Supabase Auth, die für App-Admins
-- geeignet ist. Wir pflegen daher eine explizite Admin-Tabelle und eine
-- SECURITY DEFINER Funktion, die in allen RLS-Policies referenziert wird.
create table admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from admin_users where user_id = auth.uid()
  );
$$;

-- Gemeinsamer updated_at-Trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Kategorien & Produkte
-- ---------------------------------------------------------------------------
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort_order integer not null default 0
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  short_description text,
  description text,
  category_id uuid references categories(id) on delete set null,
  base_price numeric(10,2) not null check (base_price >= 0),
  sale_price numeric(10,2) check (sale_price is null or sale_price >= 0),
  currency text not null default 'EUR',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  weight_grams integer check (weight_grams is null or weight_grams >= 0),
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  stock_tracking boolean not null default true,
  low_stock_threshold integer not null default 5,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_id_idx on products(category_id);
create index products_status_idx on products(status);
create index products_featured_idx on products(featured) where featured = true;
create trigger products_set_updated_at before update on products
  for each row execute function public.set_updated_at();

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false
);
create index product_images_product_id_idx on product_images(product_id);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_name text not null,
  sku text unique,
  price_override numeric(10,2) check (price_override is null or price_override >= 0),
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  attributes jsonb not null default '{}'::jsonb
);
create index product_variants_product_id_idx on product_variants(product_id);

-- ---------------------------------------------------------------------------
-- Kunden & Adressen
-- ---------------------------------------------------------------------------
create table customers (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  newsletter_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  label text,
  street text not null,
  house_number text not null,
  postal_code text not null,
  city text not null,
  country text not null default 'DE',
  is_default boolean not null default false
);
create index addresses_customer_id_idx on addresses(customer_id);

-- ---------------------------------------------------------------------------
-- Bestellungen
-- ---------------------------------------------------------------------------
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references customers(id) on delete set null,
  customer_email text not null,
  status text not null default 'pending' check (status in ('pending','paid','processing','shipped','fulfilled','cancelled','refunded')),
  payment_provider text check (payment_provider in ('stripe','paypal')),
  payment_reference text,
  subtotal numeric(10,2) not null check (subtotal >= 0),
  shipping_cost numeric(10,2) not null default 0 check (shipping_cost >= 0),
  tax_amount numeric(10,2) not null default 0 check (tax_amount >= 0),
  total numeric(10,2) not null check (total >= 0),
  shipping_address jsonb,
  billing_address jsonb,
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_customer_id_idx on orders(customer_id);
create index orders_status_idx on orders(status);
create unique index orders_payment_reference_idx on orders(payment_provider, payment_reference) where payment_reference is not null;
create trigger orders_set_updated_at before update on orders
  for each row execute function public.set_updated_at();

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  product_title_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);
create index order_items_order_id_idx on order_items(order_id);

create table stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  change_amount integer not null,
  reason text,
  order_id uuid references orders(id) on delete set null,
  created_at timestamptz not null default now()
);
create index stock_movements_product_id_idx on stock_movements(product_id);

-- ---------------------------------------------------------------------------
-- Reporting-Rohdaten
-- ---------------------------------------------------------------------------
create table shop_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('view_item','add_to_cart','begin_checkout','purchase')),
  product_id uuid references products(id) on delete set null,
  session_id text,
  customer_id uuid references customers(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index shop_events_type_created_idx on shop_events(event_type, created_at);
create index shop_events_product_id_idx on shop_events(product_id);

-- ---------------------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------------------
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'pending' check (status in ('pending','confirmed','unsubscribed')),
  confirm_token text,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  source text,
  created_at timestamptz not null default now()
);
create index newsletter_subscribers_status_idx on newsletter_subscribers(status);

create table newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  body_html text not null,
  status text not null default 'draft' check (status in ('draft','scheduled','sent')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  recipient_count integer,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Kunden-Messaging
-- ---------------------------------------------------------------------------
create table customer_messages (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  order_id uuid references orders(id) on delete set null,
  direction text not null check (direction in ('admin_to_customer','customer_to_admin')),
  subject text,
  body text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index customer_messages_customer_id_idx on customer_messages(customer_id);

-- ---------------------------------------------------------------------------
-- Instagram-Post-Assets
-- ---------------------------------------------------------------------------
create table instagram_post_assets (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  image_storage_path text not null,
  caption_text text not null,
  hashtags text[] not null default '{}',
  format text not null check (format in ('square','story')),
  created_at timestamptz not null default now()
);
create index instagram_post_assets_product_id_idx on instagram_post_assets(product_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table admin_users enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table customers enable row level security;
alter table addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table stock_movements enable row level security;
alter table shop_events enable row level security;
alter table newsletter_subscribers enable row level security;
alter table newsletter_campaigns enable row level security;
alter table customer_messages enable row level security;
alter table instagram_post_assets enable row level security;

-- admin_users: nur Admins dürfen lesen, niemand schreibt per API (nur via
-- Service-Role / Supabase Dashboard, um Privilegien-Eskalation zu verhindern).
create policy admin_users_select on admin_users for select using (public.is_admin());

-- categories: öffentlich lesbar, nur Admin schreibt
create policy categories_public_select on categories for select using (true);
create policy categories_admin_write on categories for all using (public.is_admin()) with check (public.is_admin());

-- products: öffentlich lesbar nur wenn published, Admin sieht/schreibt alles
create policy products_public_select on products for select using (status = 'published' or public.is_admin());
create policy products_admin_write on products for all using (public.is_admin()) with check (public.is_admin());

-- product_images/product_variants: sichtbar wenn zugehöriges Produkt sichtbar ist
create policy product_images_select on product_images for select using (
  exists (select 1 from products p where p.id = product_id and (p.status = 'published' or public.is_admin()))
);
create policy product_images_admin_write on product_images for all using (public.is_admin()) with check (public.is_admin());

create policy product_variants_select on product_variants for select using (
  exists (select 1 from products p where p.id = product_id and (p.status = 'published' or public.is_admin()))
);
create policy product_variants_admin_write on product_variants for all using (public.is_admin()) with check (public.is_admin());

-- customers: eigener Datensatz oder Admin
create policy customers_self_select on customers for select using (auth.uid() = id or public.is_admin());
create policy customers_self_update on customers for update using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());
create policy customers_self_insert on customers for insert with check (auth.uid() = id);
create policy customers_admin_delete on customers for delete using (public.is_admin());

-- addresses: eigene Adressen oder Admin
create policy addresses_owner_select on addresses for select using (
  exists (select 1 from customers c where c.id = customer_id and (c.id = auth.uid() or public.is_admin()))
);
create policy addresses_owner_write on addresses for all using (
  exists (select 1 from customers c where c.id = customer_id and (c.id = auth.uid() or public.is_admin()))
) with check (
  exists (select 1 from customers c where c.id = customer_id and (c.id = auth.uid() or public.is_admin()))
);

-- orders: eigene Bestellungen (per customer_id) oder Admin. Gast-Bestellungen
-- (customer_id null) sind nur für Admin sichtbar/verwaltbar; Erstellung läuft
-- ausschließlich über die Service-Role im Checkout-/Webhook-Backend.
create policy orders_owner_select on orders for select using (
  (customer_id is not null and customer_id = auth.uid()) or public.is_admin()
);
create policy orders_admin_write on orders for all using (public.is_admin()) with check (public.is_admin());

-- order_items: sichtbar wenn zugehörige Bestellung sichtbar ist
create policy order_items_select on order_items for select using (
  exists (
    select 1 from orders o where o.id = order_id
    and ((o.customer_id is not null and o.customer_id = auth.uid()) or public.is_admin())
  )
);
create policy order_items_admin_write on order_items for all using (public.is_admin()) with check (public.is_admin());

-- stock_movements: nur Admin
create policy stock_movements_admin on stock_movements for all using (public.is_admin()) with check (public.is_admin());

-- shop_events: öffentliches Insert (Tracking), Lesen nur Admin
create policy shop_events_public_insert on shop_events for insert with check (true);
create policy shop_events_admin_select on shop_events for select using (public.is_admin());

-- newsletter_subscribers: öffentliches Insert für Neuanmeldung, sonst nur Admin
create policy newsletter_subscribers_public_insert on newsletter_subscribers for insert with check (true);
create policy newsletter_subscribers_admin_select on newsletter_subscribers for select using (public.is_admin());
create policy newsletter_subscribers_admin_update on newsletter_subscribers for update using (public.is_admin()) with check (public.is_admin());
create policy newsletter_subscribers_admin_delete on newsletter_subscribers for delete using (public.is_admin());

-- newsletter_campaigns: nur Admin
create policy newsletter_campaigns_admin on newsletter_campaigns for all using (public.is_admin()) with check (public.is_admin());

-- customer_messages: eigene Nachrichten (lesen + eigene Antworten schreiben) oder Admin
create policy customer_messages_owner_select on customer_messages for select using (
  customer_id = auth.uid() or public.is_admin()
);
create policy customer_messages_owner_insert on customer_messages for insert with check (
  (customer_id = auth.uid() and direction = 'customer_to_admin') or public.is_admin()
);
create policy customer_messages_owner_update on customer_messages for update using (
  customer_id = auth.uid() or public.is_admin()
) with check (
  customer_id = auth.uid() or public.is_admin()
);

-- instagram_post_assets: nur Admin
create policy instagram_post_assets_admin on instagram_post_assets for all using (public.is_admin()) with check (public.is_admin());
