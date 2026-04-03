import { NextRequest, NextResponse } from "next/server";
import {
  fetchTerritoryBookFromSupabase,
  isTerritorySupabaseConfigured,
  saveTerritoryBookToSupabase,
} from "@/lib/server/supabase-territory";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isTerritorySupabaseConfigured()) {
    return NextResponse.json(
      { configured: false, accounts: null, updatedAt: null },
      { status: 200 }
    );
  }

  const data = await fetchTerritoryBookFromSupabase();
  if (!data) {
    return NextResponse.json(
      { configured: true, accounts: null, updatedAt: null, error: "fetch_failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    configured: true,
    accounts: data.accounts,
    updatedAt: data.updatedAt,
  });
}

export async function POST(req: NextRequest) {
  if (!isTerritorySupabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    const accounts = body?.accounts;
    if (!Array.isArray(accounts)) {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
    }

    const ok = await saveTerritoryBookToSupabase(accounts);
    if (!ok) {
      return NextResponse.json({ ok: false, error: "save_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Territory POST:", e);
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
}
