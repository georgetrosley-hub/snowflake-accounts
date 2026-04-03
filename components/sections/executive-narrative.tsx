"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Presentation, BarChart3 } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { SnowflakeLogo } from "@/components/ui/snowflake-logo";
import type { Account, Competitor } from "@/types";

interface ExecutiveNarrativeProps {
  account: Account;
  competitors: Competitor[];
}

export function ExecutiveNarrative({ account, competitors }: ExecutiveNarrativeProps) {
  const narrative = useStreaming();
  const qbrPoints = useStreaming();
  const boardSummary = useStreaming();
  const [narrativeLoaded, setNarrativeLoaded] = useState(false);

  const generateNarrative = useCallback(() => {
    setNarrativeLoaded(true);
    narrative.startStream({
      url: "/api/generate",
      body: {
        type: "executive_narrative",
        account,
        competitors,
      },
    });
  }, [account, competitors, narrative]);

  const generateQBRPoints = useCallback(() => {
    qbrPoints.startStream({
      url: "/api/chat",
      body: {
        messages: [
          {
            role: "user",
            content: `Generate QBR / Quarterly Business Review talking points for ${account.name}. Include: account health update, deployment status, usage metrics to highlight, expansion opportunities, competitive dynamics, risks, and asks for the next quarter. Format as a structured deck outline with slide-by-slide talking points.`,
          },
        ],
        account,
        competitors,
      },
    });
  }, [account, competitors, qbrPoints]);

  const generateBoardSummary = useCallback(() => {
    boardSummary.startStream({
      url: "/api/chat",
      body: {
        messages: [
          {
            role: "user",
            content: `Generate a board-level summary for ${account.name}. This should be a 1-page executive brief suitable for sharing with Snowflake leadership. Include: account overview, strategic importance, deal status, revenue potential ($${account.estimatedLandValue}M land / $${account.estimatedExpansionValue}M expansion), key risks, competitive dynamics (data platform / AI Data Cloud), and what we need from leadership to win. Keep it concise and strategic.`,
          },
        ],
        account,
        competitors,
      },
    });
  }, [account, competitors, boardSummary]);

  const defaultNarrative = {
    whyNow: "Account is evaluating data platform and AI workloads. Legacy warehouse or build-your-own in place — need to move with governed AI and time-to-value story.",
    whyClaude: "Governed AI Data Cloud: Cortex Agents, Snowflake Intelligence, multi-model in one perimeter. Developer workflow with Cortex Code, MCP, Postgres. Land-and-expand from analytics to AI to apps.",
    whyNot: "Databricks, BigQuery, Redshift have adoption. Need to differentiate on governed AI, single platform, and enterprise trust.",
    impact: "Data platform standardization, AI workloads, developer expansion. Expansion into enterprise agreement.",
    governance: "Horizon Catalog, lineage, resource budgets, privatelink. Security and Legal review in progress.",
    rollout: "Phase 1: First workload or pilot. Phase 2: Platform standardization. Phase 3: AI and app expansion.",
  };

  const staticNarratives: Record<string, typeof defaultNarrative> = {
    "st-lukes": {
      whyNow: "Multi-site health system; security and compliance want human-risk platform. Legacy awareness vendor likely up for renewal.",
      whyClaude: "Deepfake and voice simulation, measurable risk reduction. Safe choice for HIPAA environment. Training completion is not risk reduction.",
      whyNot: "KnowBe4 or incumbent. Need proof package Legal and Compliance can forward internally.",
      impact: "Multi-site platform agreement, displaced incumbent, clinical and admin awareness.",
      governance: "HIPAA, access controls, audit trail. Legal and Compliance sign-off required.",
      rollout: "Phase 1: Pilot in one division. Phase 2: Multi-site. Phase 3: Enterprise agreement.",
    },
    "penn-state-health": {
      whyNow: "Clinical informatics and IT security aligned. Parallel approval tracks; measurable risk reduction winning.",
      whyClaude: "Human-risk platform with deepfake and phishing simulation. Fits regulated healthcare and multi-stakeholder procurement.",
      whyNot: "Legacy incumbent. Differentiate on risk reduction and executive-level reporting.",
      impact: "Enterprise platform, displaced incumbent, expansion to affiliates.",
      governance: "Security and compliance in progress. Procurement timeline mapped.",
      rollout: "Phase 1: Controlled pilot. Phase 2: Broader rollout. Phase 3: Enterprise standard.",
    },
    "tower-health": {
      whyNow: "Multi-vendor displacement in motion. Security review and ROI building champion support.",
      whyClaude: "Consolidate fragmented tools; deepfake and phishing simulation. Four-thread motion: security, IT, procurement, exec.",
      whyNot: "Three legacy vendors. Need displacement narrative and ROI justification.",
      impact: "Net-new platform agreement, vendor consolidation.",
      governance: "Security review and procurement alignment.",
      rollout: "Phase 1: Pilot. Phase 2: Enterprise agreement.",
    },
    adp: {
      whyNow: "HR and payroll evaluating security awareness for PII-heavy workflows. Compliance and HR ops engaged.",
      whyClaude: "Phishing and awareness for payroll/compliance. Measurable risk reduction; audit-ready evidence.",
      whyNot: "KnowBe4 or status quo. Differentiate on engagement and human risk, not completion rates.",
      impact: "HR and payroll awareness, compliance culture, contractor risk.",
      governance: "PII and compliance. HR and Security sign-off.",
      rollout: "Phase 1: HR ops pilot. Phase 2: Enterprise rollout.",
    },
    dupont: {
      whyNow: "R&D and manufacturing evaluating deepfake and IP protection awareness. Security-driven modernization.",
      whyClaude: "AI-era threat training, IP protection, executive and high-value target defense. Fits regulated and multi-site.",
      whyNot: "Legacy or no program. Need urgency around AI-generated threats.",
      impact: "R&D and manufacturing awareness, executive deepfake defense, expansion path.",
      governance: "IP and data handling. Security and Legal review.",
      rollout: "Phase 1: R&D or manufacturing pilot. Phase 2: Enterprise.",
    },
  };

  const n = staticNarratives[account.id] ?? defaultNarrative;

  const sections = [
    { label: "Why now", content: n.whyNow },
    { label: "Why Snowflake", content: n.whyClaude },
    { label: "Alternatives", content: n.whyNot },
    { label: "Impact", content: n.impact },
    { label: "Governance", content: n.governance },
    { label: "Rollout", content: n.rollout },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Executive narrative"
        subtitle="Account-level strategic overview"
      />

      {/* Static narrative (quick reference) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-2xl space-y-8 rounded-lg border border-surface-border/50 bg-surface-elevated/40 px-8 py-8"
      >
        {sections.map(({ label, content }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.04, duration: 0.4 }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-2">{label}</p>
            <p className="text-[13px] text-text-secondary leading-relaxed">{content}</p>
          </motion.div>
        ))}
        <div className="pt-3 border-t border-surface-border/40">
          <div className="flex items-center gap-2 mb-2">
            <SnowflakeLogo size={10} className="text-accent/40" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent/50">Value · Sponsors</p>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Land: ${account.estimatedLandValue.toFixed(2)}M. Expansion: ${account.estimatedExpansionValue.toFixed(2)}M. {account.executiveSponsors.join(", ")}.
          </p>
        </div>
      </motion.div>

      {/* AI-powered generation buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={generateNarrative}
          disabled={narrative.isStreaming}
          className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/[0.06] px-4 py-2.5 text-[13px] font-medium text-accent/90 hover:bg-accent/10 transition-colors disabled:opacity-50"
        >
          <SnowflakeLogo size={14} />
          {narrativeLoaded ? "Refresh Full Narrative" : "Generate Full Narrative"}
        </button>
        <button
          onClick={generateQBRPoints}
          disabled={qbrPoints.isStreaming}
          className="flex items-center gap-2 rounded-lg border border-surface-border/40 bg-surface-elevated/30 px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-surface-elevated/50 transition-colors disabled:opacity-50"
        >
          <Presentation className="h-3.5 w-3.5" />
          QBR Talking Points
        </button>
        <button
          onClick={generateBoardSummary}
          disabled={boardSummary.isStreaming}
          className="flex items-center gap-2 rounded-lg border border-surface-border/40 bg-surface-elevated/30 px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-surface-elevated/50 transition-colors disabled:opacity-50"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Board Summary
        </button>
      </div>

      {/* Outputs */}
      {(narrative.content || narrative.isStreaming) && (
        <StreamingContent
          content={narrative.content}
          isStreaming={narrative.isStreaming}
          onRegenerate={generateNarrative}
          label="Executive Narrative"
        />
      )}

      {(qbrPoints.content || qbrPoints.isStreaming) && (
        <StreamingContent
          content={qbrPoints.content}
          isStreaming={qbrPoints.isStreaming}
          onRegenerate={generateQBRPoints}
          label="QBR Talking Points"
        />
      )}

      {(boardSummary.content || boardSummary.isStreaming) && (
        <StreamingContent
          content={boardSummary.content}
          isStreaming={boardSummary.isStreaming}
          onRegenerate={generateBoardSummary}
          label="Board Summary"
        />
      )}
    </motion.div>
  );
}
