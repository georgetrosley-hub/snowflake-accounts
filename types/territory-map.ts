export type TerritoryMotion = "expansion" | "net_new_workload";

export type SnowflakeUsageTier = "light" | "moderate" | "heavy";

export type DealLikelihood = "high" | "medium" | "low";

/** Modeled Day 0 view: hypotheses until CRM validates. */
export type Day0PipelineView = {
  likelihood: DealLikelihood;
  likelihoodWhy: string;
  /** e.g. "60–90 days" */
  timeline: string;
  firstMeeting: string;
};

/** Flagship deep dive: how the deal closes (optional per account). */
export type DealMechanics = {
  economicBuyer: string;
  technicalBuyer: string;
  champion: string;
  landMotion: string;
  expansionAfter: string;
  blockers: string;
  competitiveRisk: string;
};

export type TerritoryAccount = {
  id: string;
  name: string;
  tier: number;
  acv: string;
  industry: string;
  status: string;
  compelling: string;
  solutions: { product: string; problem: string }[];
  contacts: { name: string; title: string; role: string }[];
  /** Expansion depth vs net-new workload opportunity (for territory summary). */
  motion: TerritoryMotion;
  /** Rough Snowflake consumption / workload intensity (field estimate). */
  snowflakeUsage: SnowflakeUsageTier;
  /** One-line context, e.g. reporting-only vs multi-workload AI. */
  usageNote: string;
  /** Estimated pipeline low bound, thousands USD (modeling / CRM est.). */
  pipelineLowK: number;
  /** Estimated pipeline high bound, thousands USD. */
  pipelineHighK: number;
  /** Day 0 pipeline framing: likelihood, timeline, first meeting. */
  day0: Day0PipelineView;
  /** Why the outcome breaks without Snowflake as the governed execution layer. */
  whyWithoutSnowflake: string;
  /** Optional: full deal-mechanics narrative (e.g. flagship account). */
  dealMechanics?: DealMechanics;
};
