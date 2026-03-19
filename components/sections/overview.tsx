"use client";

import { useMemo, useRef, useCallback, useState, useEffect } from "react";
import { ArrowRight, Crosshair, CircleDot, Zap, Target } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import type { SectionId } from "@/components/layout/sidebar";
import { MetricCard } from "@/components/ui/metric-card";
import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";
import { useToast } from "@/app/context/toast-context";
import { isStale } from "@/lib/deal-health";
import { getPlansForThisWeek, getPlansForThisWeekShort } from "@/lib/plans-for-week";
import type {
  Account,
  AccountSignal,
  AccountUpdate,
  Competitor,
  ExecutionItem,
  Stakeholder,
  WorkspaceDraft,
} from "@/types";
import type { DealHealthSummary } from "@/lib/deal-health";

function getTodayLabel() {
  const d = new Date();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function formatMillionCurrency(value: number): string | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  return `$${value.toFixed(2)}M`;
}

function formatUpdatedAt(iso?: string): string {
  if (!iso) return "Not refreshed yet";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Not refreshed yet";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface OverviewProps {
  account: Account;
  competitors: Competitor[];
  signals: AccountSignal[];
  stakeholders: Stakeholder[];
  executionItems: ExecutionItem[];
  accountUpdates: AccountUpdate[];
  workspaceDraft: WorkspaceDraft;
  pipelineTarget: number;
  currentRecommendation: string;
  dealHealth: DealHealthSummary;
  onUpdateWorkspaceField: (field: keyof WorkspaceDraft, value: string) => void;
  onAddAccountUpdate: (
    title: string,
    note: string,
    tag: AccountUpdate["tag"]
  ) => void;
  onSectionChange?: (id: SectionId) => void;
}

