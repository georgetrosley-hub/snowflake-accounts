"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, Briefcase, Presentation, DollarSign } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { DatabricksLogoIcon } from "@/components/ui/databricks-logo";
import { cn } from "@/lib/utils";
import type { Account, Competitor } from "@/types";

const meetingTypes = [
  { id: "discovery", label: "Discovery Call", icon: Users, desc: "Initial conversation to understand needs and pain points" },
  { id: "technical", label: "Technical Deep-Dive", icon: Briefcase, desc: "Architecture review and integration discussion" },
  { id: "executive", label: "Executive Sponsor", icon: Presentation, desc: "C-level alignment and strategic vision" },
  { id: "qbr", label: "QBR / Business Review", icon: Calendar, desc: "Quarterly review of deployment and expansion" },
  { id: "procurement", label: "Procurement", icon: DollarSign, desc: "Pricing, contract terms, and vendor evaluation" },
] as const;

const attendeeRoles = [
  "CIO / CTO",
  "VP Engineering",
  "Director of AI/ML",
  "CISO / Security Lead",
  "VP Product",
  "General Counsel",
  "Head of Procurement",
  "Developer / IC",
  "Executive Sponsor",
  "Champion",
] as const;

interface MeetingPrepProps {
  account: Account;
  competitors: Competitor[];
}

export function MeetingPrep({ account, competitors }: MeetingPrepProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [additionalContext, setAdditionalContext] = useState("");
  const prep = useStreaming();

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const generatePrep = useCallback(() => {
    if (!selectedType) return;
    const meetingLabel = meetingTypes.find((t) => t.id === selectedType)?.label ?? selectedType;
    const rolesStr = selectedRoles.length > 0 ? selectedRoles.join(", ") : "Key stakeholders (unspecified)";

    prep.startStream({
      url: "/api/generate",
      body: {
        type: "meeting_prep",
        account,
        competitors,
        context: `Meeting type: ${meetingLabel}\nExpected attendees: ${rolesStr}${additionalContext ? `\nAdditional context: ${additionalContext}` : ""}`,
      },
    });
  }, [selectedType, selectedRoles, additionalContext, account, competitors, prep]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Meeting prep"
        subtitle="AI-powered preparation for any meeting type"
      />

      {/* Meeting type selector */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-4">
          Meeting type
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {meetingTypes.map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => setSelectedType(id)}
              className={cn(
                "rounded-lg border p-4 text-left transition-all",
                selectedType === id
                  ? "border-accent/30 bg-accent/[0.05]"
                  : "border-surface-border/40 bg-surface-elevated/20 hover:border-surface-border/60"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  className={cn(
                    "h-4 w-4",
                    selectedType === id ? "text-accent/70" : "text-text-muted"
                  )}
                  strokeWidth={1.8}
                />
                <span
                  className={cn(
                    "text-[13px] font-medium",
                    selectedType === id ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {label}
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Attendee roles */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-4">
          Expected attendees
        </p>
        <div className="flex flex-wrap gap-2">
          {attendeeRoles.map((role) => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] transition-all",
                selectedRoles.includes(role)
                  ? "border-accent/30 bg-accent/[0.08] text-accent/90"
                  : "border-surface-border/40 text-text-muted hover:border-surface-border/60 hover:text-text-secondary"
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Additional context */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-3">
          Additional context <span className="font-normal">(optional)</span>
        </p>
        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          placeholder="e.g., Follow-up from last week's demo. They expressed concern about data residency..."
          rows={3}
          className="w-full resize-none rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={generatePrep}
        disabled={!selectedType || prep.isStreaming}
        className={cn(
          "flex items-center gap-2 rounded-lg px-5 py-3 text-[13px] font-medium transition-colors",
          selectedType
            ? "border border-accent/20 bg-accent/[0.06] text-accent/90 hover:bg-accent/10"
            : "border border-surface-border/30 bg-surface-muted/20 text-text-muted/50 cursor-not-allowed"
        )}
      >
        <DatabricksLogoIcon size={14} />
        Generate Meeting Prep
      </button>

      {/* Output */}
      {(prep.content || prep.isStreaming) && (
        <StreamingContent
          content={prep.content}
          isStreaming={prep.isStreaming}
          onRegenerate={generatePrep}
          label="Meeting Prep"
        />
      )}
    </motion.div>
  );
}
