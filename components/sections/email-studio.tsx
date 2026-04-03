"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, UserPlus, Reply, FileText, Crown, Shield, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { SnowflakeLogo } from "@/components/ui/snowflake-logo";
import { cn } from "@/lib/utils";
import type { Account, Competitor } from "@/types";

const emailTypes = [
  { id: "cold_intro", label: "Cold Introduction", icon: UserPlus, desc: "First outreach to a new contact" },
  { id: "follow_up", label: "Follow-Up", icon: Reply, desc: "After a call, meeting, or demo" },
  { id: "executive_briefing", label: "Executive Briefing", icon: Crown, desc: "Strategic overview for C-suite" },
  { id: "technical_summary", label: "Technical Summary", icon: FileText, desc: "Architecture and integration recap" },
  { id: "champion_enablement", label: "Champion Enablement", icon: ArrowUpRight, desc: "Internal email your champion sends upward" },
  { id: "security_response", label: "Security Response", icon: Shield, desc: "Addressing security/compliance questions" },
] as const;

interface EmailStudioProps {
  account: Account;
  competitors: Competitor[];
}

export function EmailStudio({ account, competitors }: EmailStudioProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [recipientRole, setRecipientRole] = useState("");
  const [context, setContext] = useState("");
  const email = useStreaming();

  const generateEmail = useCallback(() => {
    if (!selectedType) return;
    const typeLabel = emailTypes.find((t) => t.id === selectedType)?.label ?? selectedType;

    let prompt: string;
    if (selectedType === "champion_enablement") {
      prompt = `Generate an internal email that our champion at ${account.name} can send to their leadership to advocate for our platform.${recipientRole ? ` The champion's boss is: ${recipientRole}.` : ""}${context ? ` Context: ${context}` : ""}\n\nThe email should come FROM the champion (not from the vendor), explaining why they want to move forward with the platform. Make it persuasive but authentic — it should sound like an internal advocate, not a vendor.`;
    } else {
      prompt = `Email type: ${typeLabel}${recipientRole ? `\nRecipient role: ${recipientRole}` : ""}${context ? `\nContext: ${context}` : ""}`;
    }

    email.startStream({
      url: "/api/generate",
      body: {
        type: "email_draft",
        account,
        competitors,
        context: prompt,
      },
    });
  }, [selectedType, recipientRole, context, account, competitors, email]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Email & outreach studio"
        subtitle="AI-drafted, account-specific communications"
      />

      {/* Email type grid */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-4">
          Email type
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {emailTypes.map(({ id, label, icon: Icon, desc }) => (
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
                <span className={cn("text-[13px] font-medium", selectedType === id ? "text-text-primary" : "text-text-secondary")}>
                  {label}
                </span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recipient + context */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-3">
            Recipient role
          </p>
          <input
            value={recipientRole}
            onChange={(e) => setRecipientRole(e.target.value)}
            placeholder="e.g., VP Engineering, CISO, Head of Platform"
            className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
          />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-3">
            Context
          </p>
          <input
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Just had a demo, they loved the coding features"
            className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
          />
        </div>
      </div>

      {/* Generate */}
      <button
        onClick={generateEmail}
        disabled={!selectedType || email.isStreaming}
        className={cn(
          "flex items-center gap-2 rounded-lg px-5 py-3 text-[13px] font-medium transition-colors",
          selectedType
            ? "border border-accent/20 bg-accent/[0.06] text-accent/90 hover:bg-accent/10"
            : "border border-surface-border/30 bg-surface-muted/20 text-text-muted/50 cursor-not-allowed"
        )}
      >
        <Mail className="h-3.5 w-3.5" />
        Draft Email
      </button>

      {/* Output */}
      {(email.content || email.isStreaming) && (
        <StreamingContent
          content={email.content}
          isStreaming={email.isStreaming}
          onRegenerate={generateEmail}
          label={`Email Draft: ${emailTypes.find((t) => t.id === selectedType)?.label ?? ""}`}
        />
      )}
    </motion.div>
  );
}
