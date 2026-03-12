"use client";

import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { accounts, defaultAccountId } from "@/data/accounts";
import { createInitialAgents } from "@/data/agents";
import { getCompetitorsByAccount } from "@/data/competitors";
import {
  generateEvent,
  generateApprovalRequest,
  updateAgentsFromEvent,
  createInitialOrgNodes,
  advanceOrgNodeOnApproval,
} from "@/lib/simulation";
import type {
  Account,
  Agent,
  SimulationEvent,
  ApprovalRequest,
  OrgNode,
  DealStage,
} from "@/types";

const DEAL_STAGES: { id: DealStage; label: string }[] = [
  { id: "signal_detection", label: "Signal detection" },
  { id: "champion_identified", label: "Champion identified" },
  { id: "pov_selected", label: "POV / use case selected" },
  { id: "pilot_design", label: "Pilot design" },
  { id: "security_review", label: "Security review" },
  { id: "legal_review", label: "Legal review" },
  { id: "procurement", label: "Procurement process" },
  { id: "executive_alignment", label: "Executive alignment" },
  { id: "initial_deployment", label: "Initial deployment" },
  { id: "expansion_phase_1", label: "Expansion phase 1" },
  { id: "expansion_phase_2", label: "Expansion phase 2" },
];

interface AppState {
  accountId: string;
  account: Account;
  agents: Agent[];
  events: SimulationEvent[];
  approvals: ApprovalRequest[];
  orgNodes: OrgNode[];
  currentDealStageIndex: number;
  currentRecommendation: string;
  pipelineTarget: number;
  tick: number;
}

interface AppContextValue extends AppState {
  accounts: Account[];
  competitors: ReturnType<typeof getCompetitorsByAccount>;
  dealStages: { stage: DealStage; label: string; completed: boolean; current: boolean; confidence: number; blockers: string[]; projectedArr: number }[];
  setAccountId: (id: string) => void;
  lastApprovedTitle: string | null;
  clearLastApproved: () => void;
  handleApprove: (approvalId: string, title: string) => void;
  handleReject: (approvalId: string) => void;
  handleModify: (approvalId: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountIdState] = useState(defaultAccountId);
  const [tick, setTick] = useState(0);
  const [agents, setAgents] = useState<Agent[]>(() =>
    createInitialAgents()
  );
  const [events, setEvents] = useState<SimulationEvent[]>(() => {
    const initial: SimulationEvent[] = [];
    for (let i = 0; i < 10; i++) {
      const evt = generateEvent(defaultAccountId, i);
      if (evt) initial.push(evt);
    }
    return initial;
  });
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => {
    const apr = generateApprovalRequest(defaultAccountId, 0);
    return apr ? [apr] : [];
  });
  const [orgNodes, setOrgNodes] = useState<OrgNode[]>(() =>
    createInitialOrgNodes(defaultAccountId)
  );
  const [currentDealStageIndex, setCurrentDealStageIndex] = useState(3);
  const [lastApprovedTitle, setLastApprovedTitle] = useState<string | null>(null);

  const account = accounts.find((a) => a.id === accountId) ?? accounts[0];
  const competitors = getCompetitorsByAccount(accountId);

  const setAccountId = useCallback((id: string) => {
    setAccountIdState(id);
    setAgents(createInitialAgents());
    setEvents([]);
    const apr = generateApprovalRequest(id, 0);
    setApprovals(apr ? [apr] : []);
    setOrgNodes(createInitialOrgNodes(id));
    setCurrentDealStageIndex(3);
    setTick(0);
  }, []);

  // Simulation loop — tuned for 3–4 min demo (events ~3s, approvals ~24s)
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const evt = generateEvent(accountId, tick);
    if (evt) {
      setEvents((prev) => [evt, ...prev].slice(0, 50));
      setAgents((prev) => updateAgentsFromEvent(prev, evt));
    }
  }, [tick, accountId]);

  useEffect(() => {
    if (tick > 0 && tick % 8 === 0) {
      const apr = generateApprovalRequest(accountId, tick);
      if (apr) {
        setApprovals((prev) => [apr, ...prev].filter((a) => a.status === "pending" || a.id === apr.id).slice(0, 5));
      }
    }
  }, [tick, accountId]);

  const clearLastApproved = useCallback(() => setLastApprovedTitle(null), []);

  const handleApprove = useCallback(
    (approvalId: string, title: string) => {
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === approvalId ? { ...a, status: "approved" as const } : a
        )
      );
      setLastApprovedTitle(title);
      setOrgNodes((prev) => advanceOrgNodeOnApproval(prev, title, true));
      setCurrentDealStageIndex((i) => Math.min(i + 1, DEAL_STAGES.length - 1));
    },
    []
  );

  const handleReject = useCallback((approvalId: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId ? { ...a, status: "rejected" as const } : a
      )
    );
  }, []);

  const handleModify = useCallback((approvalId: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId ? { ...a, status: "modified" as const } : a
      )
    );
  }, []);

  const dealStages = DEAL_STAGES.map((s, i) => ({
    ...s,
    completed: i < currentDealStageIndex,
    current: i === currentDealStageIndex,
    confidence: Math.min(95, 60 + (currentDealStageIndex - i) * 10 + Math.floor(tick % 5) * 2),
    blockers: i === currentDealStageIndex ? account.topBlockers.slice(0, 2) : [],
    projectedArr: account.estimatedLandValue * (1 + i * 0.15) + account.estimatedExpansionValue * (i / DEAL_STAGES.length) * 0.5,
  }));

  const pipelineTarget = account.estimatedLandValue + account.estimatedExpansionValue * 0.4;
  const currentRecommendation =
    events[0]?.recommendedAction ??
    `Proceed with ${account.firstWedge}. Schedule discovery call with platform engineering.`;

  const value: AppContextValue = {
    accountId,
    account,
    agents,
    events,
    approvals,
    orgNodes,
    currentDealStageIndex,
    currentRecommendation,
    pipelineTarget,
    tick,
    accounts,
    competitors,
    dealStages,
    setAccountId,
    lastApprovedTitle,
    clearLastApproved,
    handleApprove,
    handleReject,
    handleModify,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
