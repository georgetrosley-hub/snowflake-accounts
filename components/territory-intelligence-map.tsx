"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Loader2,
  Layers2,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { territoryStorageGet, territoryStorageSet } from "@/lib/territory-storage";
import { cn } from "@/lib/utils";
import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";

/**
 * Territory store v4: full customer book + expansion narratives.
 * Reads legacy v1/v2 keys once and re-saves under v4.
 * Default rows align to the "Territory Summary" sheet in GT _ Snowflake Territory Mapping.xlsx (first workload → hypothesis → proof → path → Est. ACV). Per-account tabs in that workbook hold deeper detail.
 */
const SK = "sf-territory-intel-v4";
const SK_LEGACY_V1 = "sf-territory-intel-v1";
const SK_LEGACY_V2 = "sf-territory-intel-v2";

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
};

const ACCTS: TerritoryAccount[] = [
  {
    id: "ciena",
    name: "Ciena",
    tier: 1,
    acv: "Expansion",
    industry: "Networking / Optical",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: backlog risk + margin visibility on AI deals. Hypothesis: execution is against ~$7B backlog—not lack of demand. Proof point: surface backlog risk on 2–3 AI deals within 24 hours. Expansion path: forecasting → supply chain → Blue Planet.",
    solutions: [
      { product: "Cortex AI", problem: "Network performance prediction and anomaly detection across global optical infrastructure" },
      { product: "Snowpark", problem: "Custom ML pipelines for optical network optimization without moving data outside Snowflake" },
      { product: "Cortex Analyst", problem: "Self-service network analytics for field engineers and NOC teams without SQL" },
      { product: "Dynamic Tables", problem: "Real-time telemetry pipelines from network devices to analytics layer" },
    ],
    contacts: [
      { name: "", title: "VP Data & Analytics", role: "Champion" },
      { name: "", title: "CTO", role: "Economic Buyer" },
    ],
  },
  {
    id: "sagent",
    name: "Sagent",
    tier: 1,
    acv: "Expansion",
    industry: "Mortgage Servicing Tech",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: Dara deployment performance across customers. Hypothesis: prove Dara works across the customer base. Proof point: identify 1–2 underperforming deployments. Expansion path: customer health → compliance → AI telemetry.",
    solutions: [
      { product: "Cortex Analyst", problem: "Self-service mortgage servicing analytics for non-technical compliance teams" },
      { product: "Secure Data Sharing", problem: "Share loan performance data with servicer partners securely without data movement" },
      { product: "Horizon Governance", problem: "Automated data lineage and access controls for CFPB and state regulatory audits" },
    ],
    contacts: [
      { name: "", title: "Head of Engineering", role: "Champion" },
      { name: "", title: "CEO", role: "Economic Buyer" },
    ],
  },
  {
    id: "usfintech",
    name: "U.S. Financial Technology",
    tier: 1,
    acv: "Expansion",
    industry: "Fintech / Government",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: securitization exception monitoring. Hypothesis: cannot act on ~$6.5T of data fast enough. Proof point: real-time anomaly vs delayed reporting. Expansion path: workflows → stakeholder products → monetization.",
    solutions: [
      { product: "Marketplace", problem: "Distribute MBS data products to external financial institutions at scale" },
      { product: "Horizon Governance", problem: "Federal regulatory compliance with automated lineage for government-adjacent financial data" },
      { product: "Secure Data Sharing", problem: "Enable external partners to consume MBS analytics without raw data exposure" },
      { product: "Cortex AI", problem: "Automated risk scoring and anomaly detection across mortgage-backed securities portfolios" },
    ],
    contacts: [
      { name: "", title: "Director of Data", role: "Champion" },
      { name: "", title: "CTO", role: "Technical Buyer" },
    ],
  },
  {
    id: "sprinklr",
    name: "Sprinklr",
    tier: 1,
    acv: "Expansion",
    industry: "CXM / SaaS",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: cross-channel AI outcome correlation. Hypothesis: prove AI improves customer outcomes. Proof point: AI intervention → escalation reduction in 48 hours. Expansion path: AI measurement → benchmarking → CX platform.",
    solutions: [
      { product: "Cortex Analyst", problem: "Self-service NRR and churn analytics for 700 Bear Hug accounts without waiting on data team" },
      { product: "Snowflake Intelligence", problem: "Natural language queries on customer health scores across 30+ social channels" },
      { product: "Iceberg Tables", problem: "Open data format to unify CX data lake without vendor lock-in during transformation" },
      { product: "Cortex AI", problem: "Real-time sentiment analysis across billions of social interactions for enterprise customers" },
    ],
    contacts: [
      { name: "Scott Millard", title: "CRO (new Sept 2025)", role: "Economic Buyer" },
      { name: "Anthony Coletta", title: "CFO (new Oct 2025)", role: "Influencer" },
      { name: "Karthik Suri", title: "Chief Product & Strategy", role: "Technical Champion" },
    ],
  },
  {
    id: "bancorp",
    name: "The Bancorp",
    tier: 1,
    acv: "Expansion",
    industry: "Banking / Fintech (BaaS)",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: partner profitability + risk intelligence. Hypothesis: scaling partners without a unified risk/profit view. Proof point: growth vs risk divergence across 5–10 cohorts. Expansion path: risk detection → embedded finance → AI ops.",
    solutions: [
      { product: "Secure Data Sharing", problem: "Partner-level analytics across PayPal, Chime and others without exposing raw loan data" },
      { product: "Cortex ML", problem: "Credit risk signal detection and anomaly detection on consumer fintech loan portfolios ($128M provisions)" },
      { product: "Snowflake Intelligence", problem: "Real-time partner-level P&L visibility: GDV, fee income, provision rates, delinquency by partner" },
      { product: "Horizon Governance", problem: "OCC/FDIC regulatory compliance with automated data lineage and access controls" },
    ],
    contacts: [
      { name: "", title: "CFO", role: "Economic Buyer" },
      { name: "", title: "Head of Fintech Solutions", role: "Champion" },
      { name: "", title: "Chief Risk Officer", role: "Influencer" },
      { name: "", title: "Director Data Engineering", role: "Technical Champion" },
    ],
  },
  {
    id: "billtrust",
    name: "Billtrust",
    tier: 1,
    acv: "Expansion",
    industry: "B2B Fintech (AR)",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: cash acceleration intelligence. Hypothesis: fragmented AR signals need one intelligence layer. Proof point: collections/payment correlation across 5 cohorts. Expansion path: AI collections → benchmarking → order-to-cash.",
    solutions: [
      { product: "Snowpark Container Services", problem: "Run multi-agent AI models for payment matching and collections natively on unified data" },
      { product: "Cortex AI Fine-Tuning", problem: "Fine-tune payment prediction models on proprietary B2B transaction data without export" },
      { product: "Dynamic Tables", problem: "Real-time pipeline for AI training data across invoicing, payments and collections simultaneously" },
      { product: "Cortex ML", problem: "Collections prioritization and credit decisioning models trained on unified cross-product data" },
    ],
    contacts: [
      { name: "", title: "CTO", role: "Technical Champion" },
      { name: "", title: "VP Data Engineering", role: "Champion" },
      { name: "", title: "CEO", role: "Economic Buyer" },
    ],
  },
  {
    id: "lyric",
    name: "Magnum Transaction Sub / Lyric",
    tier: 2,
    acv: "$150K–400K+",
    industry: "Healthcare Payment Integrity",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: pre-pay + post-pay claims intelligence. Hypothesis: delay between detecting and acting on payment issues. Proof point: pre/post-pay correlation for one claim category. Expansion path: payer analytics → AI claims → COB optimization.",
    solutions: [
      { product: "Cortex ML", problem: "Payment accuracy models to detect overpayment and fraud patterns across billions in claims" },
      { product: "Secure Data Sharing", problem: "Share payment accuracy insights with payer partners without raw PHI exposure" },
      { product: "Horizon Governance", problem: "HIPAA-compliant data governance for healthcare payment data" },
      { product: "Document AI", problem: "Automated extraction from EOBs, claims forms and remittance documents" },
    ],
    contacts: [
      { name: "", title: "VP Engineering", role: "Champion" },
      { name: "", title: "CEO", role: "Economic Buyer" },
    ],
  },
  {
    id: "healthunion",
    name: "Health Union, LLC",
    tier: 2,
    acv: "$100K–250K",
    industry: "Digital Health / AdTech",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: unified patient + HCP audience activation. Hypothesis: operationalizing Adfire acquisition data assets. Proof point: audience segment for one therapeutic area in 48 hours. Expansion path: clean rooms → clinical trials → AI patient journey.",
    solutions: [
      { product: "Cortex AI", problem: "Audience segmentation and content personalization across health condition communities at scale" },
      { product: "Marketplace", problem: "Monetize health engagement data with pharma partners via privacy-safe clean rooms" },
      { product: "Secure Data Sharing", problem: "Enable pharma partners to query patient engagement patterns without accessing raw PII/PHI" },
    ],
    contacts: [
      { name: "", title: "CTO", role: "Technical Buyer" },
      { name: "", title: "VP Data", role: "Champion" },
    ],
  },
  {
    id: "everstage",
    name: "Everstage",
    tier: 3,
    acv: "$75K–150K",
    industry: "SaaS (Sales Performance)",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: cross-product revenue intelligence. Hypothesis: three products generating data in parallel, not together. Proof point: cross-product correlation across 5 cohorts. Expansion path: benchmarking → Crystal AI → RevOps platform.",
    solutions: [
      { product: "Snowpark", problem: "Commission calculation engine at scale across complex multi-tier comp plans" },
      { product: "Cortex Analyst", problem: "Self-service commission analytics for sales leaders without engineering dependency" },
    ],
    contacts: [{ name: "", title: "CTO", role: "Technical Buyer" }],
  },
  {
    id: "chalice",
    name: "Chalice AI",
    tier: 3,
    acv: "$50K–100K",
    industry: "AdTech / Custom AI",
    status: "Existing",
    compelling:
      "From territory map (Summary). First workload: advertiser model deployment acceleration. Hypothesis: custom models are becoming an operational bottleneck. Proof point: reduced onboarding time via native deployment. Expansion path: LiveRamp clean rooms → Dentsu flows → scale.",
    solutions: [
      { product: "Snowpark Container Services", problem: "Run proprietary ad bidding models natively on Snowflake data without external compute" },
      { product: "Cortex AI", problem: "Augment proprietary bidding algorithms with built-in LLM functions for ad creative analysis" },
    ],
    contacts: [{ name: "", title: "CEO/Founder", role: "Economic Buyer" }],
  },
];

