"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, BarChart3 } from "lucide-react";

const roadmap = [
  {
    icon: Zap,
    title: "Claude API integration",
    desc: "Replace deterministic simulation with live reasoning. Agents pull real account signals from CRM, call summaries, and documents to generate recommendations.",
  },
  {
    icon: BarChart3,
    title: "Pipeline sync",
    desc: "Connect to Salesforce/HubSpot. Auto-enrich deals with org structure, competitive intel, and risk scores. Forecast accuracy at the rep level.",
  },
  {
    icon: Shield,
    title: "Governance & audit trail",
    desc: "Every agent action logged. Human-in-the-loop preserved for approvals. Compliance-ready for regulated industries.",
  },
  {
    icon: Sparkles,
    title: "Executive briefing mode",
    desc: "One-click synthesis of account narrative, blockers, and next meeting prep. Built for QBRs and exec sponsor calls.",
  },
];

export function Vision() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl space-y-12"
    >
      <section>
        <h2 className="text-[16px] font-medium tracking-tight text-text-primary">
          What I&apos;d build next
        </h2>
        <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">
          This demo uses deterministic simulation. With the Claude API and real data sources, these agents could power a true enterprise GTM command center—assisted, not automated.
        </p>
      </section>

      <div className="space-y-6">
        {roadmap.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="flex gap-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted/60">
                <Icon className="h-3.5 w-3.5 text-claude-coral/70" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[14px] font-medium text-text-primary">{item.title}</p>
                <p className="mt-1 text-[13px] text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <section className="border-t border-surface-border/40 pt-8">
        <p className="text-[13px] text-text-muted leading-relaxed">
          Built to show what Claude-powered enterprise sales could look like. If you&apos;d like to explore this further, I&apos;d love to talk.
        </p>
      </section>
    </motion.div>
  );
}
