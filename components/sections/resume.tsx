"use client";

import { motion } from "framer-motion";
import {
  Database,
  Cpu,
  Code,
  Shield,
  TrendingUp,
  Sparkles,
  Layers,
  Globe,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { SnowflakeLogo } from "@/components/ui/snowflake-logo";

const PLATFORM_PILLARS = [
  {
    title: "Data foundation",
    icon: Database,
    items: [
      "Data warehouse, data lake & Iceberg support",
      "Data engineering, collaboration & marketplace",
      "Governance through Horizon Catalog",
    ],
  },
  {
    title: "AI stack",
    icon: Cpu,
    items: [
      "Cortex AI Functions / AISQL — model-powered analysis in SQL & Python",
      "Snowflake Intelligence — natural-language enterprise intelligence",
      "Cortex Agents — orchestration across structured & unstructured data",
      "Cortex Search, Cortex Analyst — multi-model (OpenAI, Anthropic)",
    ],
  },
  {
    title: "Developer & app platform",
    icon: Code,
    items: [
      "Cortex Code — AI-assisted development (CLI & Snowsight GA)",
      "Snowpark, notebooks, container services",
      "Native Apps, Snowflake-managed MCP server",
      "Snowflake Postgres — enterprise-ready PostgreSQL",
    ],
  },
  {
    title: "Trust & control",
    icon: Shield,
    items: [
      "Horizon Catalog — definitions, lineage, policy consistency",
      "Resource budgets for AI features",
      "Privatelink-only access",
      "Observe — AI-powered observability",
    ],
  },
];

const METRICS = [
  { label: "Product revenue (Q4 FY26)", value: "$1.23B", sub: "30% YoY" },
  { label: "RPO", value: "$9.77B", sub: "" },
  { label: "Forbes Global 2000 customers", value: "790", sub: "" },
  { label: "Customers >$1M TTM product revenue", value: "733", sub: "" },
  { label: "Net revenue retention", value: "125%", sub: "" },
  { label: "Global customers", value: "12,600+", sub: "" },
];

export function Resume() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10 sm:space-y-12"
    >
      <SectionHeader
        title="Platform Overview"
        subtitle="The AI Data Cloud — one trusted platform for enterprise data and agentic intelligence"
        showLogo
      />

      {/* Hero thesis */}
      <div className="rounded-2xl border border-accent/20 bg-accent/[0.06] p-5 sm:p-6">
        <p className="text-[15px] font-medium leading-relaxed text-text-primary">
          Snowflake is no longer just a warehouse story. It is becoming the governed operating system for enterprise AI.
        </p>
        <p className="mt-3 text-[13px] leading-relaxed text-text-secondary">
          The winning AI platform will combine models, governed enterprise data, interoperability, security, lineage, and production-grade operations. Snowflake is building that control plane — from data foundation to Cortex Agents, Cortex Code, Snowflake Intelligence, and Observe.
        </p>
      </div>

      {/* Key metrics */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
          <TrendingUp className="h-4 w-4" />
          Key metrics (FY26)
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-surface-border/50 bg-surface-elevated/40 px-4 py-3"
            >
              <p className="text-[11px] uppercase tracking-wider text-text-faint">{m.label}</p>
              <p className="mt-0.5 font-semibold text-accent">{m.value}</p>
              {m.sub && <p className="text-[12px] text-text-muted">{m.sub}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Platform pillars */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
          <Layers className="h-4 w-4" />
          Platform pillars
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PLATFORM_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-5"
              >
                <div className="flex items-center gap-2 text-accent">
                  <Icon className="h-4 w-4" />
                  <h3 className="font-semibold text-text-primary">{pillar.title}</h3>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {pillar.items.map((item) => (
                    <li key={item} className="flex gap-2 text-[12px] text-text-secondary">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Strategic message */}
      <div className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-5 sm:p-6">
        <h2 className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-text-primary">
          <Globe className="h-4 w-4 text-accent" />
          The strategic message
        </h2>
        <p className="text-[13px] leading-relaxed text-text-secondary">
          Enterprises do not need to stitch together a brittle stack of separate warehouse, catalog, vector/search layer, inference layer, agent framework, developer AI tooling, and observability plane. Snowflake is building one governed AI Data Cloud — easy, connected, trusted.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 rounded-xl border border-surface-border/40 bg-surface-muted/20 px-4 py-3">
        <SnowflakeLogo size={24} />
        <p className="text-[12px] text-text-muted">
          Internal GTM · Platform narrative for Account Executives · snowflake.com
        </p>
      </div>
    </motion.div>
  );
}
