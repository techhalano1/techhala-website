-- TechHala store schema (Phase 1: orders + inventory + admin).
-- Apply with the Supabase SQL editor or the Management API. Idempotent.

create extension if not exists pgcrypto;

do $$ begin
  create type order_status as enum ('pending','confirmed','packed','shipping','delivered','cancelled','returned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('cod','bank');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status as enum ('unpaid','paid','refunded');
exception when duplicate_object then null; end $$;

do $$ begin
  create type movement_reason as enum ('purchase','sale','return','adjust');
exception when duplicate_object then null; end $$;

create table if not exists products (
  slug        text primary key,
  name        text not null,
  category    text not null,
  price       integer not null check (price >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists variants (
  id            uuid primary key default gen_random_uuid(),
  product_slug  text not null references products(slug) on delete cascade,
  color         text,
  color_name    text,
  sku           text not null unique,
  created_at    timestamptz not null default now(),
  unique nulls not distinct (product_slug, color)
);

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  code             text not null unique,
  access_token     text not null default encode(gen_random_bytes(16), 'hex'),
  status           order_status not null default 'pending',
  payment_method   payment_method not null,
  payment_status   payment_status not null default 'unpaid',
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  customer_address text not null,
  note             text,
  admin_note       text,
  subtotal         integer not null check (subtotal >= 0),
  shipping_fee     integer not null default 0 check (shipping_fee >= 0),
  total            integer not null check (total >= 0),
  locale           text not null default 'vi',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists orders_status_idx on orders(status, created_at desc);
create index if not exists orders_phone_idx on orders(customer_phone);

create table if not exists order_items (
  id            bigserial primary key,
  order_id      uuid not null references orders(id) on delete cascade,
  variant_id    uuid not null references variants(id),
  product_slug  text not null,
  product_name  text not null,
  color         text,
  unit_price    integer not null check (unit_price >= 0),
  quantity      integer not null check (quantity > 0),
  line_total    integer not null check (line_total >= 0)
);
create index if not exists order_items_order_idx on order_items(order_id);
create index if not exists order_items_variant_idx on order_items(variant_id);

create table if not exists order_events (
  id          bigserial primary key,
  order_id    uuid not null references orders(id) on delete cascade,
  from_status order_status,
  to_status   order_status not null,
  note        text,
  created_at  timestamptz not null default now()
);

create table if not exists payments (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  provider      text not null,
  amount        integer not null check (amount >= 0),
  status        payment_status not null default 'paid',
  provider_ref  text,
  paid_at       timestamptz not null default now(),
  created_at    timestamptz not null default now()
);

-- Raw incoming bank transactions pushed by the payment reconciler (SePay webhook).
-- (provider, provider_tx_id) is unique so webhook retries are idempotent.
create table if not exists bank_transactions (
  id              bigserial primary key,
  provider        text not null default 'sepay',
  provider_tx_id  text not null,
  gateway         text,
  account_number  text,
  transfer_type   text not null,
  amount          integer not null check (amount >= 0),
  content         text,
  reference_code  text,
  transaction_at  timestamptz,
  order_id        uuid references orders(id) on delete set null,
  matched_at      timestamptz,
  created_at      timestamptz not null default now(),
  unique (provider, provider_tx_id)
);
create index if not exists bank_transactions_order_idx on bank_transactions(order_id);
create index if not exists bank_transactions_created_idx on bank_transactions(created_at desc);

-- Customer pressed "I have transferred" on the tracking page (hint for manual reconciliation).
alter table orders add column if not exists transfer_reported_at timestamptz;

create table if not exists inventory_movements (
  id          bigserial primary key,
  variant_id  uuid not null references variants(id),
  qty         integer not null check (qty <> 0),
  reason      movement_reason not null,
  order_id    uuid references orders(id) on delete set null,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists inventory_movements_variant_idx on inventory_movements(variant_id);

-- Stock per variant: on_hand = all movements; reserved = open orders not yet packed.
create or replace view variant_stock as
select
  v.id as variant_id,
  v.product_slug,
  v.color,
  v.color_name,
  v.sku,
  p.name as product_name,
  p.category,
  p.price,
  p.active,
  coalesce((select sum(m.qty) from inventory_movements m where m.variant_id = v.id), 0)::int as on_hand,
  coalesce((
    select sum(oi.quantity)
    from order_items oi join orders o on o.id = oi.order_id
    where oi.variant_id = v.id and o.status in ('pending','confirmed')
  ), 0)::int as reserved,
  coalesce((
    select sum(oi.quantity)
    from order_items oi join orders o on o.id = oi.order_id
    where oi.variant_id = v.id and o.status in ('packed','shipping','delivered')
  ), 0)::int as sold
from variants v
join products p on p.slug = v.product_slug;

-- Status transition with inventory side effects, in one transaction.
--   -> packed            : deduct stock (sale)
--   packed+ -> cancelled : return stock
--   -> returned          : return stock (if it had been deducted)
create or replace function set_order_status(p_order_id uuid, p_status order_status, p_note text default null)
returns orders
language plpgsql
as $$
declare
  o orders;
  deducted boolean;
begin
  select * into o from orders where id = p_order_id for update;
  if not found then raise exception 'order not found'; end if;
  if o.status = p_status then return o; end if;

  deducted := o.status in ('packed','shipping','delivered');

  if p_status = 'packed' and not deducted then
    insert into inventory_movements (variant_id, qty, reason, order_id)
    select variant_id, -quantity, 'sale', p_order_id from order_items where order_id = p_order_id;
  elsif p_status in ('cancelled','returned') and deducted then
    insert into inventory_movements (variant_id, qty, reason, order_id)
    select variant_id, quantity, 'return', p_order_id from order_items where order_id = p_order_id;
  end if;

  insert into order_events (order_id, from_status, to_status, note) values (p_order_id, o.status, p_status, p_note);

  update orders set status = p_status, updated_at = now() where id = p_order_id returning * into o;
  return o;
end $$;

-- Product content managed from /admin/products. The code catalog (src/content) supplies defaults;
-- any value stored here overrides it. Products created in admin have source = 'admin'.
alter table products add column if not exists source            text not null default 'code';
alter table products add column if not exists compare_at_price  integer check (compare_at_price is null or compare_at_price >= 0);
alter table products add column if not exists free_shipping     boolean;
alter table products add column if not exists rating            numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5));
alter table products add column if not exists sold              integer check (sold is null or sold >= 0);
alter table products add column if not exists ages              text[];
alter table products add column if not exists colors            jsonb;
alter table products add column if not exists art               text;
alter table products add column if not exists tint              text;
alter table products add column if not exists video_url         text;
alter table products add column if not exists sort_order        integer not null default 1000;

create table if not exists product_translations (
  product_slug  text not null references products(slug) on delete cascade,
  locale        text not null check (locale in ('vi','en')),
  name          text,
  tagline       text,
  summary       text,
  audience      text,
  badge         text,
  age_label     text,
  highlights    jsonb,
  features      jsonb,
  specs         jsonb,
  in_box        jsonb,
  updated_at    timestamptz not null default now(),
  primary key (product_slug, locale)
);

-- Images / videos uploaded to the public `products` storage bucket.
create table if not exists product_media (
  id            bigserial primary key,
  product_slug  text not null references products(slug) on delete cascade,
  kind          text not null check (kind in ('image','video')),
  url           text not null,
  storage_path  text,
  color         text,
  alt           text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists product_media_product_idx on product_media(product_slug, sort_order);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 104857600, array['image/jpeg','image/png','image/webp','image/gif','image/avif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Lock everything down: the site talks to the DB with the service role only.
alter table products enable row level security;
alter table product_translations enable row level security;
alter table product_media enable row level security;
alter table variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_events enable row level security;
alter table payments enable row level security;
alter table bank_transactions enable row level security;
alter table inventory_movements enable row level security;
