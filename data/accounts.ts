import type { Account } from "@/types";

const PLACEHOLDER_ACCOUNT_IDS = ["01", "02", "03", "04", "05"] as const;

function buildPlaceholderAccount(idSuffix: (typeof PLACEHOLDER_ACCOUNT_IDS)[number]): Account {
  return {
    id: `tier-1-${idSuffix}`,
    name: `Tier 1 Account ${idSuffix}`,
    tam: 0,
    employeeCount: 0,
    developerPopulation: 0,
    aiMaturityScore: 0,
    securitySensitivity: 0,
    complianceComplexity: 0,
    competitivePressure: 0,
    existingVendorFootprint: ["To validate post-onboarding"],
    executiveSponsors: [],
    firstWedge: "Priority workload to validate in first account review cycle",
    estimatedLandValue: 0,
    estimatedExpansionValue: 0,
    topBlockers: [
      "Decision ownership to validate",
      "Competitive footprint to validate",
      "Governance and risk requirements to validate",
    ],
    topExpansionPaths: [
      "Analytics expansion path (to validate)",
      "Data engineering expansion path (to validate)",
      "AI/ML expansion path (to validate)",
      "Apps and governance expansion path (to validate)",
    ],
  };
}

/** Placeholder accounts only until named patch list is available. */
export const accounts: Account[] = PLACEHOLDER_ACCOUNT_IDS.map(buildPlaceholderAccount);

/** Default placeholder account */
export const defaultAccountId = "tier-1-01";
