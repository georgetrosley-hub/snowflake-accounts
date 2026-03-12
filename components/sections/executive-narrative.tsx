"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/section-header";
import type { Account } from "@/types";

interface ExecutiveNarrativeProps {
  account: Account;
}

export function ExecutiveNarrative({ account }: ExecutiveNarrativeProps) {
  const narratives: Record<string, { whyNow: string; whyClaude: string; whyNot: string; impact: string; governance: string; rollout: string; value: string; nextMeeting: string }> = {
    comcast: {
      whyNow: "Comcast is accelerating platform engineering and developer productivity investments. Microsoft agreement renewal in Q3 creates a window for complementary AI evaluation.",
      whyClaude: "Claude offers enterprise-grade reasoning, long context, and strong constitutional AI positioning—critical for telecom-scale internal knowledge and code workflows.",
      whyNot: "GitHub Copilot and Cursor lack enterprise governance and audit. Microsoft Copilot is bundled but limited for specialized platform workflows.",
      impact: "Platform engineering productivity lift, customer support automation, and enterprise search across field operations.",
      governance: "SSO, audit logging, data residency controls. Architecture review in progress.",
      rollout: "Phase 1: 100-engineer platform pilot. Phase 2: Customer support pilot. Phase 3: Enterprise expansion.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M over 18 months.`,
      nextMeeting: "CIO and Platform Leadership—pilot scope and security review timeline.",
    },
    jpmorgan: {
      whyNow: "Finance and model risk teams are evaluating AI for document automation with strict governance. Regulatory environment demands auditable, controllable AI.",
      whyClaude: "Constitutional AI and enterprise governance controls align with model risk requirements. Long context and reasoning depth for finance workflows.",
      whyNot: "OpenAI and Microsoft require additional governance layers. Internal models not yet ready for production finance use cases.",
      impact: "Model risk documentation, legal and compliance automation, research synthesis.",
      governance: "Full architecture review, model risk sign-off, legal and procurement alignment required.",
      rollout: "Phase 1: Governed pilot in model risk. Phase 2: Legal and compliance. Phase 3: Operations expansion.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M. 12–18 month procurement cycle.`,
      nextMeeting: "Model Risk and Legal—governed pilot design and enterprise agreement timeline.",
    },
    pfizer: {
      whyNow: "R&D and medical affairs are exploring AI for regulated document workflows. GxP and FDA considerations drive need for auditable, controlled AI.",
      whyClaude: "Strong reasoning and safety positioning. Enterprise controls for IP and data residency. Suitable for regulated document workflows.",
      whyNot: "Generic AI tools lack GxP validation. Vertical specialists not yet mature for broad deployment.",
      impact: "R&D knowledge retrieval, clinical documentation, medical affairs workflows.",
      governance: "GxP validation path, legal and IP review, data residency mapping.",
      rollout: "Phase 1: Non-GxP pilot. Phase 2: Validated workflows. Phase 3: Clinical expansion.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M.`,
      nextMeeting: "Regulatory Affairs and Legal—pilot scope and validation requirements.",
    },
    nvidia: {
      whyNow: "AI research and engineering orgs need productivity tools. Strategic interest in application-layer AI beyond internal models.",
      whyClaude: "Complementary to NVIDIA infrastructure. Strong reasoning for documentation and developer workflows. Application-layer deployment.",
      whyNot: "Internal NIM and NeMo for model layer. Claude positions for application and user-facing workflows.",
      impact: "Research documentation, developer productivity, knowledge workflows.",
      governance: "Standard enterprise controls. Integration with existing GPU and data infrastructure.",
      rollout: "Phase 1: 200-engineer pilot. Phase 2: Research org. Phase 3: Enterprise expansion.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M.`,
      nextMeeting: "VP Engineering and Research—pilot scope and infrastructure integration.",
    },
    "comcast-business": {
      whyNow: "SMB support and sales orgs seeking AI for customer experience. Integration with Salesforce and Zendesk creates evaluation window.",
      whyClaude: "Enterprise-grade reasoning for support workflows. Strong differentiation vs. incumbent AI add-ons.",
      whyNot: "Zendesk AI limited for complex workflows. Salesforce Einstein focused on CRM, not support depth.",
      impact: "Customer support automation, sales enablement, internal knowledge augmentation.",
      governance: "SSO, audit, data controls. Compliance review for customer data.",
      rollout: "Phase 1: 50-agent support pilot. Phase 2: Sales expansion. Phase 3: Enterprise rollout.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M.`,
      nextMeeting: "VP Customer Support—pilot scope and Salesforce integration.",
    },
    salesforce: {
      whyNow: "Engineering orgs evaluating AI beyond Einstein. Developer productivity and internal tooling priorities.",
      whyClaude: "Model quality and reasoning depth. Vendor choice and API-first deployment.",
      whyNot: "Einstein is strategic; position Claude for specialized workflows and developer productivity.",
      impact: "Developer productivity, customer success automation, sales enablement.",
      governance: "Standard enterprise controls. Integration with Salesforce data and identity.",
      rollout: "Phase 1: Developer pilot. Phase 2: Customer success. Phase 3: Enterprise expansion.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M.`,
      nextMeeting: "CTO and Developer Productivity—pilot scope and integration design.",
    },
    servicenow: {
      whyNow: "Legal and HR exploring AI outside Now Platform. Specialized workflows not covered by Now Assist.",
      whyClaude: "Reasoning depth and use case breadth. Complements Now Platform for adjacent workflows.",
      whyNot: "Now Assist for core IT. Claude for enterprise search, legal, HR document automation.",
      impact: "Legal and HR automation, enterprise search, specialized workflows.",
      governance: "SSO, audit. Integration with ServiceNow identity and data.",
      rollout: "Phase 1: Legal/HR pilot. Phase 2: Enterprise search. Phase 3: Broader expansion.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M.`,
      nextMeeting: "Legal and HR Leadership—pilot scope and Now Platform integration.",
    },
    adp: {
      whyNow: "HR and payroll exploring AI for compliance and document workflows. Client support automation priorities.",
      whyClaude: "Strong governance and compliance positioning. Enterprise controls for PII-sensitive workflows.",
      whyNot: "Generic AI lacks payroll compliance. Claude offers enterprise-grade controls.",
      impact: "HR document automation, client support, implementation workflows.",
      governance: "PII controls, audit, compliance. Full security review required.",
      rollout: "Phase 1: Non-PII pilot. Phase 2: Governed HR workflows. Phase 3: Client support.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M.`,
      nextMeeting: "CDO and HR Leadership—pilot scope and compliance requirements.",
    },
    "morgan-stanley": {
      whyNow: "Wealth management and research exploring AI for document synthesis and client workflows.",
      whyClaude: "Governance and reasoning for regulated financial workflows.",
      whyNot: "OpenAI and Microsoft require additional compliance layers. Claude aligns with regulatory expectations.",
      impact: "Research synthesis, wealth advisor productivity, operations automation.",
      governance: "Regulatory review, model risk, legal and procurement alignment.",
      rollout: "Phase 1: Research pilot. Phase 2: Wealth management. Phase 3: Operations expansion.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M.`,
      nextMeeting: "CIO and Wealth Leadership—pilot scope and regulatory path.",
    },
    "capital-one": {
      whyNow: "Engineering and platform orgs accelerating developer productivity and modernization.",
      whyClaude: "Enterprise controls and reasoning for code and documentation workflows.",
      whyNot: "Existing AI investments; Claude differentiates on model quality and governance.",
      impact: "Developer productivity, customer service augmentation, legal and compliance.",
      governance: "Model risk review, security architecture. Integration with AWS and data platform.",
      rollout: "Phase 1: Platform engineering pilot. Phase 2: Customer service. Phase 3: Enterprise expansion.",
      value: `Land: $${account.estimatedLandValue.toFixed(2)}M. Expansion: $${account.estimatedExpansionValue.toFixed(2)}M.`,
      nextMeeting: "CIO and Platform Leadership—pilot scope and security review.",
    },
  };

  const n = narratives[account.id] ?? narratives.comcast;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <SectionHeader
        title="Executive narrative"
        subtitle="Account overview"
      />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="max-w-2xl space-y-8 rounded-md border border-surface-border/60 bg-surface-elevated/40 px-8 py-8"
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">Why now</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">{n.whyNow}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">Why Claude</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">{n.whyClaude}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">Alternatives</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">{n.whyNot}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">Impact</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">{n.impact}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">Governance</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">{n.governance}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">Rollout</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">{n.rollout}</p>
        </div>
        <div className="pt-2 border-t border-surface-border/50">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-muted mb-2">Value · Sponsors · Next</p>
          <p className="text-[13px] text-text-secondary leading-relaxed">
            {n.value} {account.executiveSponsors.join(", ")}. {n.nextMeeting}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
