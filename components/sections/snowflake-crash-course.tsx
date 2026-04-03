"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { SnowflakeLogo } from "@/components/ui/snowflake-logo";
import { ExternalLink, BookOpen, CheckCircle2 } from "lucide-react";

const LEARN_BASE = "https://learn.snowflake.com";
const DOCS_BASE = "https://docs.snowflake.com";
const BLOG_BASE = "https://www.snowflake.com/en/blog";

const links = {
  handsOnEssentials: `${LEARN_BASE}/en/#handsOnEssentials`,
  badge1DataWarehousing: `${LEARN_BASE}/en/courses/OD-ESS-DWW/`,
  badge2Collaboration: `${LEARN_BASE}/en/courses/OD-ESS-CMCW/`,
  badge6DataScience: `${LEARN_BASE}/en/courses/OD-ESS-DSCW/`,
  snowProTrack: `${LEARN_BASE}/en/pages/snowpro-track`,
  platformTraining: `${LEARN_BASE}/en/webinars/virtual-hands-on-labs/snowflake-platform-training-2025-06-27/`,
  genAiTraining: `${LEARN_BASE}/en/courses/ILT-GENAI/`,
  genAiExecutives: `${LEARN_BASE}/en/courses/OD-SXGA3/`,
  cortexAgents: `${DOCS_BASE}/en/user-guide/snowflake-cortex/cortex-agents`,
  cortexAiOverview: `${DOCS_BASE}/en/guides-overview-ai-features`,
  snowflakeIntelligence: "https://www.snowflake.com/en/product/snowflake-intelligence/",
  aiDataCloud: "https://www.snowflake.com/en/product/ai/",
  summit2025: `${BLOG_BASE}/announcements-snowflake-summit-2025`,
  summitPlatform: `${BLOG_BASE}/platform-announcements-summit-2025`,
  releaseNotesSummit2025: `${DOCS_BASE}/en/release-notes/2025/june-summit`,
  training: "https://www.snowflake.com/en/resources/learn/training",
  community: "https://community.snowflake.com",
} as const;

function LinkItem({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-2 rounded-lg border border-surface-border/50 bg-surface-elevated/40 px-3 py-2.5 transition-colors hover:border-accent/30 hover:bg-accent/[0.06]"
    >
      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-faint group-hover:text-accent" />
      <div className="min-w-0">
        <span className="text-[13px] font-medium text-text-primary group-hover:text-accent">
          {label}
        </span>
        {note && <p className="mt-0.5 text-[11px] text-text-muted">{note}</p>}
      </div>
    </a>
  );
}

