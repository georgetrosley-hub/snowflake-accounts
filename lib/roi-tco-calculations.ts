/**
 * Enterprise Data Platform ROI / TCO model
 * Compares legacy data stack vs Snowflake over 3 years.
 * Directional estimates — actual costs vary by environment and workload mix.
 */

export interface LegacyInputs {
  warehouseLicense: number;
  infrastructure: number;
  storage: number;
  dbaOperations: number;
  etlTools: number;
  biOverlap: number;
  dataSharingIntegration: number;
  aiMlInfra: number;
  performanceTuning: number;
  annualGrowthRatePct: number;
}

export interface SnowflakeInputs {
  year1Consumption: number;
  consumptionGrowthRatePct: number;
  storage: number;
  adminOperations: number;
  migrationImplementationY1: number;
  aiExpansion: number;
  appSharingExpansion: number;
}

export interface TCOResults {
  legacyY1: number;
  legacyY2: number;
  legacyY3: number;
  legacyTCO3y: number;
  snowflakeY1: number;
  snowflakeY2: number;
  snowflakeY3: number;
  snowflakeTCO3y: number;
  netSavings: number;
  pctSavings: number;
  roiPct: number;
  paybackMonths: number;
  adminReduction3y: number;
  toolConsolidation3y: number;
  costOfScaleLegacy: number;
  costOfScaleSnowflake: number;
  toolsConsolidatedCount: number;
}

function legacyAnnualTotal(inputs: LegacyInputs, year: 1 | 2 | 3): number {
  const base =
    inputs.warehouseLicense +
    inputs.infrastructure +
    inputs.storage +
    inputs.dbaOperations +
    inputs.etlTools +
    inputs.biOverlap +
    inputs.dataSharingIntegration +
    inputs.aiMlInfra +
    inputs.performanceTuning;
  const r = 1 + inputs.annualGrowthRatePct / 100;
  return year === 1 ? base : year === 2 ? base * r : base * r * r;
}

function snowflakeAnnualTotal(inputs: SnowflakeInputs, year: 1 | 2 | 3): number {
  const consumptionY1 = inputs.year1Consumption;
  const consumptionY2 = inputs.year1Consumption * (1 + inputs.consumptionGrowthRatePct / 100);
  const consumptionY3 = consumptionY2 * (1 + inputs.consumptionGrowthRatePct / 100);
  const consumption = year === 1 ? consumptionY1 : year === 2 ? consumptionY2 : consumptionY3;
  const storage = inputs.storage;
  const admin = inputs.adminOperations;
  const migration = year === 1 ? inputs.migrationImplementationY1 : 0;
  const ai = inputs.aiExpansion;
  const app = inputs.appSharingExpansion;
  return consumption + storage + admin + migration + ai + app;
}

