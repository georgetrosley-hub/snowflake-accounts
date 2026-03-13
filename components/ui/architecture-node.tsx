"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ArchitectureNodeProps {
  label: string;
  category?: "core" | "integration" | "governance";
  x?: number;
  y?: number;
}

export function ArchitectureNode({ label, category = "integration", x = 0, y = 0 }: ArchitectureNodeProps) {
  const styles = {
    core: "border-accent/30 bg-accent/[0.04]",
    integration: "border-surface-border bg-surface-muted/50",
    governance: "border-accent/15 bg-surface-elevated",
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "absolute rounded-lg border px-3 py-2 text-xs font-medium text-text-primary",
        styles[category]
      )}
      style={{ left: x, top: y }}
    >
      {label}
    </motion.div>
  );
}
