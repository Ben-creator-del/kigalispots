-- KigaliSpots: run this once in your Supabase project's SQL Editor.
-- Creates the categories, neighborhoods and venues tables the app reads,
-- lets anyone read them (public directory), and adds the sample spots.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id uuid references public.categories(id) on delete set null,
  neighborhood_id uuid references public.neighborhoods(id) on delete set null,
  tagline text,
  description text,
  rating numeric(2,1) check (rating between 0 and 5),
  price_level smallint check (price_level between 1 and 3),
  hours text,
  address text,
  tags text[] not null default '{}',
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.venues enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories for select to anon, authenticated using (true);
drop policy if exists "Public can read neighborhoods" on public.neighborhoods;
create policy "Public can read neighborhoods" on public.neighborhoods for select to anon, authenticated using (true);
drop policy if exists "Public can read venues" on public.venues;
create policy "Public can read venues" on public.venues for select to anon, authenticated using (true);

grant select on public.categories, public.neighborhoods, public.venues to anon, authenticated;

-- Sample data
insert into public.categories (slug, name) values
  ('cafe', 'Cafes'), ('restaurant', 'Restaurants'), ('hangout', 'Hangouts')
on conflict (slug) do nothing;

insert into public.neighborhoods (slug, name) values
  ('downtown', 'Downtown'), ('kacyiru', 'Kacyiru'), ('kimihurura', 'Kimihurura'),
  ('kimironko', 'Kimironko'), ('kiyovu', 'Kiyovu'), ('nyamirambo', 'Nyamirambo'),
  ('nyarutarama', 'Nyarutarama'), ('remera', 'Remera')
on conflict (slug) do nothing;

insert into public.venues
  (slug, name, category_id, neighborhood_id, tagline, description, rating, price_level, hours, address, tags)
values
  ('umuhanda-roasters', 'Umuhanda Roasters', (select id from public.categories where slug = 'cafe'), (select id from public.neighborhoods where slug = 'kiyovu'), 'Single-origin Rwandan pour-overs with a hillside view.', 'A small roastery bar where baristas brew beans from Huye and Nyamasheke to order. Grab a window seat, a slow V60 and watch the city wake up across the valley.', 4.8, 2, 'Daily · 7:00 – 19:00', 'KN 14 Ave, Kiyovu', array['Specialty coffee', 'Wi-Fi', 'Views']),
  ('garden-terrace', 'The Garden Terrace', (select id from public.categories where slug = 'cafe'), (select id from public.neighborhoods where slug = 'kimihurura'), 'Croissants, cappuccinos and palm-shaded mornings.', 'A leafy terrace café with fresh pastries baked in-house every morning. Popular for long brunches and laptop afternoons under the umbrellas.', 4.6, 2, 'Mon–Sat · 7:30 – 18:00', 'KG 7 Ave, Kimihurura', array['Brunch', 'Outdoor seating', 'Pastries']),
  ('inzozi-coffee', 'Inzozi Coffee House', (select id from public.categories where slug = 'cafe'), (select id from public.neighborhoods where slug = 'nyamirambo'), 'Neighbourhood café with the best chai latte in town.', 'Colourful, friendly and always buzzing. Inzozi serves strong coffee, African tea and sambusas at prices that keep regulars coming back daily.', 4.5, 1, 'Daily · 6:30 – 21:00', 'KN 2 Rd, Nyamirambo', array['Budget friendly', 'Tea', 'Local favourite']),
  ('isoko-kitchen', 'Isoko Kitchen', (select id from public.categories where slug = 'restaurant'), (select id from public.neighborhoods where slug = 'kacyiru'), 'Modern Rwandan plates: brochettes, isombe and plantain.', 'Classic Rwandan flavours served with a modern touch. Order the goat brochettes with fried plantain and finish with a passion-fruit tart.', 4.7, 2, 'Tue–Sun · 12:00 – 23:00', 'KG 9 Ave, Kacyiru', array['Rwandan', 'Grill', 'Dinner']),
  ('horizon-dining', 'Horizon Dining Room', (select id from public.categories where slug = 'restaurant'), (select id from public.neighborhoods where slug = 'nyarutarama'), 'Sunset tasting menus behind floor-to-ceiling glass.', 'An elegant dining room with sweeping views over the hills. Seasonal tasting menus pair local produce with an East African wine list.', 4.9, 3, 'Wed–Sun · 18:00 – 23:30', 'KG 303 St, Nyarutarama', array['Fine dining', 'Date night', 'Views']),
  ('mama-kigali', 'Mama Kigali Buffet', (select id from public.categories where slug = 'restaurant'), (select id from public.neighborhoods where slug = 'downtown'), 'Hearty lunch buffet loved by office crowds.', 'Pile your plate with beans, rice, matoke, cassava leaves and grilled fish. Fast, filling and one of the best-value lunches downtown.', 4.4, 1, 'Mon–Sat · 11:30 – 15:30', 'KN 4 Ave, Downtown', array['Buffet', 'Lunch', 'Budget friendly']),
  ('akagera-grill', 'Akagera Grill House', (select id from public.categories where slug = 'restaurant'), (select id from public.neighborhoods where slug = 'remera'), 'Tilapia, chips and cold drinks by the stadium.', 'A relaxed grill house where whole tilapia comes straight off the coals. Busy on match days, easy-going the rest of the week.', 4.3, 2, 'Daily · 11:00 – 00:00', 'KG 17 Ave, Remera', array['Grill', 'Fish', 'Groups']),
  ('skyline-rooftop', 'Skyline Rooftop', (select id from public.categories where slug = 'hangout'), (select id from public.neighborhoods where slug = 'kimihurura'), 'String lights, city views and weekend DJ sets.', 'Kigali''s go-to rooftop for sundowners. Cosy lounge corners, cocktails made with local fruit and a DJ spinning Afrobeats every Friday and Saturday.', 4.7, 3, 'Thu–Sun · 17:00 – 02:00', 'KG 5 Ave, Kimihurura', array['Rooftop', 'Cocktails', 'Nightlife']),
  ('ikirere-courtyard', 'Ikirere Courtyard', (select id from public.categories where slug = 'hangout'), (select id from public.neighborhoods where slug = 'kiyovu'), 'Murals, live acoustic music and open-air benches.', 'An open-air arts courtyard with rotating murals and live acoustic sessions every afternoon. Bring friends, grab a juice and stay for the music.', 4.6, 1, 'Daily · 10:00 – 22:00', 'KN 25 St, Kiyovu', array['Live music', 'Art', 'Outdoor']),
  ('kimironko-lounge', 'Kimironko Night Lounge', (select id from public.categories where slug = 'hangout'), (select id from public.neighborhoods where slug = 'kimironko'), 'Board games, pool tables and late-night bites.', 'A laid-back lounge near the market with pool tables, board games and a kitchen that serves brochettes until late. Great for big groups.', 4.2, 2, 'Daily · 16:00 – 01:00', 'KG 11 Ave, Kimironko', array['Games', 'Groups', 'Late night'])
on conflict (slug) do nothing;

-- Make PostgREST pick up the new tables right away
notify pgrst, 'reload schema';