export function computeTCO(legacy: LegacyInputs, snowflake: SnowflakeInputs): TCOResults {
  const legacyY1 = legacyAnnualTotal(legacy, 1);
  const legacyY2 = legacyAnnualTotal(legacy, 2);
  const legacyY3 = legacyAnnualTotal(legacy, 3);
  const snowflakeY1 = snowflakeAnnualTotal(snowflake, 1);
  const snowflakeY2 = snowflakeAnnualTotal(snowflake, 2);
  const snowflakeY3 = snowflakeAnnualTotal(snowflake, 3);

  const legacyTCO3y = legacyY1 + legacyY2 + legacyY3;
  const snowflakeTCO3y = snowflakeY1 + snowflakeY2 + snowflakeY3;
  const netSavings = legacyTCO3y - snowflakeTCO3y;
  const pctSavings = legacyTCO3y > 0 ? (netSavings / legacyTCO3y) * 100 : 0;
  const roiPct = snowflakeTCO3y > 0 ? (netSavings / snowflakeTCO3y) * 100 : 0;

  let paybackMonths = 36;
  const cum1 = legacyY1 - snowflakeY1;
  const cum2 = cum1 + (legacyY2 - snowflakeY2);
  const cum3 = cum2 + (legacyY3 - snowflakeY3);
  if (cum1 >= 0) {
    paybackMonths = snowflakeY1 > 0 && cum1 > 0 ? (snowflakeY1 / cum1) * 12 : 12;
  } else if (cum2 >= 0) {
    const savingsY2 = legacyY2 - snowflakeY2;
    paybackMonths = savingsY2 > 0 ? 12 + (Math.abs(cum1) / savingsY2) * 12 : 24;
  } else if (cum3 >= 0) {
    const savingsY3 = legacyY3 - snowflakeY3;
    paybackMonths = savingsY3 > 0 ? 24 + (Math.abs(cum2) / savingsY3) * 12 : 36;
  }
  paybackMonths = Math.min(120, Math.max(0, Math.round(paybackMonths)));

  const adminReduction3y = (legacy.dbaOperations - snowflake.adminOperations) * 3;
  const toolConsolidation3y =
    (legacy.etlTools + legacy.biOverlap + legacy.dataSharingIntegration) * 3;
  const costOfScaleLegacy = legacyY3 - legacyY1;
  const costOfScaleSnowflake = snowflakeY3 - snowflakeY1;
  const toolsConsolidatedCount = [legacy.etlTools, legacy.biOverlap, legacy.dataSharingIntegration].filter(
    (v) => v > 0
  ).length;

  return {
    legacyY1,
    legacyY2,
    legacyY3,
    legacyTCO3y,
    snowflakeY1,
    snowflakeY2,
    snowflakeY3,
    snowflakeTCO3y,
    netSavings,
    pctSavings,
    roiPct,
    paybackMonths,
    adminReduction3y,
    toolConsolidation3y,
    costOfScaleLegacy,
    costOfScaleSnowflake,
    toolsConsolidatedCount,
  };
}

export interface BusinessValueResults {
  fasterTimeToInsights: number;
  reducedComplexity: number;
  lowerOperationalBurden: number;
  dataSharingEfficiency: number;
  aiReadiness: number;
  productivity: number;
  totalAnnualValue: number;
}

export function computeBusinessValue(
  legacy: LegacyInputs,
  snowflake: SnowflakeInputs,
  tco: TCOResults
): BusinessValueResults {
  const adminReductionAnnual = legacy.dbaOperations - snowflake.adminOperations;
  const toolConsolidationAnnual = legacy.etlTools + legacy.biOverlap + legacy.dataSharingIntegration;
  const fasterTimeToInsights = Math.round(toolConsolidationAnnual * 0.15);
  const reducedComplexity = Math.round((legacy.infrastructure + legacy.performanceTuning) * 0.2);
  const lowerOperationalBurden = adminReductionAnnual;
  const dataSharingEfficiency = Math.round(legacy.dataSharingIntegration * 0.4);
  const aiReadiness = legacy.aiMlInfra > 0 ? Math.round(snowflake.aiExpansion * 0.5) : 0;
  const productivity = Math.round((legacy.dbaOperations + legacy.etlTools) * 0.1);
  const totalAnnualValue =
    fasterTimeToInsights +
    reducedComplexity +
    lowerOperationalBurden +
    dataSharingEfficiency +
    aiReadiness +
    productivity;

  return {
    fasterTimeToInsights,
    reducedComplexity,
    lowerOperationalBurden,
    dataSharingEfficiency,
    aiReadiness,
    productivity,
    totalAnnualValue,
  };
}

