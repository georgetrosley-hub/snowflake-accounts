"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { ApprovalCard } from "@/components/ui/approval-card";
import type { ApprovalRequest } from "@/types";

interface ApprovalQueueProps {
  approvals: ApprovalRequest[];
  lastApprovedTitle: string | null;
  clearLastApproved: () => void;
  onApprove: (id: string, title: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string) => void;
}

export function ApprovalQueue({
  approvals,
  lastApprovedTitle,
  clearLastApproved,
  onApprove,
  onReject,
  onModify,
}: ApprovalQueueProps) {
  const pending = approvals.filter((a) => a.status === "pending");

  useEffect(() => {
    if (!lastApprovedTitle) return;
    const t = setTimeout(clearLastApproved, 2500);
    return () => clearTimeout(t);
  }, [lastApprovedTitle, clearLastApproved]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Approval queue"
        subtitle={pending.length > 0 ? `${pending.length} pending review` : undefined}
      />

      <AnimatePresence>
        {lastApprovedTitle && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/[0.04] px-5 py-4 max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 400 }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15"
            >
              <Check className="h-4 w-4 text-accent" strokeWidth={2.5} />
            </motion.div>
            <div>
              <p className="text-[13px] font-medium text-text-primary">Approved</p>
              <p className="text-[12px] text-text-secondary">{lastApprovedTitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {pending.length === 0 && !lastApprovedTitle ? (
        <div className="rounded-lg border border-surface-border/40 bg-surface-elevated/30 py-16 px-8 text-center">
          <p className="text-[13px] text-text-muted">
            No approvals pending
          </p>
          <p className="mt-1 text-[12px] text-text-faint">
            Agents will surface items requiring human review
          </p>
        </div>
      ) : (
        <div className="space-y-5 max-w-2xl">
          {pending.map((a) => (
            <ApprovalCard
              key={a.id}
              approval={a}
              onApprove={() => onApprove(a.id, a.title)}
              onReject={() => onReject(a.id)}
              onModify={() => onModify(a.id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
