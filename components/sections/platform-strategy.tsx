"use client";

import { motion } from "framer-motion";
import { Resume } from "@/components/sections/resume";
import { WhyGeorge } from "@/components/sections/why-george";

/** Single page merging Platform Overview + Why Snowflake Why Now for a simpler nav. */
export function PlatformStrategy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-14 sm:space-y-16"
    >
      <Resume />
      <hr className="border-surface-border/40" />
      <WhyGeorge />
    </motion.div>
  );
}
