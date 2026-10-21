<<<<<<< HEAD
# Madeena Welfare Society

A bilingual (English and Urdu) public website foundation for Madeena Welfare Society, Bhatkal, built with Next.js, React, TypeScript, Tailwind CSS, and Lucide React.

## Current platform

- Cinematic, database-aware community newsroom homepage at `/` and `/en`
- True RTL Urdu newsroom at `/ur`
- Featured story, latest ticker, Today in Bhatkal counters, editorial story grid, What's Happening timeline, notices, photo stories, programs and newsroom footer
- Public news archive at `/en/news` and `/ur/news`
- Website search at `/en/search` and `/ur/search`, covering updates, events, notices and programs
- Public English and Urdu routes for About, Programs, Updates, Events, Gallery, Notices, Team, and Contact
- Database-backed detail routes for published Programs, Updates, and Events
- Protected admin CMS for Programs, Updates, Events, Gallery, Notices, Team, Messages, and Settings
- Protected admin CMS for editorial flags, Community Stories, and Photo Stories
- Accessible semantic markup, responsive layouts, metadata, and placeholder contact details
- Production-ready Next.js configuration and `.env.local.example`

Content not yet officially supplied is deliberately marked as sample or placeholder content. No official phone numbers, addresses, people, registration details, achievements, or statistics have been invented.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify production output

```bash
npm run lint
npm run build
npm run start
```

## Supabase integration

Create `.env.local` from `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never expose a service-role key in client code or commit `.env.local`.

Apply `supabase/migrations/001_initial_schema.sql` and then `supabase/migrations/002_editorial_platform.sql` in the Supabase SQL editor. The second migration adds featured, breaking, pinned, author and subtitle fields to updates, community story and photo story tables with RLS, and the `news-images`, `photo-stories`, and `site-assets` storage buckets with admin-only write policies. Public reads are limited to active/published records where appropriate. Admin writes require a Supabase Auth user whose `user_metadata.role` is exactly `admin`.

Create an administrator in Supabase Auth, then set the user metadata to:

```json
{ "role": "admin" }
```

Configure Auth URL settings with the local site URL and the deployed Vercel URL. The admin login is `/admin/login`.

The Gallery admin supports direct uploads to the `gallery` Supabase Storage bucket. It accepts JPEG, PNG, and WebP files up to 10 MB, saves the public Storage URL into the gallery table, and also keeps an image URL fallback. The migration includes `society-images`, `gallery`, `event-posters`, `documents`, and `team-photos` buckets with policies.

When Supabase has no published records, the public newsroom displays clearly labeled `DEMO CONTENT` so the layout can be reviewed without implying official achievements, statistics, contacts or events. Replace demo records through the admin CMS before launch.

## Information still required

Before publishing dynamic content, collect the society's approved logo, official Urdu and English copy, address, phone, email, social links, team details, permitted photographs, and administrator account information. These should be entered through the CMS once the Supabase admin layer is connected.

## Deployment

Deploy to Vercel and add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` to the project's Environment Variables. Set `NEXT_PUBLIC_SITE_URL` to the production domain so sitemap, robots, canonical links, and sign-out redirects use the correct host.

## Routes

Public pages use `/en/...` and `/ur/...`. Admin pages use `/admin/...` and require authentication. `/sitemap.xml` and `/robots.txt` are generated automatically.
=======
# Demo
Demo website
>>>>>>> 88cd1334cf24a3f4715bc32665170a48b9d4e365
