# Databricks Life Sciences GTM

This project is a GTM artifact for building pipeline, landing pilots, and expanding Databricks inside life sciences accounts in the greater Northeast.

It is meant to show how to approach large pharma enterprise deals:
- how to create a credible first wedge
- how to build a champion path
- how to design the initial pilot
- how to handle security, procurement, and executive alignment
- how to map the expansion motion after the first win

## Target accounts

- **Johnson & Johnson** — Clinical trial analytics, RWE platform
- **Merck & Co** — R&D data lake, Mosaic AI for drug discovery
- **Bristol Myers Squibb** — Clinical data platform, trial analytics
- **Pfizer** — Medical Affairs, regulated document workflows
- **Sanofi** — Vaccines data platform, EU data residency

## What the artifact includes

- **Capture Plan** — The core account thesis, the first wedge, the pilot logic, and the competitive displacement plan
- **Stakeholder Map** — Who to build with, where to expect friction, and how to multi-thread the deal
- **Deal Plan** — The sequence to run: land, governance, exec alignment, commercial path, expansion
- **Deal Signals** — Working hypotheses to pressure-test in discovery and deal execution
- **Field Kit** — Materials to move the deal: executive briefs, meeting prep, emails, objection talk tracks, security responses, and battle cards

Today this is a **prototype**. Some account logic is modeled from metadata rather than pulled from real systems. The point is to show GTM judgment and operating style, with Databricks Foundation Model API used as an assistive layer for deal execution.

## Environment variables

Set these to enable chat and content generation:

- **DATABRICKS_OPENAI_BASE_URL** — Your Databricks workspace Foundation Model API base URL, e.g. `https://<workspace>.cloud.databricks.com/serving-endpoints/<endpoint>/openai/v1`
- **DATABRICKS_API_KEY** — Your Databricks API token (or add via the API Key button in the app)

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Switch accounts (J&J, Merck, BMS, Pfizer, Sanofi) from the header to see how the capture plan, stakeholder map, deal plan, and field kit shift by account.

## Tech stack

Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts. Databricks Foundation Model API (OpenAI-compatible). Prototype-grade, mostly client-side.

---

Built by George Trosley. If you'd like to explore this further, I'd love to talk.
