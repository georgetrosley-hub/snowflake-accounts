# Claude Enterprise Expansion Engine

A prototype of what Claude-powered enterprise GTM could look like: agent-assisted discovery, competitive intel, and human oversight—not automation that replaces the rep.

## What this is

Nine specialized agents (Territory Intelligence, Research, Competitive Strategy, Technical Architecture, Security & Compliance, Legal & Procurement, Executive Narrative, Expansion Strategy, Human Oversight) work in the background to surface signals, recommendations, and approvals. The AE stays in control: approve, modify, or reject.

- **Command Center** — Account overview, land/expansion metrics, pipeline forecast, and a live recommendation
- **Agent Activity** — Real-time stream of events (champions identified, blockers, competitor pressure)
- **Approval Queue** — Human-in-the-loop for high-impact decisions
- **Competitive Intel** — Account-specific competitor risk and positioning
- **Architecture** — Deployment readiness and integration planning
- **Org Expansion Map** — Department-level expansion paths and ARR potential
- **Deal Timeline** — Stage progression and projected value
- **Exec Narrative** — Account-level story (why now, why Claude, next meeting)

Today this runs on **deterministic simulation** (no backend, no API). The thesis: with the Claude API and real data (CRM, calls, documents), these agents could power a true enterprise sales command center.

## What I'd build next

1. **Claude API integration** — Replace simulation with live reasoning. Agents pull real account signals from CRM, call summaries, and documents.
2. **Pipeline sync** — Connect to Salesforce/HubSpot. Auto-enrich deals with org structure, competitive intel, and risk scores.
3. **Governance & audit trail** — Every agent action logged. Human-in-the-loop preserved. Compliance-ready for regulated industries.
4. **Executive briefing mode** — One-click synthesis for QBRs and exec sponsor calls.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Switch accounts (JPMorgan, Pfizer, Comcast, etc.) from the header to see account-specific narratives, events, and approvals.

## Tech stack

Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts. Client-side only.

---

Built by George Trosley. If you'd like to explore this further, I'd love to talk.
