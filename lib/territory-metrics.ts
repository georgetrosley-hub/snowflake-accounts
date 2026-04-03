import type { TerritoryAccount } from "@/types/territory-map";

export function formatPipelineK(lowK?: number, highK?: number): string {
  if (lowK == null && highK == null) return "—";
  const fmt = (k: number) => {
    if (k >= 1000) return `$${(k / 1000).toFixed(k % 1000 === 0 ? 1 : 1)}M`;
    return `$${k}K`;
  };
  if (lowK != null && highK != null && lowK !== highK) {
    return `${fmt(lowK)}–${fmt(highK)}`;
  }
  const v = lowK ?? highK ?? 0;
  return fmt(v);
}

export function sumPipelineBounds(accounts: TerritoryAccount[]): { low: number; high: number } {
  return accounts.reduce(
    (acc, a) => {
      const lo = a.pipelineLowK ?? 0;
      const hi = a.pipelineHighK ?? a.pipelineLowK ?? 0;
      return { low: acc.low + lo, high: acc.high + Math.max(hi, lo) };
    },
    { low: 0, high: 0 }
  );
}

export function formatTerritoryPotentialRange(lowK: number, highK: number): string {
  if (lowK <= 0 && highK <= 0) return "pipeline TBD";
  return `~${formatPipelineK(lowK, highK)} modeled pipeline (est.)`;
}

export function countMotion(accounts: TerritoryAccount[]) {
  const expansion = accounts.filter((a) => a.motion === "expansion").length;
  const netNew = accounts.filter((a) => a.motion === "net_new_workload").length;
  return { expansion, netNew };
}

export function usageLabel(u: TerritoryAccount["snowflakeUsage"]): string {
  switch (u) {
    case "light":
      return "Light";
    case "heavy":
      return "Heavy";
    default:
      return "Moderate";
  }
}