const SC: Record<string, string> = {
  "Cortex AI": "#1AA6D6",
  "Cortex Analyst": "#11967A",
  "Cortex ML": "#6E56CF",
  "Cortex AI Fine-Tuning": "#D94B7A",
  Snowpark: "#D97706",
  "Snowpark Container Services": "#C2410C",
  "Dynamic Tables": "#0E8A7A",
  "Document AI": "#8B5CF6",
  "Secure Data Sharing": "#059669",
  Marketplace: "#C2410C",
  "Horizon Governance": "#2563EB",
  "Iceberg Tables": "#0D9488",
  "Snowflake Intelligence": "#DC2626",
  "Snowflake ML": "#7C3AED",
  "Native Apps Framework": "#D97706",
};
const gc = (p: string) => SC[p] || "#1AA6D6";

function parseAccounts(raw: string): TerritoryAccount[] {
  const parsed = JSON.parse(raw) as unknown[];
  return parsed.map((row) => {
    const a = row as Record<string, unknown>;
    return {
      id: String(a.id),
      name: String(a.name ?? ""),
      tier: Number(a.tier) || 3,
      acv: String(a.acv ?? ""),
      industry: String(a.industry ?? ""),
      status: String(a.status ?? "Existing"),
      compelling: String(a.compelling ?? ""),
      solutions: Array.isArray(a.solutions) ? (a.solutions as TerritoryAccount["solutions"]) : [],
      contacts: Array.isArray(a.contacts) ? (a.contacts as TerritoryAccount["contacts"]) : [],
    };
  });
}

