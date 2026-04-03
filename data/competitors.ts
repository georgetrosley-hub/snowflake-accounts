import type { Competitor } from "@/types";

export const competitorCategories = [
  "frontier",
  "coding",
  "search",
  "workflow",
  "cloud",
  "vertical",
] as const;

/**
 * Snowflake-relevant alternatives for internal GTM positioning.
 * claudeDifferentiation → snowflakeDifferentiation for type compatibility.
 */
export const competitors: Competitor[] = [
  {
    id: "databricks",
    name: "Databricks",
    category: "cloud",
    strengthAreas: ["Unified analytics", "ML/AI workspace", "Delta Lake", "large ecosystem"],
    claudeDifferentiation: ["Governed AI Data Cloud", "Cortex Agents + Intelligence", "multi-model in one perimeter", "Snowflake Postgres + developer workflow"],
    accountRiskLevel: 75,
    detectedFootprint: "Databricks Lakehouse, Unity Catalog",
  },
  {
    id: "bigquery",
    name: "Google BigQuery",
    category: "cloud",
    strengthAreas: ["Scale", "ML built-in", "BigQuery Studio", "Google cloud integration"],
    claudeDifferentiation: ["Cross-cloud", "Horizon Catalog", "Cortex + Snowflake Intelligence", "open data movement"],
    accountRiskLevel: 70,
    detectedFootprint: "BigQuery, Looker",
  },
  {
    id: "redshift",
    name: "Amazon Redshift",
    category: "cloud",
    strengthAreas: ["AWS integration", "Redshift ML", "lake and warehouse"],
    claudeDifferentiation: ["Multi-cloud", "governed AI platform", "Cortex Agents", "Native Apps"],
    accountRiskLevel: 68,
    detectedFootprint: "Redshift, S3, SageMaker",
  },
  {
    id: "azure-synapse",
    name: "Microsoft Azure Synapse",
    category: "cloud",
    strengthAreas: ["Azure integration", "fabric", "Copilot integration"],
    claudeDifferentiation: ["Open table formats", "Cortex multi-model", "developer + app platform", "Observe"],
    accountRiskLevel: 72,
    detectedFootprint: "Synapse, Fabric, Azure OpenAI",
  },
  {
    id: "other",
    name: "Other / build-your-own",
    category: "vertical",
    strengthAreas: ["Custom stack", "existing vendor lock-in"],
    claudeDifferentiation: ["Single platform", "governance", "time to value", "interoperability"],
    accountRiskLevel: 50,
  },
];

export function getCompetitorsByAccount(_accountId: string): Competitor[] {
  return competitors.map((c) => ({
    ...c,
    detectedFootprint: c.detectedFootprint,
  }));
}
