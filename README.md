# GradTrace

Realistic Singapore company match lists for fresh graduates. GradTrace scores
real local employers against your education, skills, internship experience and
visa status, then builds a 4-week action plan around the companies where you are
actually competitive, instead of the ones you have near-zero chance at.

It is built for the people generic career advice ignores: polytechnic diploma
holders, and foreign graduates working out S Pass and EP eligibility.

## How it works

1. You fill in a short profile: institution, visa status, skills, internships.
2. A deterministic algorithm scores every company in the database from 0 to 100
   across four dimensions (institution fit, visa compatibility, skills, experience).
   No AI touches the score, so every result is fully explainable.
3. Claude turns that match result into a concrete week-by-week action plan.

## Tech stack

- Next.js 14 (App Router) and TypeScript (strict)
- Supabase (Postgres with RLS) for data and auth
- Claude API (`claude-sonnet-4-6`) for the action plan only
- Recharts for the score distribution and skill-gap views
- Tailwind CSS
- Deploys on Vercel

## Project layout

```
app/            App Router pages and API routes
  (auth)/       login and signup
  (app)/        authenticated shell: onboarding, dashboard, companies, report, profile
  (public)/     public salary tool (no auth)
  api/          profile, match, action-plan, companies
components/     onboarding, dashboard, companies, salary, layout
lib/
  matching/     calculate-score.ts, the core scoring algorithm
  claude/       generate-action-plan.ts
  supabase/     client, server and Database types
  types.ts      shared domain types
supabase/migrations/
  001_initial_schema.sql
  002_seed_companies.sql   curated Singapore company data
```

## Local setup

```bash
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev
```

Required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the two migrations in `supabase/migrations` against your Supabase project,
in order, to create the schema and seed the company database.

## The company database is the moat

Company data is hand-curated, not scraped. It needs maintenance:

- Monthly: check the MOM S Pass minimum salary after each Budget.
- Quarterly: verify the top 20 companies against recent job postings.
- Annually: audit salary data against the NodeFlair salary report.

Salary figures are conservative, fixed-monthly SGD for entry-level roles.

## Scripts

```bash
npm run dev        # local dev server
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
```
