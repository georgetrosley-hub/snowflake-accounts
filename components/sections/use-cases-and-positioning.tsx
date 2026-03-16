"use client";

import { motion } from "framer-motion";
import { UseCaseLibrary } from "@/components/sections/use-case-library";
import { EnterpriseComparison } from "@/components/sections/enterprise-comparison";
import { useApp } from "@/app/context/app-context";

/** Single page merging Use Case Library + Platform vs Alternatives for a simpler nav. */
export function UseCasesAndPositioning() {
  const { account, competitors } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-14 sm:space-y-16"
    >
      <UseCaseLibrary account={account} competitors={competitors} />
      <hr className="border-surface-border/40" />
      <EnterpriseComparison />
    </motion.div>
  );
}
