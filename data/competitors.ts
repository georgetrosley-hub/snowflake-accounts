import type { Competitor } from "@/types";

export const competitorCategories = [
  "Data platforms",
  "Cloud incumbents",
  "Vertical specialists",
  "AI/ML platforms",
] as const;

export const competitors: Competitor[] = [
  {
    id: "snowflake",
    name: "Snowflake",
    category: "cloud",
    strengthAreas: ["Cortex AI", "data cloud", "enterprise data warehouse", "life sciences focus"],
    databricksDifferentiation: ["Lakehouse architecture", "open Delta Lake", "unified analytics + AI", "Mosaic AI"],
    accountRiskLevel: 85,
    detectedFootprint: "Data warehouse evaluation, Cortex pilots in some pharma",
  },
  {
    id: "palantir",
    name: "Palantir",
    category: "vertical",
    strengthAreas: ["Pharma relationships", "Foundry", "AIP", "regulated workflows"],
    databricksDifferentiation: ["Open platform", "data lakehouse", "avoid vendor lock-in", "ecosystem flexibility"],
    accountRiskLevel: 82,
    detectedFootprint: "Foundry in R&D, clinical ops at some pharma",
  },
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    strengthAreas: ["Redshift", "SageMaker", "infrastructure", "enterprise relationships"],
    databricksDifferentiation: ["Unified platform", "Delta Lake", "Mosaic AI", "better ML governance"],
    accountRiskLevel: 78,
    detectedFootprint: "AWS infrastructure, Redshift/SageMaker in some divisions",
  },
  {
    id: "google",
    name: "Google Cloud",
    category: "cloud",
    strengthAreas: ["BigQuery", "Vertex AI", "life sciences solutions", "data clean rooms"],
    databricksDifferentiation: ["Lakehouse vs warehouse", "Unity Catalog", "open architecture", "Mosaic AI"],
    accountRiskLevel: 72,
    detectedFootprint: "BigQuery, Vertex AI pilots, Google Workspace",
  },
  {
    id: "oracle",
    name: "Oracle",
    category: "cloud",
    strengthAreas: ["Fusion", "database", "enterprise relationships", "healthcare vertical"],
    databricksDifferentiation: ["Modern data platform", "open standards", "AI/ML at scale"],
    accountRiskLevel: 65,
    detectedFootprint: "ERP, HR in some divisions",
  },
  {
    id: "sap",
    name: "SAP",
    category: "cloud",
    strengthAreas: ["S/4HANA", "Datasphere", "BTP", "life sciences footprint"],
    databricksDifferentiation: ["Purpose-built for analytics + AI", "Delta Lake", "data engineering"],
    accountRiskLevel: 68,
    detectedFootprint: "ERP, finance, supply chain",
  },
  {
    id: "databrix",
    name: "Databrix",
    category: "vertical",
    strengthAreas: ["Life sciences focus", "clinical data", "FDA relationships"],
    databricksDifferentiation: ["Scale", "Lakehouse", "ecosystem", "Mosaic AI", "Unity Catalog"],
    accountRiskLevel: 55,
  },
  {
    id: "veeva",
    name: "Veeva",
    category: "vertical",
    strengthAreas: ["CRM", "Vault", "clinical", "commercial", "pharma standard"],
    databricksDifferentiation: ["Complementary: analytics layer", "data lake", "AI/ML on top of Veeva data"],
    accountRiskLevel: 60,
    detectedFootprint: "Core commercial and clinical systems",
  },
  {
    id: "ibm",
    name: "IBM",
    category: "cloud",
    strengthAreas: ["Watsonx", "legacy relationships", "regulatory experience"],
    databricksDifferentiation: ["Modern platform", "open Lakehouse", "innovation pace"],
    accountRiskLevel: 58,
  },
  {
    id: "cloudera",
    name: "Cloudera",
    category: "cloud",
    strengthAreas: ["Hadoop heritage", "data platform", "financial services"],
    databricksDifferentiation: ["Lakehouse", "AI-native", "cloud-first", "Unity Catalog"],
    accountRiskLevel: 50,
  },
];

export function getCompetitorsByAccount(accountId: string): Competitor[] {
  const palantirAccounts = ["merck"];
  const snowflakeAccounts = ["bms", "jnj"];
  const awsHeavy = ["pfizer", "jnj", "sanofi"];

  return competitors.map((c) => {
    let risk = c.accountRiskLevel;
    if (palantirAccounts.includes(accountId) && c.id === "palantir") {
      risk = Math.min(95, risk + 10);
    }
    if (snowflakeAccounts.includes(accountId) && c.id === "snowflake") {
      risk = Math.min(95, risk + 8);
    }
    if (awsHeavy.includes(accountId) && c.id === "aws") {
      risk = Math.min(95, risk + 5);
    }
    return { ...c, accountRiskLevel: risk };
  });
}
