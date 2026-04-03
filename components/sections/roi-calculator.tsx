"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, Users, Clock } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { SnowflakeLogo } from "@/components/ui/snowflake-logo";
import { cn } from "@/lib/utils";
import type { Account, Competitor } from "@/types";

const useCaseOptions = [
  "Developer Productivity (Code Generation & Review)",
  "Customer Support Automation",
  "Document Processing & Analysis",
  "Knowledge Management & Enterprise Search",
  "Legal & Compliance Workflows",
  "Sales Enablement & Proposal Generation",
  "Data Analysis & Reporting",
  "R&D / Research Workflows",
  "IT Help Desk & Operations",
  "Executive Reporting & Strategic Analysis",
];

interface ROICalculatorProps {
  account: Account;
  competitors: Competitor[];
}

export function ROICalculator({ account, competitors }: ROICalculatorProps) {
  const [useCase, setUseCase] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [avgSalary, setAvgSalary] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [currentToolCost, setCurrentToolCost] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const roi = useStreaming();

  const generateROI = useCallback(() => {
    if (!useCase) return;
    roi.startStream({
      url: "/api/generate",
      body: {
        type: "roi_calculator",
        account,
        competitors,
        context: `Use case: ${useCase}\nTeam size: ${teamSize || "Not specified"}\nAvg salary/cost per person: ${avgSalary ? `$${avgSalary}` : "Not specified"}\nHours/week on security training / human risk: ${hoursPerWeek || "Not specified"}\nCurrent tool costs: ${currentToolCost ? `$${currentToolCost}/year` : "Not specified"}${additionalContext ? `\nAdditional context: ${additionalContext}` : ""}\n\nGenerate a detailed ROI model for this security awareness use case at ${account.name}. Use the inputs provided, and where inputs are missing, use reasonable industry estimates for a company of ${account.employeeCount.toLocaleString()} employees.`,
      },
    });
  }, [useCase, teamSize, avgSalary, hoursPerWeek, currentToolCost, additionalContext, account, competitors, roi]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-10"
    >
      <SectionHeader
        title="ROI & business case generator"
        subtitle="Build a data-driven business case for any Snowflake use case"
      />

      {/* Use case selector */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted mb-4">
          Use case
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {useCaseOptions.map((uc) => (
            <button
              key={uc}
              onClick={() => setUseCase(uc)}
              className={cn(
                "rounded-lg border px-4 py-3 text-[12px] text-left transition-all",
                useCase === uc
                  ? "border-accent/30 bg-accent/[0.05] text-text-primary"
                  : "border-surface-border/40 text-text-muted hover:border-surface-border/60 hover:text-text-secondary"
              )}
            >
              {uc}
            </button>
          ))}
        </div>
      </div>

      {/* Input grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-3.5 w-3.5 text-text-muted/60" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
              Team size
            </p>
          </div>
          <input
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            placeholder="e.g., 50"
            type="number"
            className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-3.5 w-3.5 text-text-muted/60" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
              Avg salary
            </p>
          </div>
          <input
            value={avgSalary}
            onChange={(e) => setAvgSalary(e.target.value)}
            placeholder="e.g., 150000"
            type="number"
            className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-3.5 w-3.5 text-text-muted/60" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
              Hours/week saved
            </p>
          </div>
          <input
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            placeholder="e.g., 8"
            type="number"
            className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-3.5 w-3.5 text-text-muted/60" />
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">
              Current tool cost/yr
            </p>
          </div>
          <input
            value={currentToolCost}
            onChange={(e) => setCurrentToolCost(e.target.value)}
            placeholder="e.g., 50000"
            type="number"
            className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
          />
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
          placeholder="e.g., They're currently spending $200K on contractor reviews. Main goal is reducing time-to-market..."
          rows={2}
          className="w-full resize-none rounded-lg border border-surface-border/40 bg-surface-elevated/20 px-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
        />
      </div>

      {/* Generate */}
      <button
        onClick={generateROI}
        disabled={!useCase || roi.isStreaming}
        className={cn(
          "flex items-center gap-2 rounded-lg px-5 py-3 text-[13px] font-medium transition-colors",
          useCase
            ? "border border-accent/20 bg-accent/[0.06] text-accent/90 hover:bg-accent/10"
            : "border border-surface-border/30 bg-surface-muted/20 text-text-muted/50 cursor-not-allowed"
        )}
      >
        <SnowflakeLogo size={14} />
        Generate Business Case
      </button>

      {/* Output */}
      {(roi.content || roi.isStreaming) && (
        <StreamingContent
          content={roi.content}
          isStreaming={roi.isStreaming}
          onRegenerate={generateROI}
          label={`Business Case: ${useCase.split(" (")[0]}`}
        />
      )}
    </motion.div>
  );
}
