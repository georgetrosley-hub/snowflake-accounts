"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Lightbulb, Code, HeadphonesIcon, FileText, BarChart3, Scale, ShieldCheck, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { StreamingContent } from "@/components/ui/streaming-content";
import { useStreaming } from "@/lib/hooks/use-streaming";
import { OpenAILogo } from "@/components/ui/openai-logo";
import { cn } from "@/lib/utils";
import type { Account, Competitor } from "@/types";

const useCases = [
  { id: "dev_productivity", name: "Developer Productivity", icon: Code, industry: "Cross-Industry", function: "Engineering", complexity: "Low", timeToValue: "2-4 weeks", description: "Cortex Code, AI-assisted development, and governed workflows. Snowsight, CLI, and MCP." },
  { id: "knowledge_retrieval", name: "Knowledge Retrieval & Search", icon: Search, industry: "Cross-Industry", function: "IT/Operations", complexity: "Medium", timeToValue: "4-8 weeks", description: "Enterprise search, document Q&A, and RAG over internal knowledge bases and docs." },
  { id: "customer_support", name: "Customer Support Automation", icon: HeadphonesIcon, industry: "Cross-Industry", function: "Support", complexity: "Medium", timeToValue: "4-8 weeks", description: "Ticket triage, response drafting, escalation handling, and knowledge-assisted resolution." },
  { id: "document_workflows", name: "Document Processing & Review", icon: FileText, industry: "Cross-Industry", function: "Legal/Compliance", complexity: "Medium", timeToValue: "6-10 weeks", description: "Contract analysis, compliance review, summarization, and regulated document workflows." },
  { id: "sales_enablement", name: "Sales Enablement", icon: Users, industry: "Cross-Industry", function: "Sales", complexity: "Low", timeToValue: "2-4 weeks", description: "Proposal drafting, objection handling, call prep, and competitive battle card generation." },
  { id: "regulatory_compliance", name: "Regulatory & Compliance", icon: ShieldCheck, industry: "Regulated", function: "Compliance", complexity: "High", timeToValue: "8-12 weeks", description: "Regulatory submission prep, audit documentation, policy review, and compliance workflows." },
  { id: "clinical_analytics", name: "Clinical Trial Analytics", icon: BarChart3, industry: "Life Sciences", function: "Clinical Ops", complexity: "Medium", timeToValue: "6-10 weeks", description: "Trial data ingestion, site performance, enrollment analytics with governed AI." },
  { id: "medical_affairs", name: "Medical Affairs", icon: Users, industry: "Life Sciences", function: "Medical Affairs", complexity: "Medium", timeToValue: "6-10 weeks", description: "HCP engagement prep, knowledge retrieval, medical information requests." },
  { id: "model_risk", name: "Model Risk & Governance", icon: ShieldCheck, industry: "Financial Services", function: "Risk", complexity: "High", timeToValue: "8-12 weeks", description: "Model validation, governance frameworks, and audit trails for AI in regulated finance." },
  { id: "wealth_advisor", name: "Wealth & Advisor Tools", icon: Lightbulb, industry: "Financial Services", function: "Wealth Management", complexity: "Medium", timeToValue: "4-8 weeks", description: "Advisor productivity, research synthesis, client communication support." },
  { id: "hr_payroll", name: "HR & Payroll Workflows", icon: Users, industry: "Cross-Industry", function: "HR", complexity: "Medium", timeToValue: "4-8 weeks", description: "Policy Q&A, payroll support, employee self-service, and HR operations automation." },
];

interface UseCaseLibraryProps {
  account: Account;
  competitors: Competitor[];
}

