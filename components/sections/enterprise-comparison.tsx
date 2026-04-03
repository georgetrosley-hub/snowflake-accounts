"use client";

import { motion } from "framer-motion";
import { Shield, Check, Minus } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

type Strength = "strong" | "strongest" | "moderate" | "improving" | "unknown";

const rows: {
  factor: string;
  snowflake: Strength;
  databricks: Strength;
  bigquery: Strength;
  redshift?: Strength;
}[] = [
  {
    factor: "Governed AI — single platform for data + models + agents",
    snowflake: "strongest",
    databricks: "strong",
    bigquery: "moderate",
    redshift: "moderate",
  },
  {
    factor: "Native Cortex Agents & Snowflake Intelligence",
    snowflake: "strongest",
    databricks: "improving",
    bigquery: "moderate",
    redshift: "unknown",
  },
  {
    factor: "Multi-model (OpenAI, Anthropic) in one perimeter",
    snowflake: "strongest",
    databricks: "strong",
    bigquery: "moderate",
    redshift: "moderate",
  },
  {
    factor: "Developer workflow — Cortex Code, MCP, Postgres",
    snowflake: "strong",
    databricks: "strong",
    bigquery: "moderate",
    redshift: "moderate",
  },
  {
    factor: "Horizon Catalog — lineage, policy, interoperability",
    snowflake: "strongest",
    databricks: "strong",
    bigquery: "moderate",
    redshift: "moderate",
  },
  {
    factor: "Observability & cost control for AI workloads",
    snowflake: "strong",
    databricks: "strong",
    bigquery: "moderate",
    redshift: "unknown",
  },
];

function StrengthBadge({ s }: { s: Strength }) {
  if (s === "strongest") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
        <Check className="h-3 w-3" strokeWidth={2.5} />
        strongest
      </span>
    );
  }
  if (s === "strong") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400/90">
        <Check className="h-3 w-3" strokeWidth={2.5} />
        strong
      </span>
    );
  }
  if (s === "improving") {
    return (
      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-400/90">
        improving
      </span>
    );
  }
  if (s === "moderate") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-text-muted">
        <Minus className="h-3 w-3" strokeWidth={2} />
        moderate
      </span>
    );
  }
  return (
    <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-text-faint">
      unknown
    </span>
  );
}

export function EnterpriseComparison() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-8 sm:space-y-10"
    >
      <SectionHeader
        title="Platform vs Alternatives"
        subtitle="AI Data Cloud positioning — governed data, multi-model AI, developer workflow, and trust. Not point solutions."
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-[13px]">
          <thead>
            <tr className="border-b border-surface-border/40">
              <th className="pb-3 pr-4 text-left text-[10px] font-medium uppercase tracking-wider text-text-faint">
                Factor
              </th>
              <th className="px-4 pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-accent">
                Snowflake
              </th>
              <th className="px-4 pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-text-faint">
                Databricks
              </th>
              <th className="px-4 pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-text-faint">
                BigQuery
              </th>
              <th className="px-4 pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-text-faint">
                Redshift
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.factor} className="border-b border-surface-border/20">
                <td className="py-3 pr-4 text-text-secondary">{row.factor}</td>
                <td className="px-4 py-3">
                  <StrengthBadge s={row.snowflake} />
                </td>
                <td className="px-4 py-3">
                  <StrengthBadge s={row.databricks} />
                </td>
                <td className="px-4 py-3">
                  <StrengthBadge s={row.bigquery} />
                </td>
                <td className="px-4 py-3">
                  {row.redshift && <StrengthBadge s={row.redshift} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-surface-border/40 bg-surface-elevated/30 px-4 py-3">
        <p className="text-[12px] text-text-muted">
          <Shield className="inline h-3.5 w-3.5 mr-1 text-accent" />
          Internal GTM reference. Use for competitive positioning and deal conversations. Snowflake differentiates on governed AI, single platform, and enterprise trust.
        </p>
      </div>
    </motion.div>
  );
}
