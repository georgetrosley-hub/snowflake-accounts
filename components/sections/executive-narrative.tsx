"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FileText, Presentation, BarChart3 } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { ClaudeSparkle } from "@/components/ui/claude-logo";
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
            content: `Generate a board-level summary for ${account.name}. This should be a 1-page executive brief suitable for sharing with Anthropic leadership. Include: account overview, strategic importance, deal status, revenue potential ($${account.estimatedLandValue}M land / $${account.estimatedExpansionValue}M expansion), key risks, competitive dynamics, and what we need from leadership to win. Keep it concise and strategic.`,
          },
        ],
        account,
        competitors,
      },
    });
  }, [account, competitors, boardSummary]);

  const staticNarratives: Record<string, { whyNow: string; whyClaude: string; whyNot: string; impact: string; governance: string; rollout: string }> = {
    comcast: {
      whyNow: "Comcast is accelerating platform engineering and developer productivity investments. Microsoft agreement renewal in Q3 creates a window for complementary AI evaluation.",
      whyClaude: "Claude offers enterprise-grade reasoning, long context, and strong constitutional AI positioning — critical for telecom-scale internal knowledge and code workflows.",
      whyNot: "GitHub Copilot and Cursor lack enterprise governance and audit. Microsoft Copilot is bundled but limited for specialized platform workflows.",
      impact: "Platform engineering productivity lift, customer support automation, and enterprise search across field operations.",
      governance: "SSO, audit logging, data residency controls. Architecture review in progress.",
      rollout: "Phase 1: 100-engineer platform pilot. Phase 2: Customer support pilot. Phase 3: Enterprise expansion.",
    },
    jpmorgan: {
      whyNow: "Finance and model risk teams are evaluating AI for document automation with strict governance. Regulatory environment demands auditable, controllable AI.",
      whyClaude: "Constitutional AI and enterprise governance controls align with model risk requirements. Long context and reasoning depth for finance workflows.",
      whyNot: "OpenAI and Microsoft require additional governance layers. Internal models not yet ready for production finance use cases.",
      impact: "Model risk documentation, legal and compliance automation, research synthesis.",
      governance: "Full architecture review, model risk sign-off, legal and procurement alignment required.",
      rollout: "Phase 1: Governed pilot in model risk. Phase 2: Legal and compliance. Phase 3: Operations expansion.",
    },
  };

  const n = staticNarratives[account.id] ?? staticNarratives.comcast;

  const sections = [
    { label: "Why now", content: n.whyNow },
    { label: "Why Claude", content: n.whyClaude },
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
            <ClaudeSparkle size={10} className="text-claude-coral/40" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-claude-coral/50">Value · Sponsors</p>
          </div>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            Land: ${account.estimatedLandValue.toFixed(2)}M. Expansion: ${account.estimatedExpansionValue.toFixed(2)}M. {account.executiveSponsors.join(", ")}.
          </p>
        </div>
      </motion.div>

      {/* Claude-powered generation buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={generateNarrative}
          disabled={narrative.isStreaming}
          className="flex items-center gap-2 rounded-lg border border-claude-coral/20 bg-claude-coral/[0.06] px-4 py-2.5 text-[13px] font-medium text-claude-coral/90 hover:bg-claude-coral/10 transition-colors disabled:opacity-50"
        >
          <ClaudeSparkle size={14} />
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
