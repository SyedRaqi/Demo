create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select coalesce((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', false);
$$;

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ur text not null default '',
  description_en text not null default '',
  description_ur text not null default '',
  icon text not null default 'heart-handshake',
  image_url text,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ur text not null default '',
  summary_en text not null default '',
  summary_ur text not null default '',
  content_en text not null default '',
  content_ur text not null default '',
  cover_image_url text,
  category text not null default 'announcement',
  location_en text not null default '',
  location_ur text not null default '',
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ur text not null default '',
  description_en text not null default '',
  description_ur text not null default '',
  event_date date not null,
  event_time text not null default '',
  location_en text not null default '',
  location_ur text not null default '',
  poster_url text,
  status text not null default 'upcoming' check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ur text not null default '',
  content_en text not null default '',
  content_ur text not null default '',
  attachment_url text,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  category text not null default 'other',
  title_en text not null default '',
  title_ur text not null default '',
  description_en text not null default '',
  description_ur text not null default '',
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ur text not null default '',
  designation_en text not null default '',
  designation_ur text not null default '',
  bio_en text not null default '',
  bio_ur text not null default '',
  photo_url text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  value_en text not null default '',
  value_ur text not null default '',
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists updates_published_idx on public.updates (is_published, published_at desc);
create index if not exists events_date_idx on public.events (event_date, status);
create index if not exists gallery_category_idx on public.gallery (category, display_order);
create index if not exists messages_read_idx on public.contact_messages (is_read, created_at desc);

create trigger programs_updated_at before update on public.programs for each row execute function public.set_updated_at();
create trigger updates_updated_at before update on public.updates for each row execute function public.set_updated_at();
create trigger events_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger notices_updated_at before update on public.notices for each row execute function public.set_updated_at();
create trigger team_updated_at before update on public.team_members for each row execute function public.set_updated_at();
create trigger settings_updated_at before update on public.site_settings for each row execute function public.set_updated_at();

alter table public.programs enable row level security;
alter table public.updates enable row level security;
alter table public.events enable row level security;
alter table public.notices enable row level security;
alter table public.gallery enable row level security;
alter table public.team_members enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

create policy "public reads active programs" on public.programs for select using (is_active = true or public.is_admin());
create policy "public reads published updates" on public.updates for select using (is_published = true or public.is_admin());
create policy "public reads events" on public.events for select using (true);
create policy "public reads published notices" on public.notices for select using (is_published = true or public.is_admin());
create policy "public reads gallery" on public.gallery for select using (is_published = true or public.is_admin());
create policy "public reads active team" on public.team_members for select using (is_active = true or public.is_admin());
create policy "public reads settings" on public.site_settings for select using (true);
create policy "public submits messages" on public.contact_messages for insert with check (true);
create policy "admins manage programs" on public.programs for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage updates" on public.updates for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage notices" on public.notices for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage gallery" on public.gallery for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage team" on public.team_members for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage messages" on public.contact_messages for select, update, delete using (public.is_admin()) with check (public.is_admin());
create policy "admins manage settings" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values
  ('society-images', 'society-images', true),
  ('gallery', 'gallery', true),
  ('event-posters', 'event-posters', true),
  ('documents', 'documents', false),
  ('team-photos', 'team-photos', true)
on conflict (id) do nothing;

create policy "public media reads" on storage.objects for select using (bucket_id in ('society-images', 'gallery', 'event-posters', 'team-photos'));
create policy "admins upload media" on storage.objects for insert with check (public.is_admin());
create policy "admins update media" on storage.objects for update using (public.is_admin()) with check (public.is_admin());
create policy "admins delete media" on storage.objects for delete using (public.is_admin());
