alter table public.updates add column if not exists subtitle_en text not null default '';
alter table public.updates add column if not exists subtitle_ur text not null default '';
alter table public.updates add column if not exists author text not null default '';
alter table public.updates add column if not exists featured boolean not null default false;
alter table public.updates add column if not exists breaking boolean not null default false;
alter table public.updates add column if not exists pinned boolean not null default false;
create index if not exists updates_editorial_idx on public.updates (featured, breaking, pinned, published_at desc);

create table if not exists public.community_stories (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  title_en text not null, title_ur text not null default '', summary_en text not null default '', summary_ur text not null default '', content_en text not null default '', content_ur text not null default '', cover_image_url text, published_at timestamptz, is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
create table if not exists public.photo_stories (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  title_en text not null, title_ur text not null default '', description_en text not null default '', description_ur text not null default '', cover_image_url text, category text not null default 'community', photo_urls jsonb not null default '[]'::jsonb, published_at timestamptz, is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()), updated_at timestamptz not null default timezone('utc', now())
);
alter table public.community_stories enable row level security;
alter table public.photo_stories enable row level security;
create policy "public reads published community stories" on public.community_stories for select using (is_published = true or public.is_admin());
create policy "admins manage community stories" on public.community_stories for all using (public.is_admin()) with check (public.is_admin());
create policy "public reads published photo stories" on public.photo_stories for select using (is_published = true or public.is_admin());
create policy "admins manage photo stories" on public.photo_stories for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values
  ('news-images', 'news-images', true),
  ('photo-stories', 'photo-stories', true),
  ('site-assets', 'site-assets', true)
on conflict (id) do nothing;
create policy "public reads editorial media" on storage.objects for select using (bucket_id in ('news-images', 'photo-stories', 'site-assets'));
create policy "admins upload editorial media" on storage.objects for insert with check (public.is_admin() and bucket_id in ('news-images', 'photo-stories', 'site-assets'));
create policy "admins update editorial media" on storage.objects for update using (public.is_admin() and bucket_id in ('news-images', 'photo-stories', 'site-assets')) with check (public.is_admin() and bucket_id in ('news-images', 'photo-stories', 'site-assets'));
create policy "admins delete editorial media" on storage.objects for delete using (public.is_admin() and bucket_id in ('news-images', 'photo-stories', 'site-assets'));