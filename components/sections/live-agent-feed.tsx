"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import { LiveEventCard } from "@/components/ui/live-event-card";
import type { SimulationEvent } from "@/types";

interface LiveAgentFeedProps {
  events: SimulationEvent[];
}

export function LiveAgentFeed({ events }: LiveAgentFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && events.length > 0) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <SectionHeader
          title="Agent activity"
          subtitle="Activity stream"
        />
        <div className="flex items-center gap-2">
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-2 rounded-full bg-accent-muted"
          />
          <span className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
            Live
          </span>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto pr-2"
        style={{ maxHeight: "calc(100vh - 280px)" }}
      >
        <AnimatePresence mode="popLayout">
          {events.map((event, i) => (
            <LiveEventCard key={event.id} event={event} isNew={i === 0} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
