"use client";

import { useState, useEffect } from "react";
import {
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
import {
  countMotion,
  formatPipelineK,
  formatTerritoryPotentialRange,
  sumPipelineBounds,
  usageLabel,
} from "@/lib/territory-metrics";
import { cn } from "@/lib/utils";
import { SnowflakeLogoIcon } from "@/components/ui/snowflake-logo";
import { SnowflakeIntelligencePanel } from "@/components/layout/snowflake-intelligence-panel";
import type {
  TerritoryAccount,
  TerritoryMotion,
  SnowflakeUsageTier,
  Day0PipelineView,
  DealLikelihood,
  DealMechanics,
} from "@/types/territory-map";
import { DEFAULT_TERRITORY_ACCOUNTS } from "@/data/territory-default-accounts";

export type { TerritoryAccount } from "@/types/territory-map";

/**
 * Territory store v4: full customer book + expansion narratives.
 * Reads legacy v1/v2 keys once and re-saves under v4.
 * Default rows align to the "Territory Summary" sheet in GT _ Snowflake Territory Mapping.xlsx (first workload → hypothesis → proof → path → Est. ACV). Per-account tabs in that workbook hold deeper detail.
 */
const SK = "sf-territory-intel-v4";
const SK_LEGACY_V1 = "sf-territory-intel-v1";
const SK_LEGACY_V2 = "sf-territory-intel-v2";

function inferMotion(acv: string): TerritoryMotion {
  if (/^\s*Expansion\s*$/i.test(acv.trim())) return "expansion";
  if (/\$|[0-9]\s*[KkMm]/.test(acv)) return "net_new_workload";
  return "expansion";
}

function parseDay0(a: Record<string, unknown>, seed?: TerritoryAccount): Day0PipelineView {
  const raw = a.day0;
  const d =
    raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const s = seed?.day0;
  const lr = d.likelihood ?? s?.likelihood ?? "medium";
  const likelihood: DealLikelihood =
    lr === "high" || lr === "low" || lr === "medium" ? lr : "medium";
  return {
    likelihood,
    likelihoodWhy: String(d.likelihoodWhy ?? s?.likelihoodWhy ?? ""),
    timeline: String(d.timeline ?? s?.timeline ?? ""),
    firstMeeting: String(d.firstMeeting ?? s?.firstMeeting ?? ""),
  };
}

function parseDealMechanics(a: Record<string, unknown>, seed?: TerritoryAccount): DealMechanics | undefined {
  const incoming = a.dealMechanics;
  if (incoming && typeof incoming === "object" && !Array.isArray(incoming)) {
    const i = incoming as Record<string, unknown>;
    const b = seed?.dealMechanics;
    return {
      economicBuyer: String(i.economicBuyer ?? b?.economicBuyer ?? ""),
      technicalBuyer: String(i.technicalBuyer ?? b?.technicalBuyer ?? ""),
      champion: String(i.champion ?? b?.champion ?? ""),
      landMotion: String(i.landMotion ?? b?.landMotion ?? ""),
      expansionAfter: String(i.expansionAfter ?? b?.expansionAfter ?? ""),
      blockers: String(i.blockers ?? b?.blockers ?? ""),
      competitiveRisk: String(i.competitiveRisk ?? b?.competitiveRisk ?? ""),
    };
  }
  return seed?.dealMechanics;
}

function normalizeAccountRow(a: Record<string, unknown>): TerritoryAccount {
  const id = String(a.id);
  const seed = DEFAULT_TERRITORY_ACCOUNTS.find((x) => x.id === id);
  const acv = String(a.acv ?? seed?.acv ?? "");
  const motionRaw = a.motion;
  const motion: TerritoryMotion =
    motionRaw === "net_new_workload" || motionRaw === "expansion"
      ? motionRaw
      : seed?.motion ?? inferMotion(acv);
  const su = a.snowflakeUsage;
  const snowflakeUsage: SnowflakeUsageTier =
    su === "light" || su === "heavy" || su === "moderate" ? su : seed?.snowflakeUsage ?? "moderate";
  const pl =
    typeof a.pipelineLowK === "number" && !Number.isNaN(a.pipelineLowK)
      ? a.pipelineLowK
      : seed?.pipelineLowK ?? 0;
  const ph =
    typeof a.pipelineHighK === "number" && !Number.isNaN(a.pipelineHighK)
      ? a.pipelineHighK
      : seed?.pipelineHighK ?? pl;

  return {
    id,
    name: String(a.name ?? seed?.name ?? ""),
    tier: Number(a.tier) || seed?.tier || 3,
    acv,
    industry: String(a.industry ?? seed?.industry ?? ""),
    status: String(a.status ?? seed?.status ?? "Existing"),
    compelling: String(a.compelling ?? seed?.compelling ?? ""),
    solutions: Array.isArray(a.solutions) ? (a.solutions as TerritoryAccount["solutions"]) : seed?.solutions ?? [],
    contacts: Array.isArray(a.contacts) ? (a.contacts as TerritoryAccount["contacts"]) : seed?.contacts ?? [],
    motion,
    snowflakeUsage,
    usageNote: String(a.usageNote ?? seed?.usageNote ?? ""),
    pipelineLowK: pl,
    pipelineHighK: Math.max(ph, pl),
    day0: parseDay0(a, seed),
    whyWithoutSnowflake: String(a.whyWithoutSnowflake ?? seed?.whyWithoutSnowflake ?? ""),
    dealMechanics: parseDealMechanics(a, seed),
  };
}

function parseAccounts(raw: string): TerritoryAccount[] {
  const parsed = JSON.parse(raw) as unknown[];
  return parsed.map((row) => normalizeAccountRow(row as Record<string, unknown>));
}

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

const TERRITORY_THESIS = [
  "Every account here is already on Snowflake. The gap is not shelfware—it is activation: governed cross-domain data, AI and apps on that data, and partner-grade sharing without standing up new stacks.",
  "The pattern across the book: volume and regulatory surface outpaced operational discipline. Point tools and pipeline rebuilds cap how fast teams act on portfolio risk, customer outcomes, and partner economics.",
  "Snowflake wins as the execution layer where those outcomes ship in days, not quarters—same governance, native workloads, no duplicate rebuild of the data plane.",
] as const;

function likelihoodPillClass(l: DealLikelihood) {
  if (l === "high") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (l === "low") return "border-slate-200 bg-slate-100 text-slate-600";
  return "border-amber-200 bg-amber-50 text-amber-900";
}

function likelihoodLabel(l: DealLikelihood) {
  if (l === "high") return "High";
  if (l === "low") return "Low";
  return "Medium";
}

export default function TerritoryIntelligenceMap() {
  const [accounts, setAccounts] = useState<TerritoryAccount[]>(DEFAULT_TERRITORY_ACCOUNTS);
  const [sel, setSel] = useState<TerritoryAccount | null>(null);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState<"accounts" | "solutions">("accounts");
  const [fTier, setFTier] = useState(0);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [snowflakeIntelOpen, setSnowflakeIntelOpen] = useState(false);
  const [cloudSync, setCloudSync] = useState<"off" | "ok" | "error">("off");

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

      try {
        const res = await fetch("/api/territory", { cache: "no-store" });
        const j = (await res.json()) as {
          configured?: boolean;
          accounts?: unknown;
        };
        if (j.configured && Array.isArray(j.accounts) && j.accounts.length > 0) {
          const parsed = (j.accounts as Record<string, unknown>[]).map((row) =>
            normalizeAccountRow(row)
          );
          setAccounts(parsed);
          setCloudSync("ok");
          try {
            await territoryStorageSet(SK, JSON.stringify(parsed));
          } catch {
            /* local cache optional */
          }
        } else if (j.configured) {
          setCloudSync("ok");
        }
      } catch {
        setCloudSync((prev) => (prev === "ok" ? "ok" : "off"));
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
    try {
      const res = await fetch("/api/territory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accounts: u }),
      });
      const j = (await res.json()) as { ok?: boolean };
      if (res.ok && j.ok) {
        setCloudSync("ok");
      } else if (res.status === 503) {
        setCloudSync("off");
      } else {
        setCloudSync("error");
      }
    } catch {
      setCloudSync("error");
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
      motion: "net_new_workload",
      snowflakeUsage: "moderate",
      usageNote: "",
      pipelineLowK: 50,
      pipelineHighK: 200,
      day0: {
        likelihood: "medium",
        likelihoodWhy: "",
        timeline: "",
        firstMeeting: "",
      },
      whyWithoutSnowflake: "",
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
      save(JSON.parse(JSON.stringify(DEFAULT_TERRITORY_ACCOUNTS)) as TerritoryAccount[]);
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

  const openAccount = (a: TerritoryAccount) => {
    setSel(a);
    setEdit(false);
  };

  const filterPill = (active: boolean) =>
    cn(
      "shrink-0 touch-manipulation rounded-md border px-3 py-2 text-xs font-medium transition-colors sm:py-1.5",
      active
        ? "border-[#29B5E8] bg-sky-50 text-sky-900"
        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
    );

  const bookLabel = (status: string) => (status === "Existing" ? "Customer" : status);

  const motionCounts = countMotion(accounts);
  const pipeTotals = sumPipelineBounds(accounts);
  const territoryPotentialSummary = `${accounts.length} accounts · ${motionCounts.expansion} expansion depth · ${motionCounts.netNew} net-new workload bets · ${formatTerritoryPotentialRange(pipeTotals.low, pipeTotals.high)}`;

  const snowflakeUsagePill = (u: SnowflakeUsageTier) =>
    u === "light"
      ? "border-slate-200 bg-slate-100 text-slate-700"
      : u === "heavy"
        ? "border-[#1e4a72] bg-[#0f2942] text-[#c5dcf5]"
        : "border-sky-200 bg-sky-50 text-sky-900";

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased md:flex-row">
      <aside
        className={cn(
          "hidden shrink-0 flex-col border-r border-slate-200/90 bg-white shadow-[1px_0_0_rgba(15,23,42,0.04)] transition-[width] duration-200 ease-out md:flex",
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
                Live plan · Expansion
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
                setEdit(false);
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
          {navCollapsed ? (
            <button
              type="button"
              onClick={() => setSnowflakeIntelOpen(true)}
              className="mt-2 flex w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50/80 py-2.5 text-[#29B5E8] transition-colors hover:border-sky-300 hover:bg-sky-50/50"
              aria-label="Open Snowflake Intelligence"
              title="Snowflake Intelligence"
            >
              <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} />
            </button>
          ) : (
            <div className="mt-2 space-y-2 px-2 pb-1">
              <button
                type="button"
                onClick={() => setSnowflakeIntelOpen(true)}
                className="group flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-left text-[12px] font-medium text-slate-800 transition-colors hover:border-sky-300 hover:bg-sky-50/50"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#29B5E8]" strokeWidth={2} />
                  Snowflake Intelligence
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 group-hover:text-[#29B5E8]">
                  Open
                </span>
              </button>
              <p className="text-[11px] leading-snug text-slate-400">
                Claude-powered help for territory narrative, Snowflake Intelligence, and platform positioning.
              </p>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 border-b border-slate-200/90 bg-white">
          <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Territory thesis
              </p>
              <h1 className="mt-0.5 text-[15px] font-semibold leading-snug tracking-tight text-slate-900 sm:text-lg">
                Execution map — customers ready to expand
              </h1>
              <div className="mt-2 max-w-3xl space-y-2 text-xs leading-snug text-slate-700 sm:text-[13px]">
                {TERRITORY_THESIS.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <p className="mt-2 max-w-2xl text-[11px] leading-relaxed text-slate-500">
                Account narratives align to your Territory Summary workbook (GT _ Snowflake Territory Mapping.xlsx);
                validate stakeholders and pipeline in CRM before live calls.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSnowflakeIntelOpen(true)}
              className="inline-flex min-h-[44px] shrink-0 touch-manipulation items-center justify-center gap-2 self-stretch rounded-lg bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 sm:min-h-0 sm:self-auto sm:py-2"
            >
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
              Snowflake Intelligence
            </button>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="relative min-w-0 max-w-md flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                strokeWidth={1.75}
                aria-hidden
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search accounts…"
                className="min-h-[44px] w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-base text-slate-900 outline-none ring-sky-500/0 transition-[box-shadow,border-color] placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-500/20 sm:min-h-0 sm:py-2 sm:text-sm"
              />
            </div>
            <div className="-mx-1 flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:ml-auto">
              {[0, 1, 2, 3].map((t) => (
                <button key={t} type="button" onClick={() => setFTier(t)} className={filterPill(fTier === t)}>
                  {t === 0 ? "All tiers" : `Tier ${t}`}
                </button>
              ))}
              {saving && (
                <span className="ml-2 text-[11px] font-medium text-[#29B5E8]">Saved</span>
              )}
              {cloudSync === "ok" && (
                <span className="ml-2 text-[11px] text-slate-400">Cloud backup on</span>
              )}
              {cloudSync === "error" && (
                <span className="ml-2 text-[11px] text-rose-600">Cloud sync failed — local only</span>
              )}
            </div>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 overflow-hidden">
          <div
            className={cn(
              "min-w-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-5 sm:px-6 lg:px-8",
              "pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] md:pb-6",
              sel && "max-md:pb-5"
            )}
          >
            <div
              className="mb-5 rounded-xl border border-[#1e3a5f]/30 bg-[#0f1a2e] px-4 py-3.5 shadow-sm sm:px-5"
              role="status"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7aa3d1]">
                Territory potential
              </p>
              <p className="mt-1.5 break-words text-[13px] font-medium leading-snug text-[#e8f0fc] sm:text-sm">
                {territoryPotentialSummary}
              </p>
              <p className="mt-2 text-[10px] leading-relaxed text-[#8faed6]">
                Bands are modeled, not booked. Tie to opportunities and consumption reports before forecasting.
              </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
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
                  className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-sm sm:p-4"
                >
                  <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-slate-400 sm:text-[10px]">
                    {s.label}
                  </p>
                  <p className={cn("mt-1 text-xl font-bold tabular-nums tracking-tight sm:text-2xl lg:text-[26px]", s.className)}>
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

                    <div className="space-y-3 md:hidden">
                      {ta.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => openAccount(a)}
                          className={cn(
                            "w-full touch-manipulation rounded-xl border border-slate-200/90 bg-white p-4 text-left shadow-sm transition-colors active:bg-slate-50",
                            sel?.id === a.id && "border-sky-300 ring-2 ring-sky-200/60"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <div className="text-[15px] font-semibold leading-snug text-slate-900">{a.name}</div>
                              <div className="mt-0.5 text-xs text-slate-500">{a.industry}</div>
                            </div>
                            <span
                              className={cn(
                                "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                likelihoodPillClass(a.day0.likelihood)
                              )}
                            >
                              D0 {likelihoodLabel(a.day0.likelihood)}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold tabular-nums text-slate-900">
                              {formatPipelineK(a.pipelineLowK, a.pipelineHighK)}
                            </span>
                            <span className="text-[11px] text-slate-400">WB {a.acv}</span>
                            <span
                              className={cn(
                                "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                snowflakeUsagePill(a.snowflakeUsage)
                              )}
                            >
                              {usageLabel(a.snowflakeUsage)}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                a.status === "Existing"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-800"
                              )}
                            >
                              {bookLabel(a.status)}
                            </span>
                          </div>
                          {a.usageNote ? (
                            <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-slate-500">{a.usageNote}</p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-1">
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
                        </button>
                      ))}
                    </div>

                    <div className="hidden overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm md:block">
                      <div className="overflow-x-auto">
                        <div className="min-w-[980px]">
                          <div className="grid grid-cols-[minmax(0,1.85fr)_minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(0,1.05fr)_minmax(0,0.72fr)_minmax(0,2.35fr)] gap-2 border-b border-slate-200 bg-slate-50 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">
                            {["Account", "Industry", "Est. pipeline", "Snowflake", "Book", "Solutions"].map((h) => (
                              <span key={h}>{h}</span>
                            ))}
                          </div>
                          {ta.map((a) => (
                            <div
                              key={a.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => openAccount(a)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  openAccount(a);
                                }
                              }}
                              className={cn(
                                "grid cursor-pointer grid-cols-[minmax(0,1.85fr)_minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(0,1.05fr)_minmax(0,0.72fr)_minmax(0,2.35fr)] gap-2 border-b border-slate-100 px-5 py-3.5 text-left transition-colors last:border-b-0",
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
                              <div className="flex flex-col justify-center gap-0.5">
                                <span className="text-xs font-semibold tabular-nums text-slate-900">
                                  {formatPipelineK(a.pipelineLowK, a.pipelineHighK)}
                                </span>
                                <span className="text-[10px] text-slate-400">WB: {a.acv}</span>
                                <span
                                  className={cn(
                                    "mt-0.5 inline-flex w-fit rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide",
                                    likelihoodPillClass(a.day0.likelihood)
                                  )}
                                >
                                  D0 · {likelihoodLabel(a.day0.likelihood)}
                                </span>
                              </div>
                              <div className="flex flex-col justify-center gap-1">
                                <span
                                  className={cn(
                                    "inline-flex w-fit rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                                    snowflakeUsagePill(a.snowflakeUsage)
                                  )}
                                >
                                  {usageLabel(a.snowflakeUsage)} · SF
                                </span>
                                {a.usageNote ? (
                                  <span className="line-clamp-2 text-[10px] leading-snug text-slate-500">{a.usageNote}</span>
                                ) : null}
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
                  Workload coverage across the book
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

            <div className="mt-10 max-w-3xl border-t border-slate-200/80 pt-8">
              <p className="text-sm font-semibold tracking-tight text-slate-900">
                This is not a territory I need to learn. This is a territory I&apos;m ready to operate.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
                Priorities, land motions, and blockers are named up front. Pipeline and personas stay hypotheses until
                CRM and customer validation—then they become the forecast and the cadence.
              </p>
              <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                Illustrative contacts and numbers—confirm in official systems before external use.
              </p>
            </div>
          </div>

          {sel && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
                aria-label="Close account details"
                onClick={() => setSel(null)}
              />
              <aside
                className={cn(
                  "flex w-[min(100vw-1rem,440px)] shrink-0 flex-col border-l border-slate-200/90 bg-white shadow-[inset_1px_0_0_rgba(15,23,42,0.04)]",
                  "md:max-h-full md:overflow-y-auto",
                  "max-md:fixed max-md:inset-0 max-md:z-50 max-md:h-[100dvh] max-md:w-full max-md:max-h-[100dvh] max-md:border-0 max-md:shadow-none"
                )}
              >
                <div className="flex min-h-0 flex-1 flex-col md:contents">
                  <div className="flex shrink-0 items-start justify-between gap-2 border-b border-slate-200/90 bg-white px-4 py-4 max-md:pt-[max(1rem,env(safe-area-inset-top,0px))] sm:gap-3 sm:px-6 sm:py-5">
                    <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setSel(null)}
                        className="mt-0.5 flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 md:hidden"
                        aria-label="Back to list"
                      >
                        <ChevronLeft className="h-5 w-5" strokeWidth={2} />
                      </button>
                      <div className="min-w-0 flex-1">
                        {edit ? (
                          <input
                            value={sel.name}
                            onChange={(e) => ua(sel.id, "name", e.target.value)}
                            className="w-full rounded-md border border-slate-200 px-2 py-2 text-base font-bold text-slate-900 outline-none ring-sky-500/0 focus:ring-2 focus:ring-sky-500/20 sm:py-1 sm:text-lg"
                          />
                        ) : (
                          <h2 className="text-[17px] font-bold leading-snug tracking-tight text-slate-900 sm:text-lg">
                            {sel.name}
                          </h2>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEdit(!edit)}
                        className={cn(
                          "min-h-[44px] touch-manipulation rounded-md border px-3 py-2 text-xs font-medium transition-colors sm:min-h-0 sm:py-1.5",
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
                        className="hidden min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 md:flex"
                        aria-label="Close panel"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain max-md:min-h-0 md:block md:flex-none md:overflow-visible">
              <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
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
                      className="min-h-[40px] w-full max-w-[11rem] rounded-md border border-slate-200 px-2.5 py-2 text-xs outline-none sm:min-h-0 sm:w-36 sm:py-1.5"
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

              <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
                <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  Day 0 pipeline view
                </p>
                <p className="mb-3 text-[10px] text-slate-400">Field hypotheses—validate in CRM.</p>
                {edit ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-slate-500">Deal likelihood</span>
                      <select
                        value={sel.day0.likelihood}
                        onChange={(e) =>
                          ua(sel.id, "day0", {
                            ...sel.day0,
                            likelihood: e.target.value as DealLikelihood,
                          })
                        }
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <label className="text-[10px] text-slate-500">
                      Why this likelihood
                      <textarea
                        value={sel.day0.likelihoodWhy}
                        onChange={(e) =>
                          ua(sel.id, "day0", { ...sel.day0, likelihoodWhy: e.target.value })
                        }
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-800 outline-none"
                      />
                    </label>
                    <label className="text-[10px] text-slate-500">
                      Timeline (e.g. 60–90 days)
                      <input
                        value={sel.day0.timeline}
                        onChange={(e) => ua(sel.id, "day0", { ...sel.day0, timeline: e.target.value })}
                        className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none"
                      />
                    </label>
                    <label className="text-[10px] text-slate-500">
                      First meeting target (persona + why)
                      <textarea
                        value={sel.day0.firstMeeting}
                        onChange={(e) => ua(sel.id, "day0", { ...sel.day0, firstMeeting: e.target.value })}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-800 outline-none"
                      />
                    </label>
                  </div>
                ) : (
                  <dl className="space-y-2.5 text-[12px] leading-snug text-slate-800">
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Est. ACV (modeled)
                      </dt>
                      <dd className="mt-0.5 font-semibold tabular-nums text-slate-900">
                        {formatPipelineK(sel.pipelineLowK, sel.pipelineHighK)}
                        <span className="ml-2 text-[11px] font-normal text-slate-500">WB: {sel.acv}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Deal likelihood
                      </dt>
                      <dd className="mt-1 flex flex-col gap-1">
                        <span
                          className={cn(
                            "inline-flex w-fit rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                            likelihoodPillClass(sel.day0.likelihood)
                          )}
                        >
                          {likelihoodLabel(sel.day0.likelihood)}
                        </span>
                        {sel.day0.likelihoodWhy ? (
                          <span className="text-[12px] text-slate-600">{sel.day0.likelihoodWhy}</span>
                        ) : null}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        Timeline
                      </dt>
                      <dd className="mt-0.5 text-slate-800">{sel.day0.timeline || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        First meeting target
                      </dt>
                      <dd className="mt-0.5 text-slate-700">{sel.day0.firstMeeting || "—"}</dd>
                    </div>
                  </dl>
                )}
              </div>

              <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                  Pipeline and Snowflake footprint
                </p>
                {edit ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={sel.motion}
                        onChange={(e) => ua(sel.id, "motion", e.target.value as TerritoryMotion)}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                      >
                        <option value="expansion">Expansion depth</option>
                        <option value="net_new_workload">Net-new workload bet</option>
                      </select>
                      <select
                        value={sel.snowflakeUsage}
                        onChange={(e) => ua(sel.id, "snowflakeUsage", e.target.value as SnowflakeUsageTier)}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800"
                      >
                        <option value="light">Snowflake: light</option>
                        <option value="moderate">Snowflake: moderate</option>
                        <option value="heavy">Snowflake: heavy</option>
                      </select>
                    </div>
                    <div className="flex flex-wrap items-end gap-2">
                      <label className="flex flex-col gap-0.5 text-[10px] text-slate-500">
                        Pipeline low ($K)
                        <input
                          type="number"
                          min={0}
                          value={sel.pipelineLowK}
                          onChange={(e) => ua(sel.id, "pipelineLowK", Number(e.target.value) || 0)}
                          className="w-24 rounded-md border border-slate-200 px-2 py-1 text-xs tabular-nums outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-0.5 text-[10px] text-slate-500">
                        Pipeline high ($K)
                        <input
                          type="number"
                          min={0}
                          value={sel.pipelineHighK}
                          onChange={(e) => ua(sel.id, "pipelineHighK", Number(e.target.value) || 0)}
                          className="w-24 rounded-md border border-slate-200 px-2 py-1 text-xs tabular-nums outline-none"
                        />
                      </label>
                    </div>
                    <textarea
                      value={sel.usageNote}
                      onChange={(e) => ua(sel.id, "usageNote", e.target.value)}
                      rows={2}
                      placeholder="e.g. Reporting-first; AI and sharing attach"
                      className="w-full resize-y rounded-lg border border-slate-200 p-2 text-xs text-slate-800 outline-none"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-[#0f1a2e] px-2.5 py-1 text-[11px] font-medium text-[#c5daf4]">
                        {sel.motion === "expansion" ? "Expansion depth" : "Net-new workload bet"}
                      </span>
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                          snowflakeUsagePill(sel.snowflakeUsage)
                        )}
                      >
                        {usageLabel(sel.snowflakeUsage)} Snowflake footprint
                      </span>
                    </div>
                    <p className="text-sm font-semibold tabular-nums text-slate-900">
                      {formatPipelineK(sel.pipelineLowK, sel.pipelineHighK)}{" "}
                      <span className="text-[11px] font-normal text-slate-400">modeled</span>
                    </p>
                    {sel.usageNote ? (
                      <p className="text-[12px] leading-relaxed text-slate-600">{sel.usageNote}</p>
                    ) : (
                      <p className="text-[12px] text-slate-400">Add a usage note in Edit (consumption context).</p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  Why this fails without Snowflake
                </p>
                {edit ? (
                  <textarea
                    value={sel.whyWithoutSnowflake}
                    onChange={(e) => ua(sel.id, "whyWithoutSnowflake", e.target.value)}
                    rows={4}
                    placeholder="Governed cross-domain access, time-to-value, sharing, scale…"
                    className="w-full resize-y rounded-lg border border-slate-200 p-2.5 text-[13px] leading-relaxed text-slate-800 outline-none"
                  />
                ) : (
                  <p className="text-[13px] leading-relaxed text-slate-700">
                    {sel.whyWithoutSnowflake || (
                      <span className="text-slate-400">Add the “required, not nice-to-have” case in Edit.</span>
                    )}
                  </p>
                )}
              </div>

              <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
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

              {sel.dealMechanics && (
                <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-4 sm:px-6">
                  <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    How this deal closes
                  </p>
                  <p className="mb-3 text-[10px] text-slate-400">
                    Flagship mechanics—stakeholders and motion spelled out for live execution.
                  </p>
                  {edit ? (
                    <div className="flex flex-col gap-3">
                      {(
                        [
                          ["economicBuyer", "Economic buyer"],
                          ["technicalBuyer", "Technical buyer"],
                          ["champion", "Champion"],
                          ["landMotion", "Land motion (first workload + entry)"],
                          ["expansionAfter", "Expansion after proof"],
                          ["blockers", "Key blockers"],
                          ["competitiveRisk", "Competitive / build risk"],
                        ] as const
                      ).map(([key, label]) => (
                        <label key={key} className="text-[10px] text-slate-500">
                          {label}
                          <textarea
                            value={sel.dealMechanics![key]}
                            onChange={(e) =>
                              ua(sel.id, "dealMechanics", {
                                ...sel.dealMechanics!,
                                [key]: e.target.value,
                              })
                            }
                            rows={key === "landMotion" || key === "blockers" ? 3 : 2}
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-xs text-slate-800 outline-none"
                          />
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 text-[12px] leading-snug text-slate-800">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Stakeholder map
                        </p>
                        <ul className="mt-1 list-inside list-disc text-slate-700">
                          <li>
                            <span className="font-medium text-slate-800">Economic: </span>
                            {sel.dealMechanics.economicBuyer}
                          </li>
                          <li>
                            <span className="font-medium text-slate-800">Technical: </span>
                            {sel.dealMechanics.technicalBuyer}
                          </li>
                          <li>
                            <span className="font-medium text-slate-800">Champion: </span>
                            {sel.dealMechanics.champion}
                          </li>
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Land motion
                        </p>
                        <p className="mt-1 text-slate-700">{sel.dealMechanics.landMotion}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Expansion path
                        </p>
                        <p className="mt-1 text-slate-700">{sel.dealMechanics.expansionAfter}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Blockers
                        </p>
                        <p className="mt-1 text-slate-700">{sel.dealMechanics.blockers}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                          Competitive risk
                        </p>
                        <p className="mt-1 text-slate-700">{sel.dealMechanics.competitiveRisk}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
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

              <div className="px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:px-6 sm:pb-4">
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
                      "flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-2.5 sm:py-2.5",
                      i > 0 && "border-t border-slate-100"
                    )}
                  >
                    {edit ? (
                      <>
                        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                          <input
                            value={con.name}
                            onChange={(e) => uc(sel.id, i, "name", e.target.value)}
                            placeholder="Name"
                            className="min-h-[40px] min-w-0 flex-1 rounded border border-slate-200 px-2 py-2 text-xs outline-none sm:min-h-0 sm:py-1"
                          />
                          <input
                            value={con.title}
                            onChange={(e) => uc(sel.id, i, "title", e.target.value)}
                            placeholder="Title"
                            className="min-h-[40px] min-w-0 flex-1 rounded border border-slate-200 px-2 py-2 text-xs outline-none sm:min-h-0 sm:py-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={con.role}
                            onChange={(e) => uc(sel.id, i, "role", e.target.value)}
                            className="min-h-[40px] flex-1 rounded border border-slate-200 bg-white px-2 py-2 text-[11px] sm:min-h-0 sm:flex-none sm:px-1.5 sm:py-1"
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
                            className="flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded border border-rose-200 bg-rose-50 text-rose-700 sm:h-auto sm:w-auto sm:p-1"
                            aria-label="Remove contact"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex w-full items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-semibold text-sky-800 sm:h-8 sm:w-8">
                          {con.name ? con.name.split(" ").map((n) => n[0]).join("") : "?"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-slate-900">{con.name || "TBD"}</div>
                          <div className="text-[11px] text-slate-400">{con.title}</div>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 self-start rounded-full px-2 py-0.5 text-[10px] font-medium sm:self-center",
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
                      </div>
                    )}
                  </div>
                ))}
                {edit && (
                  <button
                    type="button"
                    onClick={() => rmAcc(sel.id)}
                    className="mt-4 min-h-[48px] w-full touch-manipulation rounded-lg border border-rose-200 bg-rose-50 py-3 text-xs font-medium text-rose-800 transition-colors hover:bg-rose-100 sm:min-h-0 sm:py-2.5"
                  >
                    Delete account
                  </button>
                )}
              </div>
                  </div>
                </div>
            </aside>
            </>
          )}
        </div>
      </div>

      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 grid h-[calc(3.5rem+env(safe-area-inset-bottom,0px))] grid-cols-5 border-t border-slate-200/90 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden",
          sel && "hidden"
        )}
        aria-label="Territory navigation"
      >
        <button
          type="button"
          onClick={() => {
            setView("accounts");
            setSel(null);
            setEdit(false);
          }}
          className={cn(
            "flex touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
            view === "accounts" && !sel ? "text-[#29B5E8]" : "text-slate-500"
          )}
        >
          <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
          Accounts
        </button>
        <button
          type="button"
          onClick={() => {
            setView("solutions");
            setSel(null);
            setEdit(false);
          }}
          className={cn(
            "flex touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
            view === "solutions" ? "text-[#29B5E8]" : "text-slate-500"
          )}
        >
          <Layers2 className="h-5 w-5" strokeWidth={1.75} />
          Solutions
        </button>
        <button
          type="button"
          onClick={addAcc}
          className="flex touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-600"
        >
          <Plus className="h-5 w-5" strokeWidth={1.75} />
          Add
        </button>
        <button
          type="button"
          onClick={() => setSnowflakeIntelOpen(true)}
          className="flex touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-600"
        >
          <Sparkles className="h-5 w-5 text-[#29B5E8]" strokeWidth={2} />
          Intel
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex touch-manipulation flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-500"
        >
          <RotateCcw className="h-5 w-5" strokeWidth={1.75} />
          Reset
        </button>
      </nav>

      <SnowflakeIntelligencePanel
        isOpen={snowflakeIntelOpen}
        onClose={() => setSnowflakeIntelOpen(false)}
      />
    </div>
  );
}
