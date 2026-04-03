# Snowflake GTM Command Center

Internal GTM hub for Snowflake Account Executives. This territory is heavy on **existing customers** — the job is to **land net-new logos** and **aggressively expand consumption and use cases** for Snowflake within these accounts. This project provides a single place for platform narrative, deal playbooks, field kit, and war room tools.

## What’s inside

- **Platform Overview** — AI Data Cloud pillars, key metrics, and strategic message
- **Why Snowflake, Why Now** — Strategic transition, timeline highlights, buyer expansion
- **War Room** — Account-centric view (accounts N/A until configured)
- **Account Intelligence, Pipeline, Deal Playbook, Deal Progression, Account Log**
- **Stakeholder Map, Deal Plan**
- **First 90 Days, Deal Signals, Field Kit**
- **Use Case Library, ROI Calculator, Territory Engine**
- **Platform vs Alternatives** — Snowflake vs Databricks, BigQuery, Redshift

Content is aligned with Snowflake’s position as the **governed operating system for enterprise AI**: Cortex, Snowflake Intelligence, Cortex Code, MCP, Snowflake Postgres, Horizon, and Observe.

## Accounts

- **Territory Intelligence map** (`/`) — customer book in `data/territory-default-accounts.ts`; edits persist in the browser and optionally **sync to Supabase** (see below).
- **Operating system / war room** — configure enterprise accounts in `data/accounts.ts` (`defaultAccountId`).

## Environment variables

**Chat / AI**

- **ANTHROPIC_API_KEY** — Claude (or add via the API Key control in the app).

**Territory map cloud sync (optional)**

1. In [Supabase](https://supabase.com), create a project and run `supabase/migrations/001_territory_book.sql` in the SQL editor.
2. Set:

- **NEXT_PUBLIC_SUPABASE_URL** — Project URL.
- **SUPABASE_SERVICE_ROLE_KEY** — Service role key (server-only; never expose in client code). Used by `app/api/territory` to read/write the book.

If these are unset, the map still works with **local storage only**. When set, the app loads the book from Supabase when a saved row exists, and saves after each edit.

`POST /api/territory` is not user-authenticated; use a private deploy or add your own auth if the app is on the public internet.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts. Optional Claude API for chat and generation. Optional Supabase sync for the territory map; otherwise local storage.

## Deploy & push to GitHub

Repo: **https://github.com/georgetrosley-hub/snowflake**

```bash
git remote add origin https://github.com/georgetrosley-hub/snowflake.git
# or, if origin exists: git remote set-url origin https://github.com/georgetrosley-hub/snowflake.git
git add -A
git commit -m "Rebrand to Snowflake GTM Command Center for internal AEs"
git push -u origin main
```

(Use `master` if your default branch is `master`.)

---

Built for Snowflake internal GTM. Platform narrative and section ideas informed by the Snowflake research pack and snowflake.com.