export default function TerritoryIntelligenceMap() {
  const [accounts, setAccounts] = useState<TerritoryAccount[]>(ACCTS);
  const [sel, setSel] = useState<TerritoryAccount | null>(null);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState<"accounts" | "solutions">("accounts");
  const [fTier, setFTier] = useState(0);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let raw: string | null = null;
        let r = await territoryStorageGet(SK);
        if (r?.value) raw = r.value;
        if (!raw) {
          r = await territoryStorageGet(SK_LEGACY_V1);
          if (r?.value) raw = r.value;
        }
        if (!raw) {
          r = await territoryStorageGet(SK_LEGACY_V2);
          if (r?.value) raw = r.value;
        }
        if (raw) {
          const parsed = parseAccounts(raw);
          setAccounts(parsed);
          try {
            await territoryStorageSet(SK, JSON.stringify(parsed));
          } catch {
            /* keep in-memory only */
          }
        }
      } catch {
        /* defaults */
      }
      setLoaded(true);
    })();
  }, []);

  const save = async (u: TerritoryAccount[]) => {
    setAccounts(u);
    setSaving(true);
    try {
      await territoryStorageSet(SK, JSON.stringify(u));
    } catch {
      /* offline / blocked storage */
    }
    setTimeout(() => setSaving(false), 600);
  };

  const ua = (id: string, f: keyof TerritoryAccount, v: TerritoryAccount[keyof TerritoryAccount]) => {
    const u = accounts.map((a) => (a.id === id ? { ...a, [f]: v } : a));
    save(u);
    if (sel?.id === id) setSel({ ...sel, [f]: v } as TerritoryAccount);
  };

  const us = (aid: string, si: number, f: "product" | "problem", v: string) => {
    const u = accounts.map((a) => {
      if (a.id !== aid) return a;
      const n = [...a.solutions];
      n[si] = { ...n[si], [f]: v };
      return { ...a, solutions: n };
    });
    save(u);
    if (sel?.id === aid) {
      const n = [...sel.solutions];
      n[si] = { ...n[si], [f]: v };
      setSel({ ...sel, solutions: n });
    }
  };

  const addSol = (aid: string) => {
    const n = { product: "New Solution", problem: "Problem to solve" };
    save(accounts.map((a) => (a.id === aid ? { ...a, solutions: [...a.solutions, n] } : a)));
    if (sel?.id === aid) setSel({ ...sel, solutions: [...sel.solutions, n] });
  };

  const rmSol = (aid: string, si: number) => {
    save(accounts.map((a) => (a.id === aid ? { ...a, solutions: a.solutions.filter((_, i) => i !== si) } : a)));
    if (sel?.id === aid) setSel({ ...sel, solutions: sel.solutions.filter((_, i) => i !== si) });
  };

  const uc = (aid: string, ci: number, f: "name" | "title" | "role", v: string) => {
    const u = accounts.map((a) => {
      if (a.id !== aid) return a;
      const n = [...a.contacts];
      n[ci] = { ...n[ci], [f]: v };
      return { ...a, contacts: n };
    });
    save(u);
    if (sel?.id === aid) {
      const n = [...sel.contacts];
      n[ci] = { ...n[ci], [f]: v };
      setSel({ ...sel, contacts: n });
    }
  };

  const addCon = (aid: string) => {
    const n = { name: "", title: "", role: "Champion" };
    save(accounts.map((a) => (a.id === aid ? { ...a, contacts: [...a.contacts, n] } : a)));
    if (sel?.id === aid) setSel({ ...sel, contacts: [...sel.contacts, n] });
  };

  const rmCon = (aid: string, ci: number) => {
    save(accounts.map((a) => (a.id === aid ? { ...a, contacts: a.contacts.filter((_, i) => i !== ci) } : a)));
    if (sel?.id === aid) setSel({ ...sel, contacts: sel.contacts.filter((_, i) => i !== ci) });
  };

  const addAcc = () => {
    const n: TerritoryAccount = {
      id: "n_" + Date.now(),
      name: "New Account",
      tier: 3,
      acv: "TBD",
      industry: "TBD",
      status: "Existing",
      compelling: "",
      solutions: [],
      contacts: [],
    };
    save([...accounts, n]);
    setSel(n);
    setEdit(true);
    setView("accounts");
  };

  const rmAcc = (id: string) => {
    save(accounts.filter((a) => a.id !== id));
    if (sel?.id === id) setSel(null);
  };

  const reset = () => {
    if (confirm("Reset all data to defaults?")) {
      save([...ACCTS]);
      setSel(null);
    }
  };

  const fil = accounts.filter((a) => {
    if (fTier > 0 && a.tier !== fTier) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const allSol: Record<string, { id: string; name: string }[]> = {};
  accounts.forEach((a) =>
    a.solutions.forEach((s) => {
      if (!allSol[s.product]) allSol[s.product] = [];
      allSol[s.product].push({ id: a.id, name: a.name });
    })
  );

  if (!loaded) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-slate-50 font-sans text-slate-600">
        <SnowflakeLogoIcon size={32} className="opacity-90" />
        <Loader2 className="ml-3 h-5 w-5 animate-spin text-[#29B5E8]" aria-hidden />
        <span className="ml-2 text-sm font-medium tracking-tight">Loading coverage map…</span>
      </div>
    );
  }

  const nw = navCollapsed ? "w-14" : "w-[220px]";

  const filterPill = (active: boolean) =>
    cn(
      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
      active
        ? "border-[#29B5E8] bg-sky-50 text-sky-900"
        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
    );

  const bookLabel = (status: string) => (status === "Existing" ? "Customer" : status);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased">
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-slate-200/90 bg-white shadow-[1px_0_0_rgba(15,23,42,0.04)] transition-[width] duration-200 ease-out",
          nw
        )}
      >
        <div
          className={cn(
            "flex min-h-[60px] items-center gap-2.5 border-b border-slate-200/90",
            navCollapsed ? "px-3.5 py-4" : "px-5 py-4"
          )}
        >
          <SnowflakeLogoIcon size={28} className="shrink-0" />
          {!navCollapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight text-slate-900">Territory Intelligence</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
                Customer book · Expansion
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {(
            [
              { Icon: LayoutGrid, label: "Accounts", key: "accounts" as const },
              { Icon: Layers2, label: "Solutions", key: "solutions" as const },
            ] as const
          ).map(({ Icon, label, key: k }) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setView(k);
                setSel(null);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors",
                navCollapsed && "justify-center px-2",
                view === k
                  ? "bg-sky-50 font-semibold text-sky-900"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
              {!navCollapsed && label}
            </button>
          ))}
          <div className="mx-1 my-3 h-px bg-slate-200" />
          <button
            type="button"
            onClick={addAcc}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900",
              navCollapsed && "justify-center px-2"
            )}
          >
            <Plus className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {!navCollapsed && "Add account"}
          </button>
          <button
            type="button"
            onClick={reset}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900",
              navCollapsed && "justify-center px-2"
            )}
          >
            <RotateCcw className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {!navCollapsed && "Reset to defaults"}
          </button>
        </nav>

        <div className="border-t border-slate-200/90 p-3">
          <button
            type="button"
            onClick={() => setNavCollapsed(!navCollapsed)}
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
          >
            {navCollapsed ? (
              <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            ) : (
              <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            )}
            {!navCollapsed && "Collapse"}
          </button>
          {!navCollapsed && (
            <div className="mt-2 space-y-2 px-2 pb-1">
              <Link
                href="/snowflake-intelligence"
                className="group flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-[12px] font-medium text-slate-800 transition-colors hover:border-sky-300 hover:bg-sky-50/50"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#29B5E8]" strokeWidth={2} />
                  Snowflake Intelligence
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#29B5E8]" strokeWidth={2} />
              </Link>
              <p className="text-[11px] leading-snug text-slate-400">
                Claude-powered help for territory narrative, Snowflake Intelligence, and platform positioning.
              </p>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-slate-200/90 bg-white">
          <div className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Coverage map</p>
              <h1 className="mt-0.5 text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                Account landscape & solution fit
              </h1>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
                Every account in this book is a{" "}
                <span className="font-medium text-slate-700">Snowflake customer</span>. Use the map for
                expansion depth, workload coverage, and personas —                 narratives match your{" "}
                <span className="font-medium text-slate-700">Territory Summary</span> workbook (GT _ Snowflake
                Territory Mapping.xlsx); use per-account tabs for depth.
              </p>
            </div>
            <Link
              href="/snowflake-intelligence"
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 sm:self-auto"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
              Snowflake Intelligence
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} />
            </Link>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="relative min-w-0 flex-1 max-w-md">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.75}
                aria-hidden
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search accounts…"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none ring-sky-500/0 transition-[box-shadow,border-color] placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
              {[0, 1, 2, 3].map((t) => (
                <button key={t} type="button" onClick={() => setFTier(t)} className={filterPill(fTier === t)}>
                  {t === 0 ? "All tiers" : `Tier ${t}`}
                </button>
              ))}
              {saving && (
                <span className="ml-2 text-[11px] font-medium text-[#29B5E8]">Saved</span>
              )}
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="min-w-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {(
                [
                  { label: "Customers", value: accounts.length, className: "text-slate-900" },
                  {
                    label: "Tier 1",
                    value: accounts.filter((a) => a.tier === 1).length,
                    className: "text-[#0e7490]",
                  },
                  {
                    label: "Tier 2",
                    value: accounts.filter((a) => a.tier === 2).length,
                    className: "text-sky-800",
                  },
                  {
                    label: "Tier 3",
                    value: accounts.filter((a) => a.tier === 3).length,
                    className: "text-slate-600",
                  },
                  {
                    label: "Solutions mapped",
                    value: accounts.reduce((s, a) => s + a.solutions.length, 0),
                    className: "text-blue-700",
                  },
                  {
                    label: "Contacts",
                    value: accounts.reduce((s, a) => s + a.contacts.length, 0),
                    className: "text-violet-700",
                  },
                ] as const
              ).map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    {s.label}
                  </p>
                  <p className={cn("mt-1 text-2xl font-bold tabular-nums tracking-tight sm:text-[26px]", s.className)}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {view === "accounts" ? (
              [1, 2, 3].map((tier) => {
                const ta = fil.filter((a) => a.tier === tier);
                if (!ta.length) return null;
                return (
                  <div key={tier} className="mb-8">
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: tier === 1 ? "#29B5E8" : tier === 2 ? "#6CB4EE" : "#94A3B8",
                        }}
                      />
                      <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Tier {tier}
                      </span>
                      <span className="text-xs text-slate-400">
                        {ta.length} account{ta.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm">
                      <div className="overflow-x-auto">
                        <div className="min-w-[720px]">
                      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,2.5fr)] gap-2 border-b border-slate-200 bg-slate-50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">
                        {["Account", "Industry", "Est. ACV", "Book", "Solutions"].map((h) => (
                          <span key={h}>{h}</span>
                        ))}
                      </div>
                      {ta.map((a, i) => (
                        <div
                          key={a.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSel(a);
                            setEdit(false);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSel(a);
                              setEdit(false);
                            }
                          }}
                          className={cn(
                            "grid cursor-pointer grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,2.5fr)] gap-2 border-b border-slate-100 px-5 py-3.5 text-left transition-colors last:border-b-0",
                            sel?.id === a.id ? "bg-sky-50/90" : "hover:bg-slate-50/80"
                          )}
                        >
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{a.name}</div>
                            {a.contacts.filter((c) => c.name).length > 0 && (
                              <div className="mt-0.5 text-[11px] text-slate-400">
                                {a.contacts.filter((c) => c.name).map((c) => c.name).join(", ")}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-[13px] text-slate-600">{a.industry}</div>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-slate-800">{a.acv}</span>
                          </div>
                          <div className="flex items-center">
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                                a.status === "Existing"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-800"
                              )}
                            >
                              {bookLabel(a.status)}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1">
                            {a.solutions.map((s, j) => (
                              <span
                                key={j}
                                className="rounded px-2 py-0.5 text-[10px] font-medium"
                                style={{
                                  background: `${gc(s.product)}14`,
                                  color: gc(s.product),
                                  border: `1px solid ${gc(s.product)}33`,
                                }}
                              >
                                {s.product}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Solution positioning across accounts
                </p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {Object.entries(allSol)
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([product, entries]) => (
                      <div
                        key={product}
                        className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 shrink-0 rounded-sm"
                            style={{ background: gc(product) }}
                          />
                          <span className="text-sm font-semibold text-slate-900">{product}</span>
                          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                            {entries.length}
                          </span>
                        </div>
                        {entries.map((entry, i) => {
                          const acc = accounts.find((x) => x.id === entry.id);
                          const sol = acc?.solutions.find((s) => s.product === product);
                          return (
                            <div
                              key={entry.id}
                              className={cn("py-2.5", i > 0 && "border-t border-slate-100")}
                            >
                              <div className="text-[13px] font-medium text-slate-900">{entry.name}</div>
                              {sol && (
                                <div className="mt-1 text-xs leading-relaxed text-slate-600">{sol.problem}</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </div>
            )}

            <p className="mt-10 max-w-3xl border-t border-slate-200/80 pt-6 text-[11px] leading-relaxed text-slate-400">
              Customer book for expansion planning. Enrich from your account-plan decks and CRM; validate consumption, stakeholders, and opportunity data in official systems before live conversations.
            </p>
          </div>

          {sel && (
            <aside className="w-[min(100vw-1rem,400px)] shrink-0 overflow-y-auto border-l border-slate-200/90 bg-white shadow-[inset_1px_0_0_rgba(15,23,42,0.04)]">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200/90 px-6 py-5">
                <div className="min-w-0 flex-1">
                  {edit ? (
                    <input
                      value={sel.name}
                      onChange={(e) => ua(sel.id, "name", e.target.value)}
                      className="w-full rounded-md border border-slate-200 px-2 py-1 text-lg font-bold text-slate-900 outline-none ring-sky-500/0 focus:ring-2 focus:ring-sky-500/20"
                    />
                  ) : (
                    <h2 className="text-lg font-bold tracking-tight text-slate-900">{sel.name}</h2>
                  )}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEdit(!edit)}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                      edit
                        ? "border-sky-200 bg-sky-50 text-sky-900"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {edit ? "Done" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSel(null)}
                    className="rounded-md border border-slate-200 p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
                    aria-label="Close panel"
                  >
                    <X className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="border-b border-slate-100 px-6 py-4">
                {edit ? (
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={sel.tier}
                      onChange={(e) => ua(sel.id, "tier", +e.target.value)}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                    >
                      <option value={1}>Tier 1</option>
                      <option value={2}>Tier 2</option>
                      <option value={3}>Tier 3</option>
                    </select>
                    <input
                      value={sel.acv}
                      onChange={(e) => ua(sel.id, "acv", e.target.value)}
                      className="w-20 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none"
                    />
                    <input
                      value={sel.industry}
                      onChange={(e) => ua(sel.id, "industry", e.target.value)}
                      className="w-36 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none"
                    />
                    <select
                      value={sel.status}
                      onChange={(e) => ua(sel.id, "status", e.target.value)}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                    >
                      <option value="Existing">Existing</option>
                      <option value="Prospect">Prospect</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-medium text-sky-800">
                      Tier {sel.tier}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      {sel.acv}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      {sel.industry}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        sel.status === "Existing"
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-amber-50 text-amber-800"
                      )}
                    >
                      {bookLabel(sel.status)}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-b border-slate-100 px-6 py-4">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Why now
                </p>
                {edit ? (
                  <textarea
                    value={sel.compelling}
                    onChange={(e) => ua(sel.id, "compelling", e.target.value)}
                    rows={4}
                    className="w-full resize-y rounded-lg border border-slate-200 p-2.5 text-[13px] leading-relaxed text-slate-800 outline-none ring-sky-500/0 focus:ring-2 focus:ring-sky-500/15"
                  />
                ) : (
                  <p className="text-[13px] leading-relaxed text-slate-600">
                    {sel.compelling || "No compelling event documented."}
                  </p>
                )}
              </div>

              <div className="border-b border-slate-100 px-6 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Solutions
                  </span>
                  {edit && (
                    <button
                      type="button"
                      onClick={() => addSol(sel.id)}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-sky-800 hover:bg-slate-50"
                    >
                      Add
                    </button>
                  )}
                </div>
                {sel.solutions.map((sol, i) => (
                  <div
                    key={i}
                    className="mb-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3.5 last:mb-0"
                  >
                    {edit ? (
                      <>
                        <div className="mb-2 flex gap-2">
                          <input
                            value={sol.product}
                            onChange={(e) => us(sel.id, i, "product", e.target.value)}
                            className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs font-semibold outline-none"
                            style={{ color: gc(sol.product) }}
                          />
                          <button
                            type="button"
                            onClick={() => rmSol(sel.id, i)}
                            className="shrink-0 rounded border border-rose-200 bg-rose-50 px-2 py-1 text-rose-700"
                            aria-label="Remove solution"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <textarea
                          value={sol.problem}
                          onChange={(e) => us(sel.id, i, "problem", e.target.value)}
                          rows={2}
                          className="w-full resize-y rounded border border-slate-200 p-2 text-xs text-slate-600 outline-none"
                        />
                      </>
                    ) : (
                      <>
                        <div className="mb-1.5 flex items-center gap-2">
                          <span
                            className="h-2 w-2 shrink-0 rounded-sm"
                            style={{ background: gc(sol.product) }}
                          />
                          <span className="text-[13px] font-semibold" style={{ color: gc(sol.product) }}>
                            {sol.product}
                          </span>
                        </div>
                        <p className="m-0 text-xs leading-relaxed text-slate-600">{sol.problem}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-6 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Key contacts
                  </span>
                  {edit && (
                    <button
                      type="button"
                      onClick={() => addCon(sel.id)}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-sky-800 hover:bg-slate-50"
                    >
                      Add
                    </button>
                  )}
                </div>
                {sel.contacts.length === 0 && (
                  <p className="text-xs text-slate-400">No contacts mapped yet.</p>
                )}
                {sel.contacts.map((con, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-2.5 py-2.5",
                      i > 0 && "border-t border-slate-100"
                    )}
                  >
                    {edit ? (
                      <>
                        <input
                          value={con.name}
                          onChange={(e) => uc(sel.id, i, "name", e.target.value)}
                          placeholder="Name"
                          className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs outline-none"
                        />
                        <input
                          value={con.title}
                          onChange={(e) => uc(sel.id, i, "title", e.target.value)}
                          placeholder="Title"
                          className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs outline-none"
                        />
                        <select
                          value={con.role}
                          onChange={(e) => uc(sel.id, i, "role", e.target.value)}
                          className="rounded border border-slate-200 bg-white px-1.5 py-1 text-[11px]"
                        >
                          <option value="Champion">Champion</option>
                          <option value="Economic Buyer">Econ Buyer</option>
                          <option value="Technical Champion">Tech Champ</option>
                          <option value="Technical Buyer">Tech Buyer</option>
                          <option value="Influencer">Influencer</option>
                          <option value="Blocker">Blocker</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => rmCon(sel.id, i)}
                          className="shrink-0 rounded border border-rose-200 bg-rose-50 p-1 text-rose-700"
                          aria-label="Remove contact"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-sky-800">
                          {con.name ? con.name.split(" ").map((n) => n[0]).join("") : "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-slate-900">{con.name || "TBD"}</div>
                          <div className="text-[11px] text-slate-400">{con.title}</div>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                            con.role.includes("Champion")
                              ? "bg-emerald-50 text-emerald-800"
                              : con.role === "Economic Buyer"
                                ? "bg-sky-50 text-sky-800"
                                : con.role === "Blocker"
                                  ? "bg-rose-50 text-rose-800"
                                  : "bg-amber-50 text-amber-800"
                          )}
                        >
                          {con.role}
                        </span>
                      </>
                    )}
                  </div>
                ))}
                {edit && (
                  <button
                    type="button"
                    onClick={() => rmAcc(sel.id)}
                    className="mt-4 w-full rounded-lg border border-rose-200 bg-rose-50 py-2.5 text-xs font-medium text-rose-800 transition-colors hover:bg-rose-100"
                  >
                    Delete account
                  </button>
                )}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
