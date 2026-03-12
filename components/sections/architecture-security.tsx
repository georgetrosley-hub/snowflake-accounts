"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import type { Account } from "@/types";

interface ArchitectureSecurityProps {
  account: Account;
}

export function ArchitectureSecurity({ account }: ArchitectureSecurityProps) {
  const securityBlockers = account.topBlockers.filter(
    (b) =>
      b.toLowerCase().includes("security") || b.toLowerCase().includes("architecture")
  );
  const hasSecurityBlockers = securityBlockers.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Architecture"
        subtitle="Deployment planning"
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="rounded-md border border-surface-border/60 bg-surface-elevated/40 p-6"
        >
          <div className="aspect-video rounded border border-surface-border/50 bg-surface/40 p-6 flex items-center">
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-2">
                <div className="rounded border border-accent/30 bg-surface-elevated/80 px-3 py-2 text-[12px] text-text-primary">
                  Claude API
                </div>
                <div className="rounded border border-surface-border/60 px-3 py-2 text-[11px] text-text-muted">
                  Retrieval
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="rounded border border-surface-border/60 px-3 py-2 text-[11px] text-text-muted">
                  Documents
                </div>
                <div className="rounded border border-surface-border/60 px-3 py-2 text-[11px] text-text-muted">
                  Code repos
                </div>
                <div className="rounded border border-surface-border/60 px-3 py-2 text-[11px] text-text-muted">
                  Slack · Excel
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="rounded border border-accent-subtle/50 px-3 py-2 text-[11px] text-text-secondary">
                  SSO · Access
                </div>
                <div className="rounded border border-accent-subtle/50 px-3 py-2 text-[11px] text-text-secondary">
                  Audit · Governance
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-3">
              Readiness
            </p>
            <ul className="space-y-2 text-[13px] text-text-secondary">
              <li>Data sensitivity {account.securitySensitivity}%</li>
              <li>Compliance {account.complianceComplexity}%</li>
              <li>Review: Pending</li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-3">
              Blockers
            </p>
            <ul className="space-y-1.5 text-[12px] text-text-secondary leading-relaxed">
              {hasSecurityBlockers
                ? securityBlockers.slice(0, 3).map((b, i) => <li key={i}>{b}</li>)
                : [<li key="0">Full architecture review required</li>]}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-3">
              Mitigation
            </p>
            <p className="text-[12px] text-text-secondary leading-relaxed">
              Security review recommended. Document data flows. Prepare SSO and access design.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
