# Madeena Welfare Society

A bilingual (English and Urdu) public website foundation for Madeena Welfare Society, Bhatkal, built with Next.js, React, TypeScript, Tailwind CSS, and Lucide React.

## Current foundation

- Premium responsive public homepage at `/`
- True RTL Urdu landing page at `/ur`
- Public English and Urdu routes for About, Programs, Updates, Events, Gallery, Notices, Team, and Contact
- Database-backed detail routes for published Programs, Updates, and Events
- Protected admin CMS for Programs, Updates, Events, Gallery, Notices, Team, Messages, and Settings
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

Apply `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor. It creates the content tables, indexes, timestamps, RLS policies, and storage buckets. Public reads are limited to active/published records where appropriate. Admin writes require a Supabase Auth user whose `user_metadata.role` is exactly `admin`.

Create an administrator in Supabase Auth, then set the user metadata to:

```json
{ "role": "admin" }
```

Configure Auth URL settings with the local site URL and the deployed Vercel URL. The admin login is `/admin/login`.

The Gallery admin supports direct uploads to the `gallery` Supabase Storage bucket. It accepts JPEG, PNG, and WebP files up to 10 MB, saves the public Storage URL into the gallery table, and also keeps an image URL fallback. The migration includes `society-images`, `gallery`, `event-posters`, `documents`, and `team-photos` buckets with policies.

## Information still required

Before publishing dynamic content, collect the society's approved logo, official Urdu and English copy, address, phone, email, social links, team details, permitted photographs, and administrator account information. These should be entered through the CMS once the Supabase admin layer is connected.

## Deployment

Deploy to Vercel and add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` to the project's Environment Variables. Set `NEXT_PUBLIC_SITE_URL` to the production domain so sitemap, robots, canonical links, and sign-out redirects use the correct host.

## Routes

Public pages use `/en/...` and `/ur/...`. Admin pages use `/admin/...` and require authentication. `/sitemap.xml` and `/robots.txt` are generated automatically.
