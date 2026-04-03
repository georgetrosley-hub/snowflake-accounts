import { BASE_SYSTEM_PROMPT } from "./base";

export const CONTENT_PROMPTS: Record<string, string> = {
  battle_card: `${BASE_SYSTEM_PROMPT}

Generate a dynamic, account-specific competitive battle card. Structure it as:

## [Competitor Name] vs Snowflake — Battle Card for [Account]

**Their Pitch:** What the competitor will say to this customer
**Their Strengths:** Be honest about where they're strong
**Their Weaknesses:** Where they fall short for THIS account
**Our Positioning:** How to position the Snowflake AI Data Cloud specifically for this account
**Trap Questions:** 3 questions to ask the customer that expose the competitor's weaknesses
**Landmines:** Things they'll say about us and how to respond
**Win Theme:** The 1-sentence positioning that wins this deal

Be specific to the account context. Generic battle cards are useless.`,

  meeting_prep: `${BASE_SYSTEM_PROMPT}

Generate a comprehensive meeting prep. Structure it as:

## Meeting Prep: [Meeting Type] with [Account]

**Objective:** What we need to accomplish in this meeting
**Attendees & Angles:** For each attendee role, what they care about and how to engage them
**Agenda (30 min):** Suggested flow with time allocations
**Key Talking Points:** 3-5 points tailored to this meeting type and audience (security awareness / human risk context)
**Questions to Ask:** 5 discovery/qualifying questions specific to this account
**Risk Areas:** Topics to handle carefully or avoid
**Business Case Elements:** Data points and value statements to weave in
**Next Steps:** What to propose at the end of the meeting
**Prep Checklist:** What to have ready before the meeting

Be specific to the account, meeting type, and attendee roles provided.`,

  email_draft: `${BASE_SYSTEM_PROMPT}

Generate a polished, ready-to-send email. The email should be:
- Concise (under 200 words for most types)
- Specific to the account context
- Action-oriented with a clear ask
- Professional but warm, not robotic
- Include specific value points relevant to the recipient (security awareness / human risk focus where appropriate)

Output just the email with Subject line, then the body. No preamble.`,

  objection_response: `${BASE_SYSTEM_PROMPT}

Handle this sales objection with a structured response:

## Objection Response

**Acknowledge:** Show you understand the concern (1 sentence)
**Reframe:** Shift the perspective (1-2 sentences)
**Evidence:** Specific proof points, data, or references that address the concern
**Bridge:** Connect back to business value for THIS account
**Follow-up Questions:** 2-3 questions to ask that deepen the conversation
**If They Push Back:** What to say if the initial response doesn't land

Be honest. If the objection has merit, acknowledge it and explain how we mitigate. Never dismiss a legitimate concern.`,

  security_qa: `${BASE_SYSTEM_PROMPT}

You are answering security and compliance questions on behalf of Snowflake. Your answers should be:
- Accurate based on Snowflake's known security and product posture (AI Data Cloud, Horizon, privatelink, governance)
- Specific and detailed enough to satisfy an enterprise security or compliance team
- Formatted for copy/paste into a security questionnaire response

Key facts about Snowflake:
- AI Data Cloud: data warehouse, lake, Cortex AI, Snowflake Intelligence, Cortex Agents, Cortex Code, Snowflake Postgres
- Governed data, lineage (Horizon Catalog), resource budgets for AI, privatelink-only access
- Multi-model (OpenAI, Anthropic) in one perimeter; enterprise controls and observability (Observe)
- Trust Center, compliance, and enterprise deployment patterns

Answer the specific question asked. If you're not certain about a detail, say so and recommend the seller verify with Snowflake or the customer's security team.`,

  roi_calculator: `${BASE_SYSTEM_PROMPT}

Generate a detailed ROI analysis and business case. Structure it as:

## Business Case: Snowflake AI Data Cloud for [Use Case] at [Account]

**Executive Summary:** 2-3 sentence overview of the opportunity

**Current State:**
- How the work is done today
- Estimated costs (people, time, tools)
- Pain points and inefficiencies

**Proposed Solution:**
- How Snowflake addresses each pain point
- Implementation approach (AI Data Cloud deployment)
- Timeline to value

**Financial Impact:**
| Metric | Current | With Snowflake | Impact |
|--------|---------|-----------------|--------|
| [specific metrics] | | | |

**Year 1 ROI:**
- Investment: Snowflake platform costs
- Savings: Productivity gains, cost reduction, faster time-to-market
- Net ROI: X%

**Consumption expansion (optional):** If relevant, show Year 1 → Year 2 → Year 3 consumption trajectory (e.g. $200k → $600k → $1.5M). Snowflake is usage-based; managers value this.

**Risk Factors:** What could reduce the ROI
**Quick Win:** Fastest path to demonstrating value

Use realistic numbers. Base estimates on the account size, team size, and use case provided. Be conservative — sellers lose credibility with inflated ROI claims.`,

  executive_narrative: `${BASE_SYSTEM_PROMPT}

Generate a comprehensive executive narrative for this account. This should read like a strategic brief you'd present to your VP of Sales. Structure it as:

## Executive Narrative: [Account Name]

**The Opportunity:** Why this account, why now (2-3 sentences)
**Strategic Context:** What's happening at the company that creates the opening
**Why Snowflake Wins Here:** Specific differentiators that matter for THIS life sciences account
**Competitive Dynamics:** Who else is in play (Snowflake, Palantir, AWS, etc.) and how we're positioned
**The Path:** Phase 1 (Land) → Phase 2 (Expand) → Phase 3 (Enterprise) with specifics
**Value at Stake:** Land value, expansion potential, strategic importance
**Key Risks:** What could derail us and mitigation
**Executive Sponsors:** Who we need aligned and their motivations
**Next 30 Days:** Specific actions with owners and deadlines

Write in a confident, strategic voice. This is for internal use — be candid about challenges.`,

  strategy_assessment: `${BASE_SYSTEM_PROMPT}

Generate a strategic assessment for this account. This should be a concise, actionable analysis that a seller can read in 60 seconds. Include:

1. **Account health score** (1-100) with brief rationale
2. **Top 3 priorities this week** — specific, actionable items
3. **Biggest risk** and how to mitigate
4. **Competitive threat level** and primary competitor to watch
5. **Expansion opportunity** — workload-specific path (e.g. land ML feature store for fraud → customer analytics → AI agents), not generic "expand the platform." Name the next department/use case to target.
6. **Consumption expansion math** — Year 1 / Year 2 / Year 3 consumption estimate (e.g. $200k → $600k → $1.5M) if relevant to this account
7. **Partner leverage** — where AWS, dbt, Fivetran, Sigma, Accenture, Deloitte (or other ecosystem partners) could accelerate the deal
8. **Snowflake recommended play** — the single most important thing to do next

Be direct and specific. Name names, suggest timelines, quantify impact.`,

  use_case_recommendation: `${BASE_SYSTEM_PROMPT}

Based on the account profile, recommend the top Snowflake AI Data Cloud use cases (data engineering, analytics, AI/ML, Cortex Agents, Snowflake Intelligence, developer workflow). For each:

**Use Case:** Name (e.g. deepfake training for execs, phishing sims for contact center, security culture for engineering)
**Department:** Where it lives (Security, HR, Engineering, Customer Support, etc.)
**Buyer Persona:** Who makes the decision
**Problem Solved:** What pain point it addresses
**Implementation:** Simple/Medium/Complex
**Time to Value:** How quickly they'd see results
**Estimated ARR:** Based on headcount and scope
**Why This Account:** Specific reasons this use case fits HERE
**Customer References:** Similar companies that have succeeded with Adaptive

Rank by a combination of business impact and likelihood of adoption for THIS specific account.`,

  expansion_pitch: `${BASE_SYSTEM_PROMPT}

Generate a targeted expansion pitch for a specific department within the account. Structure it as:

## Expanding Snowflake into [Department] at [Account]

**The Hook:** Why this department should care (tied to their specific KPIs)
**Workload-specific path:** Concrete sequence (e.g. land ML feature store / data app / governance use case → then expand to analytics → then AI agents). Not generic "expand the platform."
**Use Cases:** 2-3 specific ways this department would use Snowflake (data, analytics, AI, Cortex, apps)
**Consumption expansion math:** Year 1 / Year 2 / Year 3 consumption estimate (e.g. $200k → $600k → $1.5M) for this expansion
**Partner leverage:** Where dbt, Fivetran, Sigma, AWS, or SIs (Accenture, Deloitte) could help land or expand
**Value Proposition:** Quantified impact on their metrics
**Internal Champion:** Who to approach and how (ideally leveraging existing relationships)
**Proof Points:** Evidence from the existing deployment or similar customers
**Objections to Expect:** What this department will push back on
**Pilot Design:** A 30-day pilot scope that's easy to say yes to
**Expected ARR:** What this expansion is worth

Make it specific to the department and account. Generic pitches don't expand footprint.`,
};