export function UseCaseLibrary({ account, competitors }: UseCaseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null);
  const recommendation = useStreaming();
  const detail = useStreaming();

  const filteredUseCases = useCases.filter(
    (uc) =>
      uc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.function.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateRecommendation = useCallback(() => {
    recommendation.startStream({
      url: "/api/generate",
      body: {
        type: "use_case_recommendation",
        account,
        competitors,
        context: `Based on ${account.name}'s profile, recommend the top 5 Snowflake AI Data Cloud use cases in priority order. Consider: industry (infer from company name if needed), developer population of ${account.developerPopulation.toLocaleString()}, AI maturity of ${account.aiMaturityScore}/100, first wedge "${account.firstWedge}", existing vendors (${account.existingVendorFootprint.join(", ")}). Be specific to this account.`,
      },
    });
  }, [account, competitors, recommendation]);

  const generateDetail = useCallback(
    (useCaseId: string) => {
      const uc = useCases.find((u) => u.id === useCaseId);
      if (!uc) return;
      setSelectedUseCase(useCaseId);
      detail.startStream({
        url: "/api/generate",
        body: {
          type: "use_case_recommendation",
          account,
          competitors,
          context: `Deep dive on "${uc.name}" for ${account.name}. Include: detailed implementation plan, expected ROI, required integrations with their stack (${account.existingVendorFootprint.join(", ")}), pilot design, and success criteria.`,
        },
      });
    },
    [account, competitors, detail]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="space-y-8 sm:space-y-10"
    >
      <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          title="Use case library"
          subtitle="Snowflake use cases for enterprise"
        />
        <button
          onClick={generateRecommendation}
          disabled={recommendation.isStreaming}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-accent/20 bg-accent/[0.06] px-4 py-2.5 text-[12px] font-medium text-accent/90 transition-colors hover:bg-accent/10 disabled:opacity-50 sm:w-auto lg:shrink-0"
        >
          <OpenAILogo size={12} />
          Recommend for {account.name}
        </button>
      </div>

      {/* AI recommendation */}
      {(recommendation.content || recommendation.isStreaming) && (
        <StreamingContent
          content={recommendation.content}
          isStreaming={recommendation.isStreaming}
          onRegenerate={generateRecommendation}
          label={`Recommended for ${account.name}`}
        />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted/50" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search use cases by name, industry, or function..."
          className="w-full rounded-lg border border-surface-border/40 bg-surface-elevated/20 pl-10 pr-4 py-3 text-[13px] text-text-primary placeholder:text-text-muted/50 focus:border-accent/30 focus:outline-none"
        />
      </div>

      {/* Use case grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUseCases.map((uc) => (
          <motion.button
            key={uc.id}
            onClick={() => generateDetail(uc.id)}
            className={cn(
              "rounded-lg border p-4 text-left transition-all",
              selectedUseCase === uc.id
                ? "border-accent/30 bg-accent/[0.05]"
                : "border-surface-border/40 bg-surface-elevated/20 hover:border-surface-border/60"
            )}
            whileHover={{ y: -1 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <uc.icon
                className={cn(
                  "h-4 w-4",
                  selectedUseCase === uc.id ? "text-accent/70" : "text-text-muted"
                )}
                strokeWidth={1.8}
              />
              <span className={cn("text-[13px] font-medium", selectedUseCase === uc.id ? "text-text-primary" : "text-text-secondary")}>
                {uc.name}
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed mb-3">{uc.description}</p>
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="rounded-full border border-surface-border/30 px-2 py-0.5 text-text-muted">
                {uc.industry.split(",")[0]}
              </span>
              <span className="rounded-full border border-surface-border/30 px-2 py-0.5 text-text-muted">
                {uc.complexity} complexity
              </span>
              <span className="rounded-full border border-surface-border/30 px-2 py-0.5 text-text-muted">
                {uc.timeToValue}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Use case detail */}
      {(detail.content || detail.isStreaming) && (
        <StreamingContent
          content={detail.content}
          isStreaming={detail.isStreaming}
          onRegenerate={() => selectedUseCase && generateDetail(selectedUseCase)}
          label={`Use Case: ${useCases.find((u) => u.id === selectedUseCase)?.name ?? ""}`}
        />
      )}
    </motion.div>
  );
}
