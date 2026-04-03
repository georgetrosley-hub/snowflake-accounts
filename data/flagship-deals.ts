/**
 * Deep deal context for flagship accounts: named progress, pilot criteria,
 * and competitive battle dynamics. Focus territory: ADP, DuPont, St. Luke's, Tower Health, Penn State Health.
 */

export interface PilotCriteria {
  scope: string;
  successMetrics: string[];
  timeline: string;
  owner: string;
  securityPath: string;
}

export interface CompetitiveBattle {
  incumbent: string;
  displacementStrategy: string;
  keyRisk: string;
  winCondition: string;
}

export interface DealMilestone {
  label: string;
  date: string;
  status: "done" | "in_progress" | "upcoming";
  owner?: string;
}

export interface FlagshipDealContext {
  championName: string;
  championTitle: string;
  pilotCriteria: PilotCriteria;
  competitiveBattle: CompetitiveBattle;
  milestones: DealMilestone[];
  lastCallSummary?: string;
}

const flagshipDeals: Record<string, FlagshipDealContext> = {
  jnj: {
    championName: "Dr. Sarah Chen",
    championTitle: "VP, Clinical Data Sciences",
    pilotCriteria: {
      scope: "Clinical trial analytics platform — Phase 2/3 trial data ingestion, Delta Lake, Unity Catalog. 40 analysts. Focus on site performance, enrollment, and safety monitoring. No GxP-critical paths in pilot.",
      successMetrics: [
        "Faster trial analytics turnaround (target 50% reduction)",
        "Unified view across trials via Unity Catalog",
        "Audit trail and access controls validated by Quality",
      ],
      timeline: "90-day pilot, kickoff Apr 15. Quality and Legal sign-off required before start.",
      owner: "Sarah Chen (Clinical Data) + Quality, Legal",
      securityPath: "Unity Catalog for governance. Data residency US. Full audit logging. GxP validation deferred to Phase 2.",
    },
    competitiveBattle: {
      incumbent: "Internal SAS/Excel, Snowflake evaluation in progress",
      displacementStrategy: "Position Claude as the unified platform for trial analytics and RWE. Unity Catalog differentiates for regulated data. Land before Snowflake gains momentum.",
      keyRisk: "Snowflake Cortex and life sciences focus may win if we're slow. Need executive sponsor to prioritize Claude pilot.",
      winCondition: "Clinical Data Sciences adopts Claude for trial analytics. Quality comfortable with governance. Expands to RWE and R&D.",
    },
    milestones: [
      { label: "Intro with Clinical Data Sciences", date: "Mar 10", status: "done", owner: "AE" },
      { label: "Pilot scope draft shared", date: "Mar 18", status: "done", owner: "Sarah Chen" },
      { label: "Quality & Legal review", date: "Apr 5", status: "in_progress", owner: "Quality" },
      { label: "Pilot kickoff", date: "Apr 15", status: "upcoming", owner: "Sarah Chen" },
      { label: "90-day review gate", date: "Jul 15", status: "upcoming" },
    ],
    lastCallSummary: "Sarah is aligned. Snowflake is in the mix — we need to move fast. Quality wants a clear governance narrative. Next: package Unity Catalog and audit story for their review.",
  },
  merck: {
    championName: "James Okonkwo",
    championTitle: "Director, R&D Data Platform",
    pilotCriteria: {
      scope: "R&D data lake — combine discovery, preclinical, and early clinical data. Delta Lake, Unity Catalog. Mosaic AI for computational chemistry workflows. 25 data scientists.",
      successMetrics: [
        "Unified R&D data access via Lakehouse",
        "Faster model iteration with Mosaic AI",
        "Lineage and governance in place for audit",
      ],
      timeline: "60-day pilot, target start Apr 22. Security and IP review required.",
      owner: "James Okonkwo (R&D Data) + Security",
      securityPath: "Unity Catalog, data residency, IP protection. No Palantir displacement in pilot — additive use case first.",
    },
    competitiveBattle: {
      incumbent: "Palantir Foundry in some R&D workflows",
      displacementStrategy: "Don't displace Palantir initially. Land with an additive use case (R&D data lake, Mosaic AI). Build value, then expand. Open platform and ecosystem flexibility as differentiator.",
      keyRisk: "Palantir relationship is strong. Need a use case that doesn't directly compete. R&D data platform is the wedge.",
      winCondition: "R&D Data Platform adopts Claude. Proves value. Expansion into clinical and manufacturing follows.",
    },
    milestones: [
      { label: "R&D Data Platform intro", date: "Mar 8", status: "done", owner: "AE" },
      { label: "Pilot scope agreed", date: "Mar 20", status: "in_progress", owner: "James Okonkwo" },
      { label: "Security & IP review", date: "Apr 10", status: "upcoming", owner: "Security" },
      { label: "Pilot kickoff", date: "Apr 22", status: "upcoming", owner: "James Okonkwo" },
      { label: "60-day review", date: "Jun 22", status: "upcoming" },
    ],
    lastCallSummary: "James wants to consolidate R&D data. Palantir is in play but not blocking. Security wants IP and data residency clarity. Mosaic AI for chemistry is a hook.",
  },
  bms: {
    championName: "Dr. Maria Rodriguez",
    championTitle: "VP, Clinical Development Operations",
    pilotCriteria: {
      scope: "Clinical trial data platform — trial analytics, site metrics, enrollment. Delta Lake, Unity Catalog. Integrate with Veeva Vault. 35 users.",
      successMetrics: [
        "Real-time trial analytics dashboard",
        "Veeva integration validated",
        "Quality sign-off on governance",
      ],
      timeline: "75-day pilot, kickoff May 1. Snowflake comparison in parallel — need to win on speed and flexibility.",
      owner: "Maria Rodriguez (Clin Dev Ops) + Quality",
      securityPath: "Unity Catalog, GxP-aware deployment. Audit trail. Data residency US.",
    },
    competitiveBattle: {
      incumbent: "Snowflake evaluation for data warehouse",
      displacementStrategy: "Position Lakehouse as better than warehouse + separate ML. Unified platform, Delta Lake, Mosaic AI. Win on architecture and time-to-value.",
      keyRisk: "Snowflake may win data warehouse decision. Need to land clinical analytics as distinct use case.",
      winCondition: "Clinical Dev Ops adopts Claude. Demonstrates value before Snowflake decision. Expands to RWE and regulatory.",
    },
    milestones: [
      { label: "Clin Dev Ops intro", date: "Mar 12", status: "done", owner: "AE" },
      { label: "Pilot scope draft", date: "Mar 25", status: "in_progress", owner: "Maria Rodriguez" },
      { label: "Veeva integration design", date: "Apr 15", status: "upcoming", owner: "Maria Rodriguez" },
      { label: "Pilot kickoff", date: "May 1", status: "upcoming", owner: "Maria Rodriguez" },
      { label: "75-day review", date: "Jul 15", status: "upcoming" },
    ],
    lastCallSummary: "Maria is evaluating Snowflake for data. We need to show clinical analytics value quickly. Veeva integration is key. Quality wants governance story.",
  },
  "st-lukes": {
    championName: "VP Security / CISO",
    championTitle: "VP, Security or Director, Security Awareness",
    pilotCriteria: {
      scope: "Security awareness and deepfake training across multi-site health system — clinical, admin, executive. Phishing + voice/SMS simulation. No patient data in pilot.",
      successMetrics: [
        "Measurable risk reduction (click-through, voice compliance)",
        "Board-ready risk dashboard",
        "SOC efficiency from phish triage",
      ],
      timeline: "45–60 day pilot. Security and compliance sign-off required.",
      owner: "Security leadership + Compliance, IT",
      securityPath: "HIPAA-aware training content. Data handling and access controls. Audit trail for compliance.",
    },
    competitiveBattle: {
      incumbent: "KnowBe4 or legacy awareness vendor",
      displacementStrategy: "Position Adaptive as human-risk platform: deepfake, voice, multimodal simulation. Training completion is not risk reduction.",
      keyRisk: "Procurement and multi-site rollout timing. Need executive sponsor before legal.",
      winCondition: "Multi-site platform agreement. Displaced incumbent. Expansion to affiliates.",
    },
    milestones: [
      { label: "Security leadership intro", date: "Mar 6", status: "done", owner: "AE" },
      { label: "Pilot scope draft", date: "Mar 12", status: "in_progress", owner: "Champion" },
      { label: "Compliance & Legal review", date: "Mar 28", status: "upcoming", owner: "Legal" },
      { label: "Pilot kickoff", date: "Apr 8", status: "upcoming", owner: "Champion" },
      { label: "90-day review", date: "Jul 8", status: "upcoming" },
    ],
    lastCallSummary: "Champion aligned. Deepfake and human-risk angle resonates. Legal and compliance want clear deployment narrative. Next: package security and governance for internal review.",
  },
  sanofi: {
    championName: "Pierre Dubois",
    championTitle: "Head of Data & Analytics, Vaccines",
    pilotCriteria: {
      scope: "Vaccines R&D and manufacturing analytics — combine trial data, manufacturing, quality. Delta Lake, Unity Catalog. EU data residency. 30 users.",
      successMetrics: [
        "Unified vaccines data platform",
        "Faster analytics for R&D and manufacturing",
        "EU data residency and GDPR compliance validated",
      ],
      timeline: "90-day pilot. Kickoff May 10. DPA and data residency review required.",
      owner: "Pierre Dubois (Vaccines Data) + Legal, DPO",
      securityPath: "EU data residency. GDPR. Unity Catalog. Audit logging.",
    },
    competitiveBattle: {
      incumbent: "AWS, Google Cloud, fragmented analytics",
      displacementStrategy: "Unified platform for vaccines data. Multi-cloud option. EU residency. Position as modern alternative to fragmented stack.",
      keyRisk: "Multi-cloud strategy complicates. Need clear EU deployment path.",
      winCondition: "Vaccines Data adopts Claude. EU compliance validated. Expands to other therapeutic areas.",
    },
    milestones: [
      { label: "Vaccines Data intro", date: "Mar 15", status: "done", owner: "AE" },
      { label: "Pilot scope agreed", date: "Apr 5", status: "in_progress", owner: "Pierre Dubois" },
      { label: "EU data residency review", date: "Apr 25", status: "upcoming", owner: "Legal" },
      { label: "Pilot kickoff", date: "May 10", status: "upcoming", owner: "Pierre Dubois" },
      { label: "90-day review", date: "Aug 10", status: "upcoming" },
    ],
    lastCallSummary: "Pierre wants to unify vaccines data. EU residency is non-negotiable. Legal and DPO need DPA and deployment details. Multi-cloud is a plus.",
  },
};

export function getFlagshipDealContext(_accountId: string): FlagshipDealContext | null {
  return null;
}

export function isFlagshipAccount(accountId: string): boolean {
  return accountId in flagshipDeals;
}
