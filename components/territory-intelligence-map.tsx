"use client";

import { useState, useEffect } from "react";
import { territoryStorageGet, territoryStorageSet } from "@/lib/territory-storage";

const SK = "sf-territory-intel-v1";
const SK_V2 = "sf-territory-intel-v2";

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
    acv: "Existing",
    industry: "Networking / Telecom",
    status: "Existing",
    compelling:
      "Optical networking leader with massive telemetry and network performance data. Digital transformation of network operations creates natural expansion. Deep account plan completed.",
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
    acv: "Existing",
    industry: "Fintech / Mortgage Servicing",
    status: "Existing",
    compelling:
      "Mortgage servicing platform handling loan lifecycle data. Regulatory reporting pressure and servicer partner ecosystem create expansion path. Deep account plan completed.",
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
    acv: "Existing",
    industry: "Fintech / Government (MBS)",
    status: "Existing",
    compelling:
      "Formerly Common Securitization Solutions. FHFA mandate to sell MBS fintech services externally under Director Pulte. Transition from internal utility to external product company creates massive data distribution need.",
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
    acv: "Net New",
    industry: "CXM / SaaS",
    status: "Prospect",
    compelling:
      "NYSE: CXM, ~$857M FY26 revenue. New CRO Scott Millard (Sept 2025, ex-Dell AI Sales), new CFO Anthony Coletta (Oct 2025, ex-SAP), new CPO Karthik Suri. Three C-suite hires in 60 days. NRR declined to 102%. Project Bear Hug expanded to top 700 customers. CEO Rory Read: 'second phase of our transformation.'",
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
    acv: "Net New",
    industry: "Banking / Fintech (BaaS)",
    status: "Prospect",
    compelling:
      "NASDAQ: TBBK. $228M net income. $178B GDV up 17% YoY. #1 prepaid issuer in the US. Consumer fintech loans grew 180% YoY. Q4 EPS miss creating urgency to prove fintech unit economics. APEX 2030 strategy. Partners with PayPal, Chime and others.",
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
    acv: "Net New",
    industry: "B2B Fintech (AR Automation)",
    status: "Prospect",
    compelling:
      "PE-backed (EQT, taken private 2023). Building 'Autopilot' agentic AI assistant and multi-agent platform architecture. Cash application match rates improved 45% to 90%+. AI-first transformation across credit, invoicing, payments, collections and cash application. Lawrenceville NJ HQ.",
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
    acv: "Net New",
    industry: "Healthcare Fintech",
    status: "Prospect",
    compelling:
      "Healthcare payment accuracy platform. Serves 9 of top 10 payers. King of Prussia PA. PE-backed. Massive claims data volumes with fraud detection and overpayment recovery use cases.",
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
    acv: "Net New",
    industry: "Healthcare / AdTech",
    status: "Prospect",
    compelling:
      "Operates online health condition communities connecting patients with pharma advertisers. Patient engagement data across chronic conditions. Philadelphia based. Pharma data monetization and clean room use cases.",
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
    acv: "Net New",
    industry: "SaaS (Sales Comp)",
    status: "Prospect",
    compelling:
      "Sales commission software. Smaller company but growing. Complex comp plan calculations could drive compute consumption. Monitor for scale.",
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
    acv: "Net New",
    industry: "AdTech / AI",
    status: "Prospect",
    compelling:
      "Very small (10-50 people, Brooklyn). Custom AI algorithms for programmatic ad buying. Limited pipeline potential unless they scale significantly. Watch for funding events.",
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
      status: String(a.status ?? "Prospect"),
      compelling: String(a.compelling ?? ""),
      solutions: Array.isArray(a.solutions) ? (a.solutions as TerritoryAccount["solutions"]) : [],
      contacts: Array.isArray(a.contacts) ? (a.contacts as TerritoryAccount["contacts"]) : [],
    };
  });
}

const SnowflakeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
    <path d="M16 2L16 30M16 2L12 6M16 2L20 6M16 30L12 26M16 30L20 26" stroke="#29B5E8" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M3.86 9L28.14 23M3.86 9L4.86 14M3.86 9L8.36 8M28.14 23L27.14 18M28.14 23L23.64 24" stroke="#29B5E8" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M3.86 23L28.14 9M3.86 23L8.36 24M3.86 23L4.86 18M28.14 9L23.64 8M28.14 9L27.14 14" stroke="#29B5E8" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export default function TerritoryIntelligenceMap() {
  const [accounts, setAccounts] = useState<TerritoryAccount[]>(ACCTS);
  const [sel, setSel] = useState<TerritoryAccount | null>(null);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState<"accounts" | "solutions">("accounts");
  const [fTier, setFTier] = useState(0);
  const [fStatus, setFStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        let r = await territoryStorageGet(SK);
        if (r?.value) {
          setAccounts(parseAccounts(r.value));
        } else {
          r = await territoryStorageGet(SK_V2);
          if (r?.value) {
            const migrated = parseAccounts(r.value);
            setAccounts(migrated);
            try {
              await territoryStorageSet(SK, JSON.stringify(migrated));
            } catch {
              /* keep in-memory only */
            }
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
      status: "Prospect",
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
    if (fStatus !== "All" && a.status !== fStatus) return false;
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#F8FAFC", fontFamily: "system-ui" }}>
        <SnowflakeIcon />
        <span style={{ marginLeft: 12, color: "#64748B", fontSize: 14 }}>Loading Territory Intelligence...</span>
      </div>
    );
  }

  const nw = navCollapsed ? 56 : 220;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", color: "#1E293B", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ width: nw, background: "#FFFFFF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", transition: "width 0.2s ease", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ padding: navCollapsed ? "16px 14px" : "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 10, minHeight: 60 }}>
          <div style={{ flexShrink: 0 }}>
            <SnowflakeIcon />
          </div>
          {!navCollapsed && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em", lineHeight: 1.2 }}>Territory Intelligence</div>
              <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 1 }}>Field Enablement</div>
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {[
            { icon: "📊", label: "Accounts", key: "accounts" as const },
            { icon: "🧩", label: "Solutions", key: "solutions" as const },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setView(item.key);
                setSel(null);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: navCollapsed ? "10px 12px" : "8px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                marginBottom: 2,
                fontSize: 13,
                fontWeight: view === item.key ? 600 : 400,
                background: view === item.key ? "#EFF6FF" : "transparent",
                color: view === item.key ? "#1D4ED8" : "#64748B",
                transition: "all 0.15s",
                textAlign: "left",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {!navCollapsed && item.label}
            </button>
          ))}
          <div style={{ height: 1, background: "#E2E8F0", margin: "12px 4px" }} />
          <button
            type="button"
            onClick={addAcc}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: navCollapsed ? "10px 12px" : "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 400, background: "transparent", color: "#64748B", fontFamily: "inherit", textAlign: "left" }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>➕</span>
            {!navCollapsed && "Add Account"}
          </button>
          <button
            type="button"
            onClick={reset}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: navCollapsed ? "10px 12px" : "8px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 400, background: "transparent", color: "#64748B", fontFamily: "inherit", textAlign: "left" }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>🔄</span>
            {!navCollapsed && "Reset Data"}
          </button>
        </div>

        <div style={{ borderTop: "1px solid #E2E8F0", padding: "12px" }}>
          <button type="button" onClick={() => setNavCollapsed(!navCollapsed)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 8px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, color: "#94A3B8", background: "transparent", fontFamily: "inherit", textAlign: "left" }}>
            <span style={{ fontSize: 14 }}>{navCollapsed ? "▶" : "◀"}</span>
            {!navCollapsed && "Collapse"}
          </button>
          {!navCollapsed && (
            <div style={{ padding: "8px", marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>George Trosley</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>Enterprise AE · Mid-Atlantic</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "12px 24px", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", fontSize: 14 }} aria-hidden>
              🔍
            </span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search accounts..." style={{ width: "100%", padding: "8px 12px 8px 34px", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#1E293B", background: "#F8FAFC", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
            {[0, 1, 2, 3].map((t) => (
              <button key={t} type="button" onClick={() => setFTier(t)} style={{ padding: "6px 12px", borderRadius: 6, border: fTier === t ? "1px solid #29B5E8" : "1px solid #E2E8F0", background: fTier === t ? "#EFF6FF" : "#FFF", color: fTier === t ? "#0369A1" : "#64748B", fontSize: 12, fontWeight: fTier === t ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                {t === 0 ? "All" : t === 1 ? "Tier 1" : t === 2 ? "Tier 2" : "Tier 3"}
              </button>
            ))}
            <div style={{ width: 1, background: "#E2E8F0", margin: "0 4px" }} />
            {["All", "Existing", "Prospect"].map((s) => (
              <button key={s} type="button" onClick={() => setFStatus(s)} style={{ padding: "6px 12px", borderRadius: 6, border: fStatus === s ? "1px solid #29B5E8" : "1px solid #E2E8F0", background: fStatus === s ? "#EFF6FF" : "#FFF", color: fStatus === s ? "#0369A1" : "#64748B", fontSize: 12, fontWeight: fStatus === s ? 600 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                {s}
              </button>
            ))}
          </div>
          {saving && (
            <span style={{ fontSize: 11, color: "#29B5E8", fontWeight: 500 }}>Saved ✓</span>
          )}
        </div>

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Accounts", value: accounts.length, color: "#0F172A" },
                { label: "Existing", value: accounts.filter((a) => a.status === "Existing").length, color: "#059669" },
                { label: "Net New", value: accounts.filter((a) => a.status === "Prospect").length, color: "#D97706" },
                { label: "Solutions Mapped", value: accounts.reduce((s, a) => s + a.solutions.length, 0), color: "#2563EB" },
                { label: "Contacts", value: accounts.reduce((s, a) => s + a.contacts.length, 0), color: "#7C3AED" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {view === "accounts" ? (
              [1, 2, 3].map((tier) => {
                const ta = fil.filter((a) => a.tier === tier);
                if (!ta.length) return null;
                return (
                  <div key={tier} style={{ marginBottom: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: tier === 1 ? "#29B5E8" : tier === 2 ? "#6CB4EE" : "#94A3B8" }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>Tier {tier}</span>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>
                        {ta.length} account{ta.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    <div style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr 2.5fr", padding: "10px 20px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                        {["Account", "Industry", "ACV", "Status", "Solutions"].map((h) => (
                          <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {h}
                          </span>
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
                          style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 0.8fr 0.8fr 2.5fr", padding: "14px 20px", borderBottom: i < ta.length - 1 ? "1px solid #F1F5F9" : "none", cursor: "pointer", transition: "background 0.1s", background: sel?.id === a.id ? "#F0F9FF" : "transparent" }}
                          onMouseEnter={(e) => {
                            if (sel?.id !== a.id) e.currentTarget.style.background = "#F8FAFC";
                          }}
                          onMouseLeave={(e) => {
                            if (sel?.id !== a.id) e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{a.name}</div>
                            {a.contacts.filter((c) => c.name).length > 0 && (
                              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{a.contacts.filter((c) => c.name).map((c) => c.name).join(", ")}</div>
                            )}
                          </div>
                          <div style={{ fontSize: 13, color: "#64748B", display: "flex", alignItems: "center" }}>{a.industry}</div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ fontSize: 12, fontWeight: 500, color: "#0F172A" }}>{a.acv}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: a.status === "Existing" ? "#ECFDF5" : "#FFF7ED", color: a.status === "Existing" ? "#059669" : "#D97706" }}>{a.status}</span>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                            {a.solutions.map((s, j) => (
                              <span key={j} style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 500, background: `${gc(s.product)}10`, color: gc(s.product), border: `1px solid ${gc(s.product)}25` }}>
                                {s.product}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Solution Positioning Across Accounts</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
                  {Object.entries(allSol)
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([product, entries]) => (
                      <div key={product} style={{ background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                          <div style={{ width: 10, height: 10, borderRadius: 3, background: gc(product) }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{product}</span>
                          <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "#94A3B8", background: "#F1F5F9", padding: "2px 8px", borderRadius: 10 }}>{entries.length}</span>
                        </div>
                        {entries.map((entry, i) => {
                          const acc = accounts.find((x) => x.id === entry.id);
                          const sol = acc?.solutions.find((s) => s.product === product);
                          return (
                            <div key={entry.id} style={{ padding: "10px 0", borderTop: i > 0 ? "1px solid #F1F5F9" : "none" }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{entry.name}</div>
                              {sol && <div style={{ fontSize: 12, color: "#64748B", marginTop: 3, lineHeight: 1.4 }}>{sol.problem}</div>}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {sel && (
            <div style={{ width: 400, borderLeft: "1px solid #E2E8F0", background: "#FFFFFF", overflowY: "auto", flexShrink: 0 }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, marginRight: 12 }}>
                  {edit ? (
                    <input value={sel.name} onChange={(e) => ua(sel.id, "name", e.target.value)} style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", border: "1px solid #E2E8F0", borderRadius: 6, padding: "4px 8px", width: "100%", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                  ) : (
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: 0 }}>{sel.name}</h2>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" onClick={() => setEdit(!edit)} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #E2E8F0", background: edit ? "#EFF6FF" : "#FFF", color: edit ? "#0369A1" : "#64748B", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    {edit ? "Done" : "Edit"}
                  </button>
                  <button type="button" onClick={() => setSel(null)} style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFF", color: "#94A3B8", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                    ✕
                  </button>
                </div>
              </div>

              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9" }}>
                {edit ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <select value={sel.tier} onChange={(e) => ua(sel.id, "tier", +e.target.value)} style={{ padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 12, color: "#1E293B", fontFamily: "inherit", background: "#FFF" }}>
                      <option value={1}>Tier 1</option>
                      <option value={2}>Tier 2</option>
                      <option value={3}>Tier 3</option>
                    </select>
                    <input value={sel.acv} onChange={(e) => ua(sel.id, "acv", e.target.value)} style={{ padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 12, width: 80, fontFamily: "inherit", outline: "none" }} />
                    <input value={sel.industry} onChange={(e) => ua(sel.id, "industry", e.target.value)} style={{ padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 12, width: 140, fontFamily: "inherit", outline: "none" }} />
                    <select value={sel.status} onChange={(e) => ua(sel.id, "status", e.target.value)} style={{ padding: "6px 10px", border: "1px solid #E2E8F0", borderRadius: 6, fontSize: 12, fontFamily: "inherit", background: "#FFF" }}>
                      <option value="Existing">Existing</option>
                      <option value="Prospect">Prospect</option>
                    </select>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#F0F9FF", color: "#0369A1" }}>Tier {sel.tier}</span>
                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#F8FAFC", color: "#475569" }}>{sel.acv}</span>
                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: "#F8FAFC", color: "#475569" }}>{sel.industry}</span>
                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, background: sel.status === "Existing" ? "#ECFDF5" : "#FFF7ED", color: sel.status === "Existing" ? "#059669" : "#D97706" }}>{sel.status}</span>
                  </div>
                )}
              </div>

              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Why Now</div>
                {edit ? (
                  <textarea value={sel.compelling} onChange={(e) => ua(sel.id, "compelling", e.target.value)} rows={4} style={{ width: "100%", padding: 10, border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#1E293B", fontFamily: "inherit", resize: "vertical", outline: "none", lineHeight: 1.5, boxSizing: "border-box" }} />
                ) : (
                  <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.6 }}>{sel.compelling || "No compelling event documented"}</p>
                )}
              </div>

              <div style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Solutions</span>
                  {edit && (
                    <button type="button" onClick={() => addSol(sel.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFF", color: "#0369A1", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                      + Add
                    </button>
                  )}
                </div>
                {sel.solutions.map((sol, i) => (
                  <div key={i} style={{ background: "#F8FAFC", borderRadius: 8, padding: 14, marginBottom: 8, border: "1px solid #F1F5F9" }}>
                    {edit ? (
                      <>
                        <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                          <input value={sol.product} onChange={(e) => us(sel.id, i, "product", e.target.value)} style={{ flex: 1, padding: "5px 8px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 12, fontWeight: 600, color: gc(sol.product), fontFamily: "inherit", outline: "none" }} />
                          <button type="button" onClick={() => rmSol(sel.id, i)} style={{ padding: "4px 8px", border: "1px solid #FCA5A5", borderRadius: 4, background: "#FFF5F5", color: "#DC2626", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                            ✕
                          </button>
                        </div>
                        <textarea value={sol.problem} onChange={(e) => us(sel.id, i, "problem", e.target.value)} rows={2} style={{ width: "100%", padding: 8, border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 12, color: "#475569", fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                      </>
                    ) : (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: gc(sol.product) }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: gc(sol.product) }}>{sol.product}</span>
                        </div>
                        <p style={{ fontSize: 12, color: "#64748B", margin: 0, lineHeight: 1.5 }}>{sol.problem}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Key Contacts</span>
                  {edit && (
                    <button type="button" onClick={() => addCon(sel.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFF", color: "#0369A1", fontSize: 11, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                      + Add
                    </button>
                  )}
                </div>
                {sel.contacts.length === 0 && <p style={{ fontSize: 12, color: "#94A3B8" }}>No contacts mapped yet</p>}
                {sel.contacts.map((con, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 0", borderTop: i > 0 ? "1px solid #F1F5F9" : "none" }}>
                    {edit ? (
                      <>
                        <input value={con.name} onChange={(e) => uc(sel.id, i, "name", e.target.value)} placeholder="Name" style={{ flex: 1, padding: "5px 8px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
                        <input value={con.title} onChange={(e) => uc(sel.id, i, "title", e.target.value)} placeholder="Title" style={{ flex: 1, padding: "5px 8px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
                        <select value={con.role} onChange={(e) => uc(sel.id, i, "role", e.target.value)} style={{ padding: "5px 6px", border: "1px solid #E2E8F0", borderRadius: 4, fontSize: 11, fontFamily: "inherit", background: "#FFF" }}>
                          <option value="Champion">Champion</option>
                          <option value="Economic Buyer">Econ Buyer</option>
                          <option value="Technical Champion">Tech Champ</option>
                          <option value="Technical Buyer">Tech Buyer</option>
                          <option value="Influencer">Influencer</option>
                          <option value="Blocker">Blocker</option>
                        </select>
                        <button type="button" onClick={() => rmCon(sel.id, i)} style={{ padding: "4px 8px", border: "1px solid #FCA5A5", borderRadius: 4, background: "#FFF5F5", color: "#DC2626", fontSize: 11, cursor: "pointer" }}>
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#0369A1", flexShrink: 0 }}>
                          {con.name ? con.name.split(" ").map((n) => n[0]).join("") : "?"}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{con.name || "TBD"}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>{con.title}</div>
                        </div>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 20,
                            fontSize: 10,
                            fontWeight: 500,
                            flexShrink: 0,
                            background: con.role.includes("Champion") ? "#ECFDF5" : con.role === "Economic Buyer" ? "#EFF6FF" : con.role === "Blocker" ? "#FFF5F5" : "#FFF7ED",
                            color: con.role.includes("Champion") ? "#059669" : con.role === "Economic Buyer" ? "#0369A1" : con.role === "Blocker" ? "#DC2626" : "#D97706",
                          }}
                        >
                          {con.role}
                        </span>
                      </>
                    )}
                  </div>
                ))}
                {edit && (
                  <button type="button" onClick={() => rmAcc(sel.id)} style={{ width: "100%", padding: 10, marginTop: 16, borderRadius: 8, border: "1px solid #FCA5A5", background: "#FFF5F5", color: "#DC2626", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
