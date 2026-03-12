"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ApprovalRequest } from "@/types";

interface ApprovalCardProps {
  approval: ApprovalRequest;
  onApprove: () => void;
  onReject: () => void;
  onModify: () => void;
}

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
  onModify,
}: ApprovalCardProps) {
  if (approval.status !== "pending") return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-md border border-surface-border/70 bg-surface-elevated/60 px-6 py-5 shadow-[0_0_0_1px_rgba(196,181,154,0.03)]"
    >
      <div className="mb-5">
        <p className="text-[14px] font-medium text-text-primary leading-relaxed">
          {approval.title}
        </p>
        <p className="mt-2 text-[13px] text-text-secondary leading-relaxed">
          {approval.reason}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-text-muted">
          <span>{approval.requestingAgent}</span>
          <span className="text-accent-muted">{approval.estimatedImpact}</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="rounded px-3 py-1.5 text-[12px] font-medium text-accent hover:bg-accent/10 transition-colors duration-200"
        >
          Approve
        </button>
        <button
          onClick={onModify}
          className="rounded px-3 py-1.5 text-[12px] font-medium text-text-secondary hover:bg-surface-muted/50 transition-colors duration-200"
        >
          Modify
        </button>
        <button
          onClick={onReject}
          className="rounded px-3 py-1.5 text-[12px] font-medium text-text-muted hover:bg-surface-muted/50 hover:text-text-secondary transition-colors duration-200"
        >
          Reject
        </button>
      </div>
    </motion.div>
  );
}