export function Overview({
  account,
  competitors,
  signals,
  stakeholders,
  executionItems,
  accountUpdates,
  workspaceDraft,
  pipelineTarget,
  currentRecommendation,
  dealHealth,
  onUpdateWorkspaceField,
  onAddAccountUpdate,
  onSectionChange,
}: OverviewProps) {
  const dossierTabs = [
    "Business Overview",
    "Financial Snapshot",
    "10-K / Earnings Signals",
    "Cloud & AI Posture",
    "Competitive Landscape",
    "Snowflake POV",
    "Action Plan",
  ] as const;
  type DossierTab = (typeof dossierTabs)[number];

  const territoryPriorityAccounts = [
    {
      id: "t1-01",
      name: "Tier 1 Account 01",
      industry: "Industry Placeholder",
      why: "Large data estate with high cross-functional demand and executive pressure to improve speed-to-insight.",
      likelyLand: "Governed data serving foundation for a high-visibility business workflow.",
      expansionPath: "Expand into AI-assisted analytics, operational decisioning, and data-sharing products.",
      pressure: "Databricks footprint plus cloud-native status-quo momentum.",
      personas: "CDAO, VP Data Platform, Head of Analytics, Security lead, Procurement.",
      hypothesis: "Team will sponsor a narrow pilot if governance and measurable impact are clear up front.",
      nextMove: "Run executive alignment call and lock 90-day pilot success metrics.",
    },
    {
      id: "t1-02",
      name: "Tier 1 Account 02",
      industry: "Industry Placeholder",
      why: "Clear modernization mandate and fragmented analytics stack creating urgent operational friction.",
      likelyLand: "Unified governed data layer for one mission-critical reporting and planning motion.",
      expansionPath: "Broaden to enterprise-wide data products, AI workloads, and departmental self-service.",
      pressure: "Databricks evaluation active with cloud partner influence.",
      personas: "CIO, Data Engineering Director, Finance analytics leader, Security architect.",
      hypothesis: "Economic buyer will move quickly if we prove consolidation and faster delivery.",
      nextMove: "Secure technical workshop with decision-makers and map incumbent displacement path.",
    },
    {
      id: "t1-03",
      name: "Tier 1 Account 03",
      industry: "Industry Placeholder",
      why: "High-value data assets and strong executive appetite for governed AI deployment at scale.",
      likelyLand: "First workload around governed AI-ready data access for a priority domain team.",
      expansionPath: "Scale to additional domains, partner data exchange, and enterprise AI applications.",
      pressure: "Databricks incumbent plus cloud credits shaping procurement behavior.",
      personas: "Chief Digital Officer, Head of Data Science, Platform owner, Risk and Compliance.",
      hypothesis: "Champion exists if we anchor on risk-controlled speed rather than broad transformation.",
      nextMove: "Identify champion and co-author pilot narrative for steering committee review.",
    },
    {
      id: "t1-04",
      name: "Tier 1 Account 04",
      industry: "Industry Placeholder",
      why: "Large downstream business impact tied to analytics latency and inconsistent governance standards.",
      likelyLand: "Governed performance reporting and workload consolidation for a priority business unit.",
      expansionPath: "Expand into predictive analytics, AI-powered operations, and cross-region data collaboration.",
      pressure: "Databricks technical champions and cloud-native procurement default.",
      personas: "BU President, Head of Data, Enterprise Architect, Information Security, Sourcing.",
      hypothesis: "A tightly scoped business-case pilot can bypass platform politics and accelerate approval.",
      nextMove: "Present value case with timeline, owners, and go-live criteria in next exec readout.",
    },
    {
      id: "t1-05",
      name: "Tier 1 Account 05",
      industry: "Industry Placeholder",
      why: "Active transformation program with budget available but no clear governed platform standard yet.",
      likelyLand: "Initial deployment for secure, shared analytics across key operating teams.",
      expansionPath: "Move into AI productization, external data distribution, and enterprise workload standardization.",
      pressure: "Databricks preferred by engineering and cloud vendor co-sell pressure.",
      personas: "CTO, VP Engineering, Data Governance lead, Line-of-business analytics sponsor.",
      hypothesis: "Cross-functional support increases once we prove governance without slowing delivery.",
      nextMove: "Launch multi-threaded stakeholder plan and convert current interest into pilot commitment.",
    },
  ] as const;
  type PriorityAccount = (typeof territoryPriorityAccounts)[number];

  const [activeDossierId, setActiveDossierId] = useState<PriorityAccount["id"]>(
    territoryPriorityAccounts[0].id
  );
  const [activeDossierTab, setActiveDossierTab] = useState<DossierTab>("Business Overview");
  const [activeBriefingAccountId, setActiveBriefingAccountId] = useState<PriorityAccount["id"]>(
    territoryPriorityAccounts[0].id
  );
  const [activeBriefingWindow, setActiveBriefingWindow] = useState<"24h" | "7d" | "30d" | "12m">("24h");
  const [briefingOutputTitle, setBriefingOutputTitle] = useState("Account Brief");
  const [briefingOutput, setBriefingOutput] = useState<{
    whatChanged: string;
    whyItMatters: string;
    snowflakeImplication: string;
    databricksImplication: string;
    recommendedAction: string;
  } | null>(null);
  const [accountLastUpdated, setAccountLastUpdated] = useState<Record<PriorityAccount["id"], string>>({
    "t1-01": "",
    "t1-02": "",
    "t1-03": "",
    "t1-04": "",
    "t1-05": "",
  });
  const [dossierLastUpdated, setDossierLastUpdated] = useState<string>("");
  const [territoryLastUpdated, setTerritoryLastUpdated] = useState<string>("");
  const [refreshingAccountId, setRefreshingAccountId] = useState<PriorityAccount["id"] | null>(null);
  const [refreshingDossier, setRefreshingDossier] = useState(false);
  const [refreshingTerritory, setRefreshingTerritory] = useState(false);

  const saveToastRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showToast } = useToast();

  const handleWorkspaceFieldChange = useCallback(
    (field: keyof WorkspaceDraft, value: string) => {
      onUpdateWorkspaceField(field, value);
      if (saveToastRef.current) clearTimeout(saveToastRef.current);
      saveToastRef.current = setTimeout(() => {
        showToast("Saved");
        saveToastRef.current = null;
      }, 600);
    },
    [onUpdateWorkspaceField, showToast]
  );
  const topCompetitor = [...competitors].sort((a, b) => b.accountRiskLevel - a.accountRiskLevel)[0];
  const champion = stakeholders.find((stakeholder) => stakeholder.stance === "champion");
  const championCount = stakeholders.filter(
    (stakeholder) => stakeholder.stance === "champion" || stakeholder.stance === "ally"
  ).length;
  const blockedCount = executionItems.filter((item) => item.status === "blocked").length;
  const firstDecision = executionItems.find((item) => item.phase === "Land");
  const expansionItem = executionItems.find((item) => item.phase === "Expansion");

  const todayLabel = useMemo(() => getTodayLabel(), []);
  const topPriority = executionItems.find((i) => i.status === "blocked") ?? executionItems.find((i) => i.status === "in_progress");
  const lastUpdate = accountUpdates[0];
  const plansForThisWeekShort = useMemo(
    () => getPlansForThisWeekShort(accountUpdates, executionItems),
    [accountUpdates, executionItems]
  );

  const blockedItems = executionItems.filter((i) => i.status === "blocked");
  const needsAttention = executionItems.filter(
    (i) => i.decisionRequired && i.decisionStatus === "pending"
  );
  const staleItems = executionItems.filter((i) => isStale(i.lastUpdated));
  const firstPilotValue = formatMillionCurrency(account.estimatedLandValue);
  const expansionPathValue = formatMillionCurrency(account.estimatedExpansionValue);
  const inPlayValue = formatMillionCurrency(pipelineTarget);
  const activeDossierAccount =
    territoryPriorityAccounts.find((priority) => priority.id === activeDossierId) ??
    territoryPriorityAccounts[0];
  const activeBriefingAccount =
    territoryPriorityAccounts.find((priority) => priority.id === activeBriefingAccountId) ??
    territoryPriorityAccounts[0];
  const briefingByAccount: Record<
    PriorityAccount["id"],
    Record<
      "24h" | "7d" | "30d" | "12m",
      {
        keySignals: string;
        whatChanged: string;
        whyItMatters: string;
        snowflakeImplication: string;
        databricksImplication: string;
        nextBestMove: string;
      }
    >
  > = {
    "t1-01": {
      "24h": {
        keySignals: "Leadership team aligning on near-term operating priorities; data reliability surfaced in internal planning rhythm.",
        whatChanged: "Decision owners narrowed to business + platform + security trio.",
        whyItMatters: "Buying motion is becoming more actionable and sponsor-driven.",
        snowflakeImplication: "Lead with governed execution path for one high-visibility workflow.",
        databricksImplication: "Databricks remains default technical option if evaluation scope stays tool-centric.",
        nextBestMove: "Set exec-level discovery call and lock pilot success criteria before architecture deep dive.",
      },
      "7d": {
        keySignals: "Cross-functional alignment improving; urgency around delivery speed increasing.",
        whatChanged: "Stakeholders moved from exploration to shortlist framing.",
        whyItMatters: "Commercial narrative can now influence evaluation criteria.",
        snowflakeImplication: "Anchor on governance + time-to-value in a single workflow.",
        databricksImplication: "Incumbent engineering preference may define requirements if unchallenged.",
        nextBestMove: "Drive workflow-specific scorecard that emphasizes measurable business outcomes.",
      },
      "30d": {
        keySignals: "Transformation cadence established with recurring decision checkpoints.",
        whatChanged: "Risk and control stakeholders now actively shaping path-to-production.",
        whyItMatters: "Deals will favor platforms that satisfy governance without slowing delivery.",
        snowflakeImplication: "Differentiate on enterprise control and cross-team adoption.",
        databricksImplication: "Competitive pressure rises where technical proof is separated from business proof.",
        nextBestMove: "Run joint workshop with business + security + platform to scope first land motion.",
      },
      "12m": {
        keySignals: "Enterprise roadmap points to broader platform standardization and AI operating model maturity.",
        whatChanged: "Decision lens shifted from point capability to durable platform outcomes.",
        whyItMatters: "Long-cycle expansion potential is significant if first workload lands cleanly.",
        snowflakeImplication: "Win first wedge, then expand through adjacent governed AI and data-sharing workloads.",
        databricksImplication: "Long-term incumbent inertia persists without early multi-threaded sponsorship.",
        nextBestMove: "Map year-long expansion sequence before pilot launch to avoid one-off outcome.",
      },
    },
    "t1-02": {
      "24h": {
        keySignals: "Program leads prioritizing simplification and faster reporting cycles.",
        whatChanged: "Current-state friction now framed as business risk, not technical debt alone.",
        whyItMatters: "Economic buyer relevance increased in the near term.",
        snowflakeImplication: "Position Snowflake as low-friction consolidation path with governance confidence.",
        databricksImplication: "Databricks gains if discussion remains centered on engineering preference.",
        nextBestMove: "Secure business-owner interview and quantify one workflow delay impact.",
      },
      "7d": {
        keySignals: "Modernization roadmap discussions now include platform rationalization criteria.",
        whatChanged: "Evaluation shifted from tools to operating model fit.",
        whyItMatters: "Commercial differentiation has more influence than feature parity.",
        snowflakeImplication: "Lead with measurable operating improvement and controlled rollout.",
        databricksImplication: "Competitive narrative likely pushes flexibility and existing familiarity.",
        nextBestMove: "Publish a one-page pilot charter with owners, timeline, and governance gates.",
      },
      "30d": {
        keySignals: "Stakeholder map expanded to finance and procurement oversight.",
        whatChanged: "Buying process formalized with clearer risk/return scrutiny.",
        whyItMatters: "Decision quality will favor business-case clarity over technical novelty.",
        snowflakeImplication: "Use outcome-linked business case as primary selling asset.",
        databricksImplication: "Cloud and incumbent momentum can sway procurement without business proof.",
        nextBestMove: "Lead executive session on KPI-linked pilot outcomes and approval path.",
      },
      "12m": {
        keySignals: "Account trajectory indicates phased consolidation with broad AI-readiness ambition.",
        whatChanged: "Strategic intent moved from tactical fixes to platform-level governance standards.",
        whyItMatters: "Expansion path is material if first deployment creates repeatable trust.",
        snowflakeImplication: "Design first land to be replicable across adjacent departments.",
        databricksImplication: "Entrenched defaults will harden if no early executive win is secured.",
        nextBestMove: "Pre-wire expansion playbook with two follow-on workloads before first signature.",
      },
    },
    "t1-03": {
      "24h": {
        keySignals: "AI discussions are active with explicit risk and governance language.",
        whatChanged: "Pilot appetite increased, but only with clear controls.",
        whyItMatters: "Timing is favorable for a governed-first land message.",
        snowflakeImplication: "Position first motion as AI-ready data execution with enterprise safeguards.",
        databricksImplication: "Technical teams may default to existing patterns absent a business-led wedge.",
        nextBestMove: "Align champion on one AI-adjacent workflow with measurable success metrics.",
      },
      "7d": {
        keySignals: "Stakeholders converging around practical use-case sequencing.",
        whatChanged: "From broad AI ambition to specific deployment requirements.",
        whyItMatters: "Decision process is now concrete enough for commercial planning.",
        snowflakeImplication: "Frame Snowflake as governed execution layer for business-ready AI.",
        databricksImplication: "Databricks retains influence where evaluation is purely model/engineering oriented.",
        nextBestMove: "Run discovery on deployment blockers and governance acceptance criteria.",
      },
      "30d": {
        keySignals: "Cross-functional teams coordinating around risk and rollout cadence.",
        whatChanged: "Security and compliance moved from late-stage check to core decision makers.",
        whyItMatters: "Platform choice will be determined by production readiness, not prototypes.",
        snowflakeImplication: "Emphasize controlled deployment velocity and enterprise governance.",
        databricksImplication: "Competitive threat increases if proof-of-concept success is mistaken for production readiness.",
        nextBestMove: "Co-author production pilot plan with security stakeholder sponsorship.",
      },
      "12m": {
        keySignals: "Long-term posture points to scaled AI adoption tied to governed data foundations.",
        whatChanged: "Roadmap orientation shifted toward reusable operating patterns.",
        whyItMatters: "Landing the first governed workflow can unlock broad platform expansion.",
        snowflakeImplication: "Build expansion around repeatable domain rollouts and shared governance model.",
        databricksImplication: "Persistent technical incumbency can block enterprise standardization without executive proof.",
        nextBestMove: "Define multi-domain expansion blueprint aligned to annual planning cycle.",
      },
    },
    "t1-04": {
      "24h": {
        keySignals: "BU leaders highlighting operational performance pressure tied to analytics consistency.",
        whatChanged: "Business unit urgency overtook enterprise architecture debate.",
        whyItMatters: "Opportunity to land through accountable BU execution.",
        snowflakeImplication: "Target one high-impact BU workflow and prove governed delivery speed.",
        databricksImplication: "Databricks may keep technical advantage if BU pain is not converted into buyer urgency.",
        nextBestMove: "Secure BU sponsor and formalize pilot with enterprise governance observers.",
      },
      "7d": {
        keySignals: "Decision governance expanding across business, platform, and risk functions.",
        whatChanged: "Pilot criteria now include rollout confidence and supportability.",
        whyItMatters: "Commercial strategy must address both local value and enterprise control.",
        snowflakeImplication: "Show how one BU win can scale without creating governance debt.",
        databricksImplication: "Cloud-default pathways can appear safer if expansion story is vague.",
        nextBestMove: "Present phased land-to-expand path anchored in BU KPI movement.",
      },
      "30d": {
        keySignals: "Evaluation cadence stabilized with formal checkpoints.",
        whatChanged: "Procurement and risk teams are exerting stronger influence.",
        whyItMatters: "Deal success depends on operational credibility and risk clarity.",
        snowflakeImplication: "Lead with predictable deployment and governance-ready operating model.",
        databricksImplication: "Competitive risk rises if scoring model ignores business workflow outcomes.",
        nextBestMove: "Shape evaluation rubric around governance + business impact for target workflow.",
      },
      "12m": {
        keySignals: "Roadmap indicates cross-BU standardization opportunity after first measurable success.",
        whatChanged: "Strategic horizon moved from tactical fixes to platform-level consistency.",
        whyItMatters: "Large expansion possible if first BU motion becomes enterprise template.",
        snowflakeImplication: "Design first deployment as blueprint for adjacent BU rollouts.",
        databricksImplication: "Entrenched technical paths persist without early executive endorsement.",
        nextBestMove: "Establish executive review cadence linking pilot outcomes to expansion decisions.",
      },
    },
    "t1-05": {
      "24h": {
        keySignals: "Transformation stakeholders pushing for practical progress in near-term planning cycle.",
        whatChanged: "Discussion shifted from vision to executable first motion.",
        whyItMatters: "Window is open to define the evaluation narrative.",
        snowflakeImplication: "Lead with governed analytics layer that supports immediate operating decisions.",
        databricksImplication: "Databricks influence remains high where engineering defaults are unchallenged.",
        nextBestMove: "Run account planning call to align business outcomes and pilot scope.",
      },
      "7d": {
        keySignals: "Cross-functional teams converging on risk-managed rollout expectations.",
        whatChanged: "Governance and execution quality became explicit decision criteria.",
        whyItMatters: "Outcome-led positioning can outweigh pure technical preference.",
        snowflakeImplication: "Position Snowflake as enterprise-safe acceleration path.",
        databricksImplication: "Competitive threat is strongest if selection remains team-by-team.",
        nextBestMove: "Create unified decision brief for business, security, and platform stakeholders.",
      },
      "30d": {
        keySignals: "Procurement and architecture engagement indicates formal buy-cycle progression.",
        whatChanged: "Evaluation moving from interest to structured comparison.",
        whyItMatters: "Need clear commercial and governance differentiation now.",
        snowflakeImplication: "Use workflow-based proof and governance narrative to guide scoring.",
        databricksImplication: "Cloud co-sell and incumbent familiarity can dominate absent clear business case.",
        nextBestMove: "Deliver comparative POV focused on business risk, speed, and control.",
      },
      "12m": {
        keySignals: "Longer-term trajectory suggests potential platform standardization across multiple workloads.",
        whatChanged: "Planning horizon expanded from pilot to operating model durability.",
        whyItMatters: "Early land design will determine expansion ceiling.",
        snowflakeImplication: "Architect first deal for repeatable expansion into AI and shared data motions.",
        databricksImplication: "Default incumbency hardens over time without early executive-level win.",
        nextBestMove: "Map 12-month expansion sequencing and executive sponsors before launch.",
      },
    },
  };
  const activeBriefing = briefingByAccount[activeBriefingAccount.id][activeBriefingWindow];
  const buildAccountBrief = useCallback(() => {
    setBriefingOutputTitle(`${activeBriefingAccount.name} · ${activeBriefingWindow} Account Brief`);
    setBriefingOutput({
      whatChanged: activeBriefing.whatChanged,
      whyItMatters: activeBriefing.whyItMatters,
      snowflakeImplication: activeBriefing.snowflakeImplication,
      databricksImplication: activeBriefing.databricksImplication,
      recommendedAction: activeBriefing.nextBestMove,
    });
    showToast("Account brief generated");
  }, [activeBriefing, activeBriefingAccount.name, activeBriefingWindow, showToast]);

  const buildTerritoryBrief = useCallback(() => {
    const windows = briefingByAccount;
    const allAccounts = territoryPriorityAccounts.map((a) => a.name).join(", ");
    setBriefingOutputTitle(`Full Territory Brief · ${activeBriefingWindow}`);
    setBriefingOutput({
      whatChanged: `Priority-account motion across ${allAccounts} shifted toward clearer sponsor ownership and tighter evaluation criteria in the ${activeBriefingWindow} window.`,
      whyItMatters: "The territory is moving from discovery to decision framing; this is where evaluation rules and win rates are set.",
      snowflakeImplication:
        "Lead with governed execution in high-urgency workflows and keep expansion narrative explicit from the first pilot.",
      databricksImplication:
        "Databricks retains default technical momentum where business workflow outcomes are not explicitly tied to the evaluation.",
      recommendedAction:
        "Run one weekly executive cadence across Tier 1 accounts: confirm sponsor, lock pilot criteria, and pre-wire next expansion workload.",
    });
    setTerritoryLastUpdated(new Date().toISOString());
    void windows;
    showToast("Full territory brief generated");
  }, [activeBriefingWindow, territoryPriorityAccounts, briefingByAccount, showToast]);

  const refreshTerritoryBrief = useCallback(async () => {
    setRefreshingTerritory(true);
    await new Promise((resolve) => setTimeout(resolve, 950));
    const nowIso = new Date().toISOString();
    setTerritoryLastUpdated(nowIso);
    setRefreshingTerritory(false);
    showToast("Territory brief refreshed");
  }, [showToast]);

  const copyNotebookPrompt = useCallback(async () => {
    const source = briefingOutput ?? {
      whatChanged: activeBriefing.whatChanged,
      whyItMatters: activeBriefing.whyItMatters,
      snowflakeImplication: activeBriefing.snowflakeImplication,
      databricksImplication: activeBriefing.databricksImplication,
      recommendedAction: activeBriefing.nextBestMove,
    };
    const prompt = [
      `Territory Briefing`,
      `Account: ${activeBriefingAccount.name}`,
      `Window: ${activeBriefingWindow}`,
      ``,
      `What changed: ${source.whatChanged}`,
      `Why it matters: ${source.whyItMatters}`,
      `Snowflake implication: ${source.snowflakeImplication}`,
      `Databricks implication: ${source.databricksImplication}`,
      `Recommended action: ${source.recommendedAction}`,
      ``,
      `Rewrite this in executive format with bullet points and keep it under 180 words.`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(prompt);
      showToast("NotebookLM prompt copied");
    } catch {
      showToast("Copy failed");
    }
  }, [activeBriefing, activeBriefingAccount.name, activeBriefingWindow, briefingOutput, showToast]);

  const exportPdf = useCallback(() => {
    window.print();
    showToast("Print dialog opened");
  }, [showToast]);
  const weeklyOperatingPriorities = [
    {
      title: "Secure Tier 1 pilot scope and sponsor alignment",
      whyNow: "Decision criteria are still being shaped this week.",
      targetAccount: "Tier 1 Account 01",
      expectedOutcome: "Approved 90-day pilot charter with success metrics.",
    },
    {
      title: "Run consolidation discovery on highest-friction workflow",
      whyNow: "Business pain is now explicit and sponsor-visible.",
      targetAccount: "Tier 1 Account 02",
      expectedOutcome: "Validated land use case with quantified urgency.",
    },
    {
      title: "Lock governance path for AI-adjacent first deployment",
      whyNow: "Security stakeholders are active early in this cycle.",
      targetAccount: "Tier 1 Account 03",
      expectedOutcome: "Agreed deployment guardrails and approval path.",
    },
    {
      title: "Convert BU urgency into enterprise-backed pilot motion",
      whyNow: "BU performance pressure is creating fast executive air cover.",
      targetAccount: "Tier 1 Account 04",
      expectedOutcome: "Named BU sponsor and cross-functional deal team.",
    },
    {
      title: "Publish competitive POV before formal vendor scoring",
      whyNow: "Procurement process is moving from interest to comparison.",
      targetAccount: "Tier 1 Account 05",
      expectedOutcome: "Evaluation rubric aligned to governance and business outcomes.",
    },
  ] as const;
  const dossierInsights = useMemo(() => {
    const p = activeDossierAccount;
    return {
      business: {
        filings: "Public disclosures indicate enterprise modernization priorities with governance and execution consistency themes.",
        earnings: "Leadership commentary signals pressure for faster delivery and higher productivity from core data initiatives.",
        signals: `Current public signal set points to active transformation motion in ${p.industry}.`,
        inference: `${p.name} likely prioritizes outcomes that improve decision velocity without increasing risk exposure.`,
      },
      financial: {
        filings: "Language in filings supports selective investment tied to measurable business outcomes.",
        earnings: "Earnings framing suggests phased commitments over broad upfront platform changes.",
        signals: "Program cadence and hiring patterns indicate appetite for practical, staged execution.",
        inference: "A narrowly scoped pilot with explicit success criteria is the lowest-friction buying path.",
      },
      earnings10k: {
        filings: "Risk sections typically emphasize execution complexity, governance obligations, and change-management risk.",
        earnings: "Calls emphasize accountability for delivery speed and operational resilience.",
        signals: "Stakeholder ownership appears cross-functional across business, platform, and risk teams.",
        inference: "Win probability increases when governance and speed are solved in the same first motion.",
      },
      cloudAi: {
        filings: "Public messaging suggests cloud modernization with control and compliance as baseline requirements.",
        earnings: "AI priorities are framed as practical productivity gains, not speculative experimentation.",
        signals: `Current hypothesis indicates ${p.pressure.toLowerCase()}.`,
        inference: "Do not assume exact spend or vendor footprint; lead with governed execution posture instead.",
      },
      competitive: {
        filings: "Incumbent and default-path inertia are likely embedded in current operating models.",
        earnings: "Leadership appears open to alternatives that reduce complexity while preserving control.",
        signals: `Observed pressure today: ${p.pressure}`,
        inference: "Position against Databricks on enterprise governance, cross-functional adoption, and measurable workflow outcomes.",
      },
      snowflakePov: {
        bestLand: p.likelyLand,
        expansionPath: p.expansionPath,
        positioningVsDatabricks:
          "Compete on governed enterprise execution: faster path to measurable business outcomes with lower cross-team coordination risk.",
        filings: "Governance and execution themes support a control-first commercial entry.",
        earnings: "Productivity themes support outcomes-led pilot economics.",
        signals: `Public signals and account hypothesis indicate urgency around ${p.nextMove.toLowerCase()}.`,
        inference: "Land narrow, prove impact, then expand through adjacent workloads.",
      },
      actionPlan: {
        discoveryAngles: [
          "Where does delayed data-to-decision flow create the highest business cost right now?",
          "What governance blockers are slowing deployment confidence across teams?",
          "Which 90-day result would justify expansion sponsorship from leadership?",
        ],
        talkTracks: [
          "We can improve delivery speed without trading away governance.",
          "Start with one workflow that leadership already cares about and prove value fast.",
          "This is a territory execution decision, not just a tooling preference debate.",
        ],
        nextSteps: [
          p.nextMove,
          "Run a cross-functional discovery session with business, platform, and security.",
          "Lock pilot scope, success metrics, and executive review cadence.",
        ],
        filings: "Control and execution language supports a disciplined pilot path.",
        earnings: "Outcome accountability supports a measurable first-motion narrative.",
        signals: "Public indicators support immediate qualification and stakeholder threading.",
        inference: "Move now while evaluation criteria are still being shaped.",
      },
    };
  }, [activeDossierAccount]);

  const renderLabeledInsight = (
    label: "From filings" | "From earnings" | "Public signals" | "Inference",
    text: string,
    emphasize = false
  ) => (
    <div
      className={`rounded-xl p-3 ${
        emphasize
          ? "border border-accent/25 bg-accent/[0.06]"
          : "border border-surface-border/50 bg-surface-muted/30"
      }`}
    >
      <p
        className={`text-[10px] uppercase tracking-[0.1em] ${
          emphasize ? "text-accent/90" : "text-text-faint"
        }`}
      >
        {label}
      </p>
      <p className="mt-1.5 text-[12px] text-text-secondary">{text}</p>
    </div>
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem("snowflake-territory-intelligence-state");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        accountLastUpdated?: Record<PriorityAccount["id"], string>;
        dossierLastUpdated?: string;
        territoryLastUpdated?: string;
        briefingOutputTitle?: string;
        briefingOutput?: typeof briefingOutput;
      };
      if (parsed.accountLastUpdated) setAccountLastUpdated(parsed.accountLastUpdated);
      if (parsed.dossierLastUpdated) setDossierLastUpdated(parsed.dossierLastUpdated);
      if (parsed.territoryLastUpdated) setTerritoryLastUpdated(parsed.territoryLastUpdated);
      if (parsed.briefingOutputTitle) setBriefingOutputTitle(parsed.briefingOutputTitle);
      if (parsed.briefingOutput) setBriefingOutput(parsed.briefingOutput);
    } catch {
      // Keep defaults if persisted state cannot be parsed.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "snowflake-territory-intelligence-state",
        JSON.stringify({
          accountLastUpdated,
          dossierLastUpdated,
          territoryLastUpdated,
          briefingOutputTitle,
          briefingOutput,
        })
      );
    } catch {
      // Ignore persistence errors.
    }
  }, [accountLastUpdated, dossierLastUpdated, territoryLastUpdated, briefingOutputTitle, briefingOutput]);

  const refreshAccount = useCallback(
    async (accountId: PriorityAccount["id"]) => {
      setRefreshingAccountId(accountId);
      await new Promise((resolve) => setTimeout(resolve, 850));
      const nowIso = new Date().toISOString();
      setAccountLastUpdated((prev) => ({ ...prev, [accountId]: nowIso }));
      setRefreshingAccountId(null);
      showToast("Account intelligence refreshed");
    },
    [showToast]
  );

  const generateAccountPov = useCallback(
    (accountId: PriorityAccount["id"]) => {
      setActiveDossierId(accountId);
      setActiveDossierTab("Snowflake POV");
      setBriefingOutputTitle(
        `${territoryPriorityAccounts.find((p) => p.id === accountId)?.name ?? "Tier 1 Account"} · Account POV`
      );
      const p = territoryPriorityAccounts.find((priority) => priority.id === accountId) ?? territoryPriorityAccounts[0];
      setBriefingOutput({
        whatChanged: `Stakeholder motion around ${p.name} is becoming more decision-oriented and workflow-specific.`,
        whyItMatters: "The best time to shape evaluation criteria is before requirements harden around incumbent defaults.",
        snowflakeImplication: `Lead with ${p.likelyLand.toLowerCase()} and tie it to executive-level business outcomes.`,
        databricksImplication: "Databricks remains strong when evaluations stay tool-first instead of outcome-first.",
        recommendedAction: p.nextMove,
      });
      showToast("Account POV generated");
    },
    [territoryPriorityAccounts, showToast]
  );

  const refreshDossierAnalysis = useCallback(async () => {
    setRefreshingDossier(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const nowIso = new Date().toISOString();
    setDossierLastUpdated(nowIso);
    setRefreshingDossier(false);
    showToast("Dossier analysis refreshed");
  }, [showToast]);

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero */}
      <div className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SnowflakeLogoIcon size={32} className="shrink-0 opacity-95" />
            <div>
              <h1 className="text-[18px] font-semibold tracking-tight text-text-primary sm:text-[20px]">
                How I Would Operate and Expand This Snowflake Territory
              </h1>
              <p className="mt-0.5 text-[13px] text-text-muted">
                A practical system for prioritizing accounts, tracking market signals, and converting insight into action.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-text-secondary">
          This territory view is built for execution cadence: clear priorities, active deal movement, and disciplined expansion planning.
        </p>
      </div>

      {/* Territory priorities */}
      <section className="space-y-4">
        <SectionHeader
          title="Territory priorities"
          subtitle="Top five Tier 1 accounts I would run immediately, with clear land motion, expansion thesis, and next move."
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {territoryPriorityAccounts.map((priority) => (
            <article
              key={priority.id}
              className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-semibold text-text-primary">{priority.name}</h3>
                  <p className="mt-0.5 text-[12px] text-text-muted">{priority.industry}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-accent/30 bg-accent/[0.08] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-accent">
                    Tier 1
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-text-faint">
                    Immediate Focus
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5 text-[12px] leading-relaxed">
                <p><span className="font-semibold text-text-primary">Why This Account Matters:</span> <span className="text-text-secondary">{priority.why}</span></p>
                <p><span className="font-semibold text-text-primary">Likely Land:</span> <span className="text-text-secondary">{priority.likelyLand}</span></p>
                <p><span className="font-semibold text-text-primary">Expansion Path:</span> <span className="text-text-secondary">{priority.expansionPath}</span></p>
                <p><span className="font-semibold text-text-primary">Competitive Pressure:</span> <span className="text-text-secondary">{priority.pressure}</span></p>
                <p><span className="font-semibold text-text-primary">Key Personas:</span> <span className="text-text-secondary">{priority.personas}</span></p>
                <p><span className="font-semibold text-text-primary">Current Hypothesis:</span> <span className="text-text-secondary">{priority.hypothesis}</span></p>
                <p><span className="font-semibold text-text-primary">Next Best Move:</span> <span className="text-text-secondary">{priority.nextMove}</span></p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => refreshAccount(priority.id)}
                  disabled={refreshingAccountId === priority.id}
                  className="rounded-lg border border-surface-border/60 bg-surface-muted/40 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text-primary disabled:opacity-60"
                >
                  {refreshingAccountId === priority.id ? "Refreshing..." : "Refresh Account"}
                </button>
                <button
                  type="button"
                  onClick={() => generateAccountPov(priority.id)}
                  className="rounded-lg border border-accent/30 bg-accent/[0.08] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-accent transition-colors hover:bg-accent/[0.14]"
                >
                  Generate Account POV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDossierId(priority.id);
                    setActiveDossierTab("Business Overview");
                    document
                      .getElementById("account-dossier-view")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="rounded-lg border border-accent/30 bg-accent/[0.08] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-accent transition-colors hover:bg-accent/[0.14]"
                >
                  Open Account Dossier
                </button>
              </div>
              <p className="mt-2 text-[10px] text-text-faint">
                Last updated: {formatUpdatedAt(accountLastUpdated[priority.id])}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-6">
        <SectionHeader
          title="Daily Account Briefing"
          subtitle="How I stay current on account movement and convert signals into decisive field action."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {territoryPriorityAccounts.map((priority) => (
            <button
              key={priority.id}
              type="button"
              onClick={() => setActiveBriefingAccountId(priority.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeBriefingAccountId === priority.id
                  ? "border border-accent/30 bg-accent/[0.10] text-accent"
                  : "border border-surface-border/50 bg-surface-muted/40 text-text-muted hover:border-accent/20 hover:text-text-secondary"
              }`}
            >
              {priority.name}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["24h", "7d", "30d", "12m"] as const).map((window) => (
            <button
              key={window}
              type="button"
              onClick={() => setActiveBriefingWindow(window)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeBriefingWindow === window
                  ? "border border-accent/30 bg-accent/[0.10] text-accent"
                  : "border border-surface-border/50 bg-surface-muted/40 text-text-muted hover:border-accent/20 hover:text-text-secondary"
              }`}
            >
              {window}
            </button>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-surface-border/50 bg-surface-muted/30 p-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-text-faint">Key signals</p>
            <p className="mt-1.5 text-[12px] text-text-secondary">{activeBriefing.keySignals}</p>
          </div>
          <div className="rounded-xl border border-surface-border/50 bg-surface-muted/30 p-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-text-faint">What changed</p>
            <p className="mt-1.5 text-[12px] text-text-secondary">{activeBriefing.whatChanged}</p>
          </div>
          <div className="rounded-xl border border-surface-border/50 bg-surface-muted/30 p-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-text-faint">Why it matters</p>
            <p className="mt-1.5 text-[12px] text-text-secondary">{activeBriefing.whyItMatters}</p>
          </div>
          <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-accent/90">Snowflake implication</p>
            <p className="mt-1.5 text-[12px] text-text-secondary">{activeBriefing.snowflakeImplication}</p>
          </div>
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.05] p-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-rose-300/90">Databricks implication</p>
            <p className="mt-1.5 text-[12px] text-text-secondary">{activeBriefing.databricksImplication}</p>
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-emerald-300/90">Next best move</p>
            <p className="mt-1.5 text-[12px] text-text-secondary">{activeBriefing.nextBestMove}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-6">
        <SectionHeader
          title="Territory Briefing Engine"
          subtitle="Field execution tool for fast, executive-ready account and territory briefings."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={refreshTerritoryBrief}
            disabled={refreshingTerritory}
            className="rounded-lg border border-surface-border/60 bg-surface-muted/40 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text-primary disabled:opacity-60"
          >
            {refreshingTerritory ? "Refreshing..." : "Refresh Territory Brief"}
          </button>
          <button
            type="button"
            onClick={buildAccountBrief}
            className="rounded-lg border border-accent/30 bg-accent/[0.08] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-accent transition-colors hover:bg-accent/[0.14]"
          >
            Generate Account Brief
          </button>
          <button
            type="button"
            onClick={buildTerritoryBrief}
            className="rounded-lg border border-accent/30 bg-accent/[0.08] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-accent transition-colors hover:bg-accent/[0.14]"
          >
            Generate Full Territory Brief
          </button>
          <button
            type="button"
            onClick={copyNotebookPrompt}
            className="rounded-lg border border-surface-border/60 bg-surface-muted/40 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text-primary"
          >
            Copy NotebookLM Prompt
          </button>
          <button
            type="button"
            onClick={exportPdf}
            className="rounded-lg border border-surface-border/60 bg-surface-muted/40 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text-primary"
          >
            Export PDF
          </button>
          <p className="ml-auto self-center text-[10px] text-text-faint">
            Last updated: {formatUpdatedAt(territoryLastUpdated)}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-surface-border/50 bg-surface-muted/30 p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-text-faint">
            {briefingOutputTitle}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-surface-border/50 bg-surface-elevated/40 p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-text-faint">What changed</p>
              <p className="mt-1 text-[12px] text-text-secondary">
                {briefingOutput?.whatChanged ?? activeBriefing.whatChanged}
              </p>
            </div>
            <div className="rounded-lg border border-surface-border/50 bg-surface-elevated/40 p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-text-faint">Why it matters</p>
              <p className="mt-1 text-[12px] text-text-secondary">
                {briefingOutput?.whyItMatters ?? activeBriefing.whyItMatters}
              </p>
            </div>
            <div className="rounded-lg border border-accent/25 bg-accent/[0.06] p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-accent/90">Snowflake implication</p>
              <p className="mt-1 text-[12px] text-text-secondary">
                {briefingOutput?.snowflakeImplication ?? activeBriefing.snowflakeImplication}
              </p>
            </div>
            <div className="rounded-lg border border-rose-400/20 bg-rose-400/[0.05] p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-rose-300/90">Databricks implication</p>
              <p className="mt-1 text-[12px] text-text-secondary">
                {briefingOutput?.databricksImplication ?? activeBriefing.databricksImplication}
              </p>
            </div>
          </div>
          <div className="mt-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.05] p-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-emerald-300/90">Recommended action</p>
            <p className="mt-1 text-[12px] text-text-secondary">
              {briefingOutput?.recommendedAction ?? activeBriefing.nextBestMove}
            </p>
          </div>
        </div>
      </section>

      <section
        id="account-dossier-view"
        className="rounded-2xl border border-surface-border/50 bg-surface-elevated/30 p-4 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
              Account Dossier
            </p>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-text-primary">
              {activeDossierAccount.name}
            </h2>
            <p className="mt-1 text-[12px] text-text-muted">
              {activeDossierAccount.industry} · Tier 1 · Immediate Focus
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {dossierTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveDossierTab(tab)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                activeDossierTab === tab
                  ? "border border-accent/30 bg-accent/[0.10] text-accent"
                  : "border border-surface-border/50 bg-surface-muted/40 text-text-muted hover:border-accent/20 hover:text-text-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={refreshDossierAnalysis}
            disabled={refreshingDossier}
            className="rounded-lg border border-surface-border/60 bg-surface-muted/40 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text-primary disabled:opacity-60"
          >
            {refreshingDossier ? "Refreshing..." : "Refresh Analysis"}
          </button>
          <button
            type="button"
            onClick={buildAccountBrief}
            className="rounded-lg border border-accent/30 bg-accent/[0.08] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-accent transition-colors hover:bg-accent/[0.14]"
          >
            Generate Brief
          </button>
          <button
            type="button"
            onClick={copyNotebookPrompt}
            className="rounded-lg border border-surface-border/60 bg-surface-muted/40 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text-primary"
          >
            Copy NotebookLM Prompt
          </button>
          <button
            type="button"
            onClick={exportPdf}
            className="rounded-lg border border-surface-border/60 bg-surface-muted/40 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-accent/20 hover:text-text-primary"
          >
            Export PDF
          </button>
          <p className="ml-auto text-[10px] text-text-faint">
            Last updated: {formatUpdatedAt(dossierLastUpdated)}
          </p>
        </div>

        {activeDossierTab === "Business Overview" && (
          <div className="mt-5 space-y-3">
            {renderLabeledInsight("From filings", dossierInsights.business.filings)}
            {renderLabeledInsight("From earnings", dossierInsights.business.earnings)}
            {renderLabeledInsight("Public signals", dossierInsights.business.signals)}
            {renderLabeledInsight("Inference", dossierInsights.business.inference, true)}
          </div>
        )}

        {activeDossierTab === "Financial Snapshot" && (
          <div className="mt-5 space-y-3">
            {renderLabeledInsight("From filings", dossierInsights.financial.filings)}
            {renderLabeledInsight("From earnings", dossierInsights.financial.earnings)}
            {renderLabeledInsight("Public signals", dossierInsights.financial.signals)}
            {renderLabeledInsight("Inference", dossierInsights.financial.inference, true)}
          </div>
        )}

        {activeDossierTab === "10-K / Earnings Signals" && (
          <div className="mt-5 space-y-3">
            {renderLabeledInsight("From filings", dossierInsights.earnings10k.filings)}
            {renderLabeledInsight("From earnings", dossierInsights.earnings10k.earnings)}
            {renderLabeledInsight("Public signals", dossierInsights.earnings10k.signals)}
            {renderLabeledInsight("Inference", dossierInsights.earnings10k.inference, true)}
          </div>
        )}

        {activeDossierTab === "Cloud & AI Posture" && (
          <div className="mt-5 space-y-3">
            {renderLabeledInsight("From filings", dossierInsights.cloudAi.filings)}
            {renderLabeledInsight("From earnings", dossierInsights.cloudAi.earnings)}
            {renderLabeledInsight("Public signals", dossierInsights.cloudAi.signals)}
            {renderLabeledInsight("Inference", dossierInsights.cloudAi.inference, true)}
          </div>
        )}

        {activeDossierTab === "Competitive Landscape" && (
          <div className="mt-5 space-y-3">
            {renderLabeledInsight("From filings", dossierInsights.competitive.filings)}
            {renderLabeledInsight("From earnings", dossierInsights.competitive.earnings)}
            {renderLabeledInsight("Public signals", dossierInsights.competitive.signals)}
            {renderLabeledInsight("Inference", dossierInsights.competitive.inference, true)}
          </div>
        )}

        {activeDossierTab === "Snowflake POV" && (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-accent/90">Best Land</p>
              <p className="mt-1.5 text-[12px] text-text-secondary">{dossierInsights.snowflakePov.bestLand}</p>
            </div>
            <div className="rounded-xl border border-surface-border/50 bg-surface-muted/30 p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-text-faint">Expansion Path</p>
              <p className="mt-1.5 text-[12px] text-text-secondary">{dossierInsights.snowflakePov.expansionPath}</p>
            </div>
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.05] p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-rose-300/90">Positioning vs Databricks</p>
              <p className="mt-1.5 text-[12px] text-text-secondary">{dossierInsights.snowflakePov.positioningVsDatabricks}</p>
            </div>
            {renderLabeledInsight("From filings", dossierInsights.snowflakePov.filings)}
            {renderLabeledInsight("From earnings", dossierInsights.snowflakePov.earnings)}
            {renderLabeledInsight("Public signals", dossierInsights.snowflakePov.signals)}
            {renderLabeledInsight("Inference", dossierInsights.snowflakePov.inference, true)}
          </div>
        )}

        {activeDossierTab === "Action Plan" && (
          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-surface-border/50 bg-surface-muted/30 p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-text-faint">Discovery Angles</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[12px] text-text-secondary">
                {dossierInsights.actionPlan.discoveryAngles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-surface-border/50 bg-surface-muted/30 p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-text-faint">Talk Tracks</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[12px] text-text-secondary">
                {dossierInsights.actionPlan.talkTracks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-3">
              <p className="text-[10px] uppercase tracking-[0.1em] text-accent/90">Next Steps</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[12px] text-text-secondary">
                {dossierInsights.actionPlan.nextSteps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {renderLabeledInsight("From filings", dossierInsights.actionPlan.filings)}
            {renderLabeledInsight("From earnings", dossierInsights.actionPlan.earnings)}
            {renderLabeledInsight("Public signals", dossierInsights.actionPlan.signals)}
            {renderLabeledInsight("Inference", dossierInsights.actionPlan.inference, true)}
          </div>
        )}

        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <p className="text-[10px] text-text-faint">
            Fact/inference labels separate observed public context from strategy interpretation. No exact cloud spend or vendor usage values are asserted.
          </p>
        </div>
      </section>

      {/* Territory execution snapshot */}
      <section className="space-y-4">
        <SectionHeader
          title="Territory execution snapshot"
          subtitle="Current wedge economics, stakeholder coverage, and expansion posture across the patch."
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Revenue in motion"
            value={inPlayValue ?? "Priority accounts scoped"}
            subtitle={inPlayValue ? "Near-term land + expansion focus" : "Current week is focused on qualification and wedge definition"}
          />
          <MetricCard
            label="First pilot"
            value={firstPilotValue ?? "Pilot scope in progress"}
            subtitle={account.firstWedge}
          />
          <MetricCard
            label="Expansion path"
            value={expansionPathValue ?? "Expansion thesis defined"}
            subtitle={account.topExpansionPaths[0]}
          />
          <MetricCard
            label="Deal coverage"
            value={`${championCount} active threads`}
            subtitle={`${blockedCount} blocker${blockedCount === 1 ? "" : "s"} requiring active management`}
          />
        </div>
      </section>

      {/* Account execution */}
      <section className="rounded-2xl border border-surface-border bg-surface-elevated p-4 sm:p-6 shadow-elevated">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
              {todayLabel} · {account.name}
            </p>
            <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
              Account execution
            </h1>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-medium ${
              dealHealth.status === "healthy"
                ? "bg-emerald-500/10 text-emerald-400/90"
                : dealHealth.status === "attention"
                  ? "bg-accent/10 text-accent/90"
                  : "bg-rose-500/10 text-rose-400/90"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                dealHealth.status === "healthy"
                  ? "bg-emerald-400"
                  : dealHealth.status === "attention"
                    ? "bg-accent"
                    : "bg-rose-400"
              }`}
            />
            {dealHealth.label}
          </div>
          {blockedItems.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1.5 text-[12px] font-medium text-rose-400/95">
              <CircleDot className="h-3.5 w-3.5" />
              {blockedItems.length} blocker{blockedItems.length === 1 ? "" : "s"}
            </div>
          )}
          {needsAttention.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[12px] font-medium text-accent/90">
              {needsAttention.length} decision{needsAttention.length === 1 ? "" : "s"} pending
            </div>
          )}
          {staleItems.length > 0 && (
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-[12px] text-text-muted">
              {staleItems.length} stale workstream{staleItems.length === 1 ? "" : "s"}
            </div>
          )}
        </div>
        <p className="mt-3 text-[12px] text-text-muted">{dealHealth.reason}</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => document.getElementById("plans-for-this-week-detail")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="flex min-h-[88px] touch-target flex-col justify-start rounded-xl border border-accent/25 bg-surface-muted/50 px-4 py-3.5 text-left transition-colors active:bg-surface-muted/70 hover:bg-surface-muted/70 hover:border-accent/40 sm:min-h-0"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">This week&apos;s operating priorities</p>
            </div>
            <p className="mt-2.5 whitespace-pre-wrap text-[13px] leading-relaxed text-text-secondary">
              {plansForThisWeekShort}
            </p>
            <p className="mt-1.5 text-[11px] text-text-faint">
              Tap for full detail ↓
            </p>
          </button>
          <button
            type="button"
            onClick={() => onSectionChange?.("first90AndFieldKit")}
            className="flex min-h-[88px] touch-target flex-col justify-center rounded-xl border border-accent/25 bg-surface-muted/50 px-4 py-4 text-left transition-colors active:bg-surface-muted/70 hover:bg-surface-muted/70 hover:border-accent/40 sm:min-h-0 sm:py-3.5"
          >
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Last account update</p>
            </div>
            <p className="mt-2 text-[15px] font-bold text-text-primary">
              {lastUpdate?.title ?? "Daily account reset"}
            </p>
            <p className="mt-0.5 text-[13px] text-text-secondary">{lastUpdate?.createdAt ?? "Today"}</p>
          </button>
          <button
            type="button"
            onClick={() => onSectionChange?.("first90AndFieldKit")}
            className="flex min-h-[88px] touch-target flex-col justify-center rounded-xl border border-accent/25 bg-surface-muted/50 px-4 py-4 text-left transition-colors active:bg-surface-muted/70 hover:bg-surface-muted/70 hover:border-accent/40 sm:min-h-0 sm:py-3.5"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 shrink-0 text-accent" strokeWidth={2} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">Today&apos;s must-win move</p>
            </div>
            <p className="mt-2 text-[15px] font-bold text-text-primary">
              {topPriority?.title ?? "Define the first pilot"}
            </p>
            <p className="mt-0.5 text-[13px] text-text-secondary">
              {topPriority?.owner ?? champion?.name} · {topPriority?.dueLabel ?? "This week"}
            </p>
          </button>
        </div>
      </section>

      {/* This week's operating priorities */}
      <section id="plans-for-this-week-detail" className="scroll-mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-accent/75" strokeWidth={2} />
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
            This week&apos;s operating priorities
          </p>
        </div>
        <div className="rounded-2xl border border-accent/20 bg-surface-muted/50 p-4 sm:p-5">
          <div className="space-y-2.5">
            {weeklyOperatingPriorities.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-surface-border/50 bg-surface-elevated/40 p-3"
              >
                <div className="grid grid-cols-1 gap-1.5 text-[12px] sm:grid-cols-[1.2fr_1fr_1fr_1.2fr] sm:gap-3">
                  <p className="text-text-primary"><span className="text-text-faint">Title:</span> {item.title}</p>
                  <p className="text-text-secondary"><span className="text-text-faint">Why now:</span> {item.whyNow}</p>
                  <p className="text-text-secondary"><span className="text-text-faint">Target account:</span> {item.targetAccount}</p>
                  <p className="text-text-secondary"><span className="text-text-faint">Expected outcome:</span> {item.expectedOutcome}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Action-oriented insights */}
      <section className="space-y-4">
        <SectionHeader
          title="Action-oriented insights"
          subtitle="Signals and competitive context that shape account strategy, urgency, and next actions."
        />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="rounded-[28px] border border-accent/20 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-text-secondary">
              <Crosshair className="h-4 w-4 text-accent/75" strokeWidth={1.8} />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-faint">
                Competitive pressure point
              </p>
            </div>
            <p className="mt-4 text-[14px] font-medium text-text-primary">
              {topCompetitor?.name ?? "Incumbent platform pressure"}
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
              {topCompetitor
                ? `${topCompetitor.strengthAreas.slice(0, 2).join(" · ")}`
                : "The deal is most at risk when incumbent platforms make the customer default to convenience over quality."}
            </p>
            <p className="mt-3 text-[12px] leading-relaxed text-text-muted">
              Win by forcing a narrow comparison around enterprise governance, measurable outcomes, and the exact workflow where the customer feels pain.
            </p>
          </div>
          <div className="space-y-4">
            {signals.slice(0, 3).map((signal) => (
              <div
                key={signal.id}
                className="rounded-[22px] border border-accent/20 bg-white/[0.02] px-4 py-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-text-faint">
                    {signal.priority}
                  </span>
                  <span className="text-[11px] text-text-faint">
                    {signal.sourceLabel} · {signal.sourceFreshness}
                  </span>
                </div>
                <p className="mt-3 text-[15px] font-medium text-text-primary">{signal.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                  {signal.summary}
                </p>
                <p className="mt-3 text-[12px] leading-relaxed text-accent/80">
                  {signal.recommendedAction}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform narrative (lower on page) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
        <section className="min-w-0 rounded-[28px] border border-accent/20 bg-white/[0.02] p-4 sm:p-6">
          <SectionHeader
            title="Platform narrative and account strategy"
            subtitle="How I would position Snowflake in this account after priorities, stakeholders, and operating plan are clear."
          />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Land motion</p>
              <p className="mt-3 text-[15px] font-medium text-text-primary">{account.firstWedge}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                Keep the first sale narrow, measurable, and sponsor-friendly. The first win should earn the right to expand.
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Champion building</p>
              <p className="mt-3 text-[15px] font-medium text-text-primary">
                {champion?.title ?? "Likely functional champion"}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                {champion?.note ?? "Find the operator with urgency, cross-functional influence, and clear upside from a successful pilot."}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Pilot strategy</p>
              <p className="mt-3 text-[15px] font-medium text-text-primary">
                {firstDecision?.title ?? "Define the first pilot"}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                {firstDecision?.detail ?? "Define owners, timeline, success metrics, and required governance before broad executive escalation."}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.12em] text-text-faint">Expansion path</p>
              <p className="mt-3 text-[15px] font-medium text-text-primary">
                {expansionItem?.title ?? account.topExpansionPaths[0]}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
                Name the second motion early so leadership sees a durable platform decision, not a one-off experiment.
              </p>
            </div>
          </div>
        </section>
        <aside className="min-w-0 space-y-4">
          <div className="rounded-[28px] border border-accent/15 bg-accent/[0.05] p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <SnowflakeLogoIcon size={16} className="opacity-90" />
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-accent/80">
                Current account recommendation
              </p>
            </div>
            <p className="mt-4 text-[16px] leading-relaxed text-text-primary">
              {currentRecommendation}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
