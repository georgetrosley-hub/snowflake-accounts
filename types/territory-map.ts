export type TerritoryMotion = "expansion" | "net_new_workload";

export type SnowflakeUsageTier = "light" | "moderate" | "heavy";

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
};
