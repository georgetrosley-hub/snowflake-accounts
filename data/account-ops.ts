import type {
  Account,
  AccountSignal,
  AccountUpdate,
  Competitor,
  ExecutionItem,
  Stakeholder,
  WorkspaceDraft,
} from "@/types";

function parseSponsor(rawSponsor: string) {
  const match = rawSponsor.match(/^(.*?)\s+\((.*?)\)$/);
  if (!match) {
    return { name: rawSponsor, title: "Executive sponsor" };
  }
  return { name: match[1], title: match[2] };
}

export function buildAccountSignals(
  _account: Account,
  _competitors: Competitor[]
): AccountSignal[] {
  return [];
}

export function buildStakeholders(account: Account): Stakeholder[] {
  return account.executiveSponsors.map((raw, i) => {
    const { name, title } = parseSponsor(raw);
    return {
      id: `${account.id}-exec-${i}`,
      name,
      title,
      team: "Executive",
      stance: "neutral" as const,
      influence: "high" as const,
      relationshipStrength: 0,
      nextStep: "",
      note: "From account profile.",
      lastTouch: "",
      proofNeeded: "",
      recentMoment: "",
      risk: "",
    };
  });
}

export function buildExecutionItems(_account: Account): ExecutionItem[] {
  return [];
}

export function buildWorkspaceDraft(
  account: Account,
  competitors: Competitor[]
): WorkspaceDraft {
  return {
    dealThesis: "",
    winTheme: "",
    thisWeekFocus: "",
    operatorNotes: "",
    opportunityName: `${account.name} · Expansion`,
    acvUsd: "",
    termMonths: "12",
    forecastCategory: "Pipeline",
  };
}

export function buildAccountUpdates(_account: Account): AccountUpdate[] {
  return [];
}

export function getCurrentPhaseLabel(items: ExecutionItem[]) {
  const activeItem =
    items.find((item) => item.status === "blocked") ??
    items.find((item) => item.status === "in_progress") ??
    items.find((item) => item.status === "ready") ??
    items[0];

  return activeItem?.phase ?? "Land";
}
