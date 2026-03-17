-- supabase/migrations/0001_initial_schema.sql

create table restaurants (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  address         text not null,
  lat             double precision not null,
  lng             double precision not null,
  google_place_id text unique not null,
  cuisine_type    text,
  cover_photo_url text,
  created_at      timestamptz not null default now()
);

create table visits (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  visited_at      date not null default current_date,
  menu_item       text,
  food_photo_url  text,
  notes           text,
  created_at      timestamptz not null default now()
);

create table rankings (
  id              uuid primary key default uuid_generate_v4(),
  restaurant_id   uuid not null references restaurants(id) on delete cascade unique,
  rank_position   integer not null,
  updated_at      timestamptz not null default now(),
  constraint rankings_rank_position_unique unique (rank_position) deferrable initially deferred
);

create index rankings_position_idx on rankings(rank_position asc);
create index visits_restaurant_idx on visits(restaurant_id, visited_at desc);

-- RLS policies
alter table restaurants enable row level security;
alter table visits enable row level security;
alter table rankings enable row level security;

-- Public SELECT
create policy "Public can read restaurants" on restaurants for select using (true);
create policy "Public can read visits" on visits for select using (true);
create policy "Public can read rankings" on rankings for select using (true);

-- Authenticated INSERT/UPDATE/DELETE
create policy "Admins can insert restaurants" on restaurants for insert with check (auth.role() = 'authenticated');
create policy "Admins can update restaurants" on restaurants for update using (auth.role() = 'authenticated');
create policy "Admins can delete restaurants" on restaurants for delete using (auth.role() = 'authenticated');

create policy "Admins can insert visits" on visits for insert with check (auth.role() = 'authenticated');
create policy "Admins can update visits" on visits for update using (auth.role() = 'authenticated');
create policy "Admins can delete visits" on visits for delete using (auth.role() = 'authenticated');

create policy "Admins can insert rankings" on rankings for insert with check (auth.role() = 'authenticated');
create policy "Admins can update rankings" on rankings for update using (auth.role() = 'authenticated');
create policy "Admins can delete rankings" on rankings for delete using (auth.role() = 'authenticated');

-- Storage bucket for food photos (run in Supabase dashboard or separately)
-- insert into storage.buckets (id, name, public) values ('food-photos', 'food-photos', true);
-- create policy "Public can view food photos" on storage.objects for select using (bucket_id = 'food-photos');
-- create policy "Admins can upload food photos" on storage.objects for insert with check (bucket_id = 'food-photos' and auth.role() = 'authenticated');
-- create policy "Admins can delete food photos" on storage.objects for delete using (bucket_id = 'food-photos' and auth.role() = 'authenticated');