export function getDynamicInsight(
  tco: TCOResults,
  legacy: LegacyInputs,
  snowflake: SnowflakeInputs
): string {
  if (tco.netSavings <= 0) {
    return "At these assumptions, the legacy stack is lower cost over 3 years. Adjust legacy cost drivers (e.g. growth rate, tool overlap, ops burden) or Snowflake consumption to reflect a more consolidated, usage-based footprint.";
  }
  const drivers: string[] = [];
  if (tco.adminReduction3y > 500_000) {
    drivers.push("reduced operational overhead");
  }
  if (tco.toolConsolidation3y > 500_000) {
    drivers.push("tool consolidation");
  }
  if (tco.costOfScaleLegacy > tco.costOfScaleSnowflake + 200_000) {
    drivers.push("better economics of scale");
  }
  if (snowflake.aiExpansion > 0 || snowflake.appSharingExpansion > 0) {
    drivers.push("AI and data sharing expansion");
  }
  if (drivers.length === 0) {
    return "Savings come from simplifying the data estate and aligning spend to actual usage. Refine inputs to match the account’s current state for a credible business case.";
  }
  return `If this account is running a fragmented legacy stack, Snowflake’s biggest economic advantage here is ${drivers.join(" and ")} — before AI expansion is even fully in play.`;
}

/** Format currency in thousands/millions for display */
export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`;
  }
  return `$${Math.round(value)}`;
}

/** Preset: typical enterprise (default) */
export const DEFAULT_LEGACY: LegacyInputs = {
  warehouseLicense: 900_000,
  infrastructure: 500_000,
  storage: 250_000,
  dbaOperations: 600_000,
  etlTools: 300_000,
  biOverlap: 150_000,
  dataSharingIntegration: 200_000,
  aiMlInfra: 400_000,
  performanceTuning: 250_000,
  annualGrowthRatePct: 15,
};

export const DEFAULT_SNOWFLAKE: SnowflakeInputs = {
  year1Consumption: 1_200_000,
  consumptionGrowthRatePct: 20,
  storage: 180_000,
  adminOperations: 200_000,
  migrationImplementationY1: 350_000,
  aiExpansion: 250_000,
  appSharingExpansion: 150_000,
};

/** Preset: pharma / life sciences — higher compliance, ops, storage */
export const PHARMA_LEGACY: LegacyInputs = {
  ...DEFAULT_LEGACY,
  dbaOperations: 850_000,
  storage: 380_000,
  dataSharingIntegration: 320_000,
  performanceTuning: 350_000,
  annualGrowthRatePct: 12,
};

export const PHARMA_SNOWFLAKE: SnowflakeInputs = {
  ...DEFAULT_SNOWFLAKE,
  year1Consumption: 1_400_000,
  adminOperations: 280_000,
  migrationImplementationY1: 450_000,
  aiExpansion: 200_000,
  appSharingExpansion: 100_000,
};

/** Preset: financial services — high legacy license, security, tuning */
export const FINANCIAL_LEGACY: LegacyInputs = {
  ...DEFAULT_LEGACY,
  warehouseLicense: 1_200_000,
  infrastructure: 600_000,
  dbaOperations: 800_000,
  performanceTuning: 400_000,
  annualGrowthRatePct: 10,
};

export const FINANCIAL_SNOWFLAKE: SnowflakeInputs = {
  ...DEFAULT_SNOWFLAKE,
  year1Consumption: 1_350_000,
  consumptionGrowthRatePct: 18,
  migrationImplementationY1: 420_000,
  aiExpansion: 300_000,
};

/** Preset: digital native — lower legacy, higher growth, cloud-native */
export const DIGITAL_LEGACY: LegacyInputs = {
  warehouseLicense: 400_000,
  infrastructure: 350_000,
  storage: 180_000,
  dbaOperations: 350_000,
  etlTools: 200_000,
  biOverlap: 100_000,
  dataSharingIntegration: 150_000,
  aiMlInfra: 500_000,
  performanceTuning: 120_000,
  annualGrowthRatePct: 25,
};

export const DIGITAL_SNOWFLAKE: SnowflakeInputs = {
  year1Consumption: 900_000,
  consumptionGrowthRatePct: 35,
  storage: 120_000,
  adminOperations: 140_000,
  migrationImplementationY1: 220_000,
  aiExpansion: 350_000,
  appSharingExpansion: 200_000,
};
