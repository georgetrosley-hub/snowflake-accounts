"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Presentation, BarChart3 } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { DatabricksLogoIcon } from "@/components/ui/databricks-logo";
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
            content: `Generate a board-level summary for ${account.name}. This should be a 1-page executive brief suitable for sharing with Databricks leadership. Include: account overview, strategic importance, deal status, revenue potential ($${account.estimatedLandValue}M land / $${account.estimatedExpansionValue}M expansion), key risks, competitive dynamics, and what we need from leadership to win. Keep it concise and strategic.`,
          },
        ],
        account,
        competitors,
      },
    });
  }, [account, competitors, boardSummary]);

  const staticNarratives: Record<string, { whyNow: string; whyDatabricks: string; whyNot: string; impact: string; governance: string; rollout: string }> = {
    jnj: {
      whyNow: "J&J Clinical Data Sciences is unifying trial analytics. Snowflake is in evaluation — we need to move fast. Quality and Legal want clear governance before pilot.",
      whyDatabricks: "Lakehouse, Unity Catalog, and Mosaic AI offer unified analytics + AI with governance pharma requires. Delta Lake and open architecture avoid lock-in.",
      whyNot: "Snowflake Cortex is in the mix. Internal tools lack scale. Need to differentiate on architecture and time-to-value.",
      impact: "Clinical trial analytics, RWE platform, expansion to R&D and regulatory workflows.",
      governance: "Unity Catalog, audit trail, data residency. Quality and Legal review in progress.",
      rollout: "Phase 1: Clinical Data Sciences pilot. Phase 2: RWE and R&D. Phase 3: Regulatory and manufacturing.",
    },
    merck: {
      whyNow: "R&D Data Platform wants to consolidate discovery and preclinical data. Palantir is entrenched in some workflows; we land with an additive use case first.",
      whyDatabricks: "Lakehouse and Mosaic AI for R&D data. Open platform, ecosystem flexibility. Mosaic AI for computational chemistry is a strong hook.",
      whyNot: "Palantir Foundry has relationships. Need additive use case — R&D data lake — not displacement.",
      impact: "Unified R&D data, Mosaic AI for chemistry, expansion to clinical and manufacturing.",
      governance: "Unity Catalog, IP protection, data residency. Security and IP review required.",
      rollout: "Phase 1: R&D data lake pilot. Phase 2: Clinical data. Phase 3: Manufacturing analytics.",
    },
    pfizer: {
      whyNow: "Medical Affairs exploring regulated document workflows. Legal and Quality want explicit deployment narrative before sign-off.",
      whyDatabricks: "Governed data + AI platform. Unity Catalog for compliance. Mosaic AI for knowledge retrieval. Safe choice for regulated environment.",
      whyNot: "Microsoft Copilot, Veeva, internal tools. Need proof package Legal and Quality can forward internally.",
      impact: "R&D knowledge retrieval, HCP engagement prep, clinical documentation, submission workflows.",
      governance: "Data residency, access controls, audit trail. Legal and Quality sign-off required.",
      rollout: "Phase 1: Medical Affairs pilot. Phase 2: Clinical documentation. Phase 3: Submission prep.",
    },
  };

  const n = staticNarratives[account.id] ?? staticNarratives.jnj;

  const sections = [
    { label: "Why now", content: n.whyNow },
    { label: "Why Databricks", content: n.whyDatabricks },
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
            <DatabricksLogoIcon size={10} className="text-accent/40" />
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
          <DatabricksLogoIcon size={14} />
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
