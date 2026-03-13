"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { DatabricksLogoIcon } from "@/components/ui/databricks-logo";
import type { Account, Competitor } from "@/types";

interface ArchitectureSecurityProps {
  account: Account;
  competitors: Competitor[];
}

export function ArchitectureSecurity({ account, competitors }: ArchitectureSecurityProps) {
  const securityBlockers = account.topBlockers.filter(
    (b) =>
      b.toLowerCase().includes("security") || b.toLowerCase().includes("architecture") || b.toLowerCase().includes("compliance")
  );
  const hasSecurityBlockers = securityBlockers.length > 0;
  const archRecommendation = useStreaming();
  const [archLoaded, setArchLoaded] = useState(false);

  const generateArchRecommendation = useCallback(() => {
    setArchLoaded(true);
    archRecommendation.startStream({
      url: "/api/generate",
      body: {
        type: "strategy_assessment",
        account,
        competitors,
        context: `Generate a detailed architecture recommendation for deploying Databricks at ${account.name}. Their existing tech stack includes: ${account.existingVendorFootprint.join(", ")}. Security sensitivity: ${account.securitySensitivity}/100. Compliance complexity: ${account.complianceComplexity}/100.\n\nInclude:\n1. Recommended deployment (Lakehouse, Unity Catalog, Mosaic AI) with reasoning\n2. Integration architecture with their existing stack (Veeva, clinical systems)\n3. Data flow design and access control with Unity Catalog\n4. Security controls (encryption, audit, data residency)\n5. Compliance requirements for life sciences (GxP, HIPAA)\n6. Phased rollout plan\n7. Technical prerequisites and blockers`,
      },
    });
  }, [account, competitors, archRecommendation]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-8 sm:space-y-10"
    >
      <SectionHeader
        title="Architecture"
        subtitle="Deployment planning & security posture"
      />
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-lg border border-surface-border/50 bg-surface-elevated/40 p-4 sm:p-6"
        >
          <div className="flex min-h-[220px] items-center rounded-md border border-surface-border/40 bg-surface/40 p-4 sm:aspect-video sm:min-h-0 sm:p-6">
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <div className="rounded-md border border-accent/25 bg-accent/[0.04] px-3 py-2 text-[12px] font-medium text-accent/90">
                  Databricks API
                </div>
                <div className="rounded-md border border-surface-border/50 px-3 py-2 text-[11px] text-text-muted">
                  Retrieval
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="rounded-md border border-surface-border/50 px-3 py-2 text-[11px] text-text-muted">
                  Documents
                </div>
                <div className="rounded-md border border-surface-border/50 px-3 py-2 text-[11px] text-text-muted">
                  Code repos
                </div>
                <div className="rounded-md border border-surface-border/50 px-3 py-2 text-[11px] text-text-muted">
                  Slack · Excel
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="rounded-md border border-accent/15 bg-accent/[0.02] px-3 py-2 text-[11px] text-text-secondary">
                  SSO · Access
                </div>
                <div className="rounded-md border border-accent/15 bg-accent/[0.02] px-3 py-2 text-[11px] text-text-secondary">
                  Audit · Governance
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-text-muted">
            <span className="rounded-full border border-surface-border/40 px-2 py-0.5">
              {account.existingVendorFootprint.slice(0, 3).join(" · ")}
            </span>
          </div>
        </motion.div>
        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-3">
              Readiness
            </p>
            <ul className="space-y-2 text-[13px] text-text-secondary">
              <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-accent/60 to-accent/20" style={{ width: `${account.securitySensitivity * 0.4}px` }} />
                Data sensitivity {account.securitySensitivity}%
              </li>
              <li className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="h-1 w-8 rounded-full bg-gradient-to-r from-accent/60 to-accent/20" style={{ width: `${account.complianceComplexity * 0.4}px` }} />
                Compliance {account.complianceComplexity}%
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1 w-1.5 rounded-full bg-text-faint/50" />
                Review: Pending
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-3">
              Blockers
            </p>
            <ul className="space-y-1.5 text-[12px] text-text-secondary leading-relaxed">
              {hasSecurityBlockers
                ? securityBlockers.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)
                : [<li key="0">Full architecture review required</li>]}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-3">
              Deployment options
            </p>
            <div className="flex flex-wrap gap-2">
              {["Direct API", "AWS Bedrock", "GCP Vertex AI"].map((opt) => (
                <span key={opt} className="rounded-full border border-surface-border/40 px-3 py-1 text-[11px] text-text-muted">
                  {opt}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Databricks architecture recommendation */}
      <button
        onClick={generateArchRecommendation}
        disabled={archRecommendation.isStreaming}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent/20 bg-accent/[0.06] px-4 py-2.5 text-[13px] font-medium text-accent/90 transition-colors hover:bg-accent/10 disabled:opacity-50 sm:w-auto"
      >
        <DatabricksLogoIcon size={14} />
        {archLoaded ? "Refresh Architecture Recommendation" : "Generate Architecture Recommendation"}
      </button>

      {(archRecommendation.content || archRecommendation.isStreaming) && (
        <StreamingContent
          content={archRecommendation.content}
          isStreaming={archRecommendation.isStreaming}
          onRegenerate={generateArchRecommendation}
          label={`Architecture for ${account.name}`}
        />
      )}
    </motion.div>
  );
}
