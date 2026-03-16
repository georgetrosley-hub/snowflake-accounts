"use client";

import { motion } from "framer-motion";
import { First90Days } from "@/components/sections/first-90-days";
import { ArtifactsWorkspace } from "@/components/sections/artifacts-workspace";
import { useApp } from "@/app/context/app-context";

/** Single page merging First 90 Days + Field Kit for a simpler nav. */
export function First90AndFieldKit() {
  const { account, competitors, executionItems } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-14 sm:space-y-16"
    >
      <First90Days
        account={account}
        competitors={competitors}
        executionItems={executionItems}
      />
      <hr className="border-surface-border/40" />
      <ArtifactsWorkspace account={account} competitors={competitors} />
    </motion.div>
  );
}