function DayCard({
  day,
  title,
  subtitle,
  children,
}: {
  day: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-surface-border/60 bg-surface-elevated/30 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <span className="text-sm font-bold">Day {day}</span>
        </div>
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-text-primary">{title}</h3>
          <p className="text-[12px] text-text-muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function SnowflakeCrashCourse() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-10 sm:space-y-12"
    >
      <SectionHeader
        title="Snowflake 3-Day Crash Course"
        subtitle="Structured prep so you're 100% ready for your Enterprise AE interview. All links and product info point to the current Snowflake offering — no outdated material."
        showLogo
      />

      <div className="rounded-2xl border border-accent/20 bg-accent/[0.06] p-5 sm:p-6">
        <p className="text-[14px] font-medium leading-relaxed text-text-primary">
          Use this as your single source for the three days before the interview. Day 1: platform fundamentals. Day 2: product depth and competitive positioning. Day 3: GTM and deal readiness. Everything here aligns with current Snowflake messaging, GA products, and learning paths.
        </p>
        <p className="mt-2 text-[12px] text-text-muted">
          Official learning lives at <strong>learn.snowflake.com</strong> (Snowflake University). Create a free community account at community.snowflake.com if you haven’t already.
        </p>
      </div>

      {/* Day 1 */}
      <DayCard
        day={1}
        title="Platform fundamentals"
        subtitle="AI Data Cloud, pillars, and hands-on basics"
      >
        <ul className="mb-4 space-y-2 text-[13px] text-text-secondary">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">AI Data Cloud</strong> — Snowflake’s umbrella: one platform for data warehouse, lake, engineering, governance, AI, and apps. Not “just a warehouse.”</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Four pillars</strong> — (1) Data foundation: warehouse, lake, Iceberg, Horizon Catalog. (2) AI stack: Cortex AI, Snowflake Intelligence, Cortex Agents. (3) Developer & app platform: Cortex Code, Snowpark, Native Apps, Snowflake Postgres. (4) Trust & control: Horizon, resource budgets, privatelink-only, Observe.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Horizon Catalog</strong> — Unified definitions, lineage, and policy. Critical for governed AI and compliance.</span>
          </li>
        </ul>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-faint">
          Do today — free on learn.snowflake.com
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <LinkItem href={links.handsOnEssentials} label="Hands-On Essentials (all badges)" note="Start with Badge 1 if new" />
          <LinkItem href={links.badge1DataWarehousing} label="Badge 1: Data Warehousing Workshop" note="Free, graded labs" />
          <LinkItem href={links.badge2Collaboration} label="Badge 2: Collaboration, Marketplace & Cost" note="Data sharing, cost estimation" />
          <LinkItem href={links.releaseNotesSummit2025} label="Summit 2025 release notes (docs)" note="Current GA/preview state" />
        </div>
      </DayCard>

      {/* Day 2 */}
      <DayCard
        day={2}
        title="Product depth & competitive positioning"
        subtitle="Cortex, Intelligence, Postgres, Openflow — and how we win vs others"
      >
        <ul className="mb-4 space-y-2 text-[13px] text-text-secondary">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Cortex Agents</strong> (GA Nov 2025) — Orchestrate across structured and unstructured data; use Cortex Analyst, Cortex Search, custom tools. Governed inside Snowflake’s perimeter.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Snowflake Intelligence</strong> (GA Nov 2025) — Natural-language enterprise intelligence; runs on Cortex Agents; models from OpenAI and Anthropic in one perimeter.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Cortex Code</strong> (Snowsight GA Mar 2026) — AI-assisted SQL/Python and admin workflows in Snowsight. CLI GA Feb 2026.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Snowflake Postgres</strong> (GA Feb 2026), <strong>Openflow</strong> (GA), <strong>Observe</strong> (acquired Feb 2026) — Postgres for apps; Openflow for data movement; Observe for reliability and observability.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Vs Databricks</strong> — Snowflake: governed SaaS, SQL-centric, fast time to value, consumption-based. Databricks: engineering-led, open formats, strong ML/AI. Many enterprises use both; Snowflake wins on governance, simplicity, and “one platform” for data + AI + apps.</span>
          </li>
        </ul>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-faint">
          Do today — product & learning
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <LinkItem href={links.cortexAgents} label="Cortex Agents (docs)" note="Official product guide" />
          <LinkItem href={links.cortexAiOverview} label="AI and ML overview (docs)" note="Cortex family, AISQL, etc." />
          <LinkItem href={links.snowflakeIntelligence} label="Snowflake Intelligence (product)" />
          <LinkItem href={links.summit2025} label="Summit 2025 highlights (blog)" />
          <LinkItem href={links.badge6DataScience} label="Badge 6: Data Science Workshop" note="Cortex, LLMs, free" />
          <LinkItem href={links.genAiExecutives} label="Generative and Agentic AI for Executives" note="Free on-demand" />
          <LinkItem href={links.snowProTrack} label="SnowPro certification track" note="Optional; shows depth" />
        </div>
      </DayCard>

      {/* Day 3 */}
      <DayCard
        day={3}
        title="GTM & deal readiness"
        subtitle="Land-expand, workload specificity, consumption math, partners"
      >
        <p className="mb-4 text-[13px] text-text-secondary">
          Enterprise AEs at Snowflake are evaluated on platform economics, workload thinking, and how they run a deal. Use this site’s other sections together with the points below.
        </p>
        <ul className="mb-4 space-y-2 text-[13px] text-text-secondary">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Workload specificity</strong> — Don’t say “expand the platform.” Say: land ML feature store for fraud → expand into customer analytics → expand into AI agents. Know: AI data pipelines, feature stores, data apps, governance/data sharing, ML training pipelines.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Consumption math</strong> — Snowflake is usage-based. Frame expansion as Year 1 → Year 2 → Year 3 consumption (e.g. $200k → $600k → $1.5M). Use the ROI / TCO Model on this site to practice.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Partner ecosystem</strong> — AWS, dbt, Fivetran, Sigma, Accenture, Deloitte. Snowflake wins many deals with and through partners.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">Deal language</strong> — Simplify the data estate, consolidate fragmented tooling, reduce operational drag, improve economics of scale, create a foundation for AI workloads, align spend to actual usage.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent/80" />
            <span><strong className="text-text-primary">On this site</strong> — Run through Platform & Strategy, ROI / TCO Model, War Room, First 90 Days & Field Kit, and Use Cases & Positioning. Use the chat to practice answering questions as an AE would.</span>
          </li>
        </ul>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-faint">
          Do today — internal prep
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md border border-surface-border/50 bg-surface-muted/30 px-3 py-1.5 text-[12px] text-text-secondary">
            Re-read Platform & Strategy
          </span>
          <span className="rounded-md border border-surface-border/50 bg-surface-muted/30 px-3 py-1.5 text-[12px] text-text-secondary">
            Run ROI / TCO with 2–3 presets
          </span>
          <span className="rounded-md border border-surface-border/50 bg-surface-muted/30 px-3 py-1.5 text-[12px] text-text-secondary">
            Practice “why Snowflake, why now”
          </span>
          <span className="rounded-md border border-surface-border/50 bg-surface-muted/30 px-3 py-1.5 text-[12px] text-text-secondary">
            Nail workload-specific expansion path
          </span>
        </div>
      </DayCard>

      {/* Quick reference */}
      <section className="rounded-2xl border border-surface-border/60 bg-surface-elevated/30 p-5 sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-text-primary">
          <BookOpen className="h-4 w-4 text-accent" />
          Quick reference — current as of Snowflake’s latest offering
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-faint">Learning</p>
            <a href={links.training} target="_blank" rel="noopener noreferrer" className="text-[13px] text-accent hover:underline">
              snowflake.com/resources/learn/training
            </a>
            <p className="mt-1 text-[12px] text-text-muted">learn.snowflake.com · Hands-On Essentials · SnowPro track</p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-faint">Product</p>
            <a href={links.aiDataCloud} target="_blank" rel="noopener noreferrer" className="text-[13px] text-accent hover:underline">
              AI Data Cloud
            </a>
            <p className="mt-1 text-[12px] text-text-muted">Cortex Agents, Intelligence, Code · Horizon · Postgres · Openflow · Observe</p>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-xl border border-surface-border/40 bg-surface-muted/20 px-4 py-3">
        <SnowflakeLogo size={20} />
        <p className="text-[12px] text-text-muted">
          3-day crash course · All links and product status current · snowflake.com · learn.snowflake.com
        </p>
      </div>
    </motion.div>
  );
}
