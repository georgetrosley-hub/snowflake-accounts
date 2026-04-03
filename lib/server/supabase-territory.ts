type TerritoryRow = {
  payload: unknown;
  updated_at: string;
};

function getConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, key } : null;
}

export function isTerritorySupabaseConfigured(): boolean {
  return getConfig() != null;
}

export async function fetchTerritoryBookFromSupabase(): Promise<{
  accounts: unknown;
  updatedAt: string | null;
} | null> {
  const cfg = getConfig();
  if (!cfg) return null;

  const res = await fetch(
    `${cfg.url}/rest/v1/territory_book?select=payload,updated_at&id=eq.default`,
    {
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    console.error("Supabase territory GET failed:", res.status, await res.text());
    return null;
  }

  const rows = (await res.json()) as TerritoryRow[];
  const row = rows[0];
  if (!row) {
    return { accounts: [], updatedAt: null };
  }

  return {
    accounts: row.payload,
    updatedAt: row.updated_at ?? null,
  };
}

export async function saveTerritoryBookToSupabase(accounts: unknown): Promise<boolean> {
  const cfg = getConfig();
  if (!cfg) return false;

  const row = {
    id: "default",
    payload: accounts,
    updated_at: new Date().toISOString(),
  };

  const res = await fetch(`${cfg.url}/rest/v1/territory_book`, {
    method: "POST",
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify([row]),
  });

  if (!res.ok) {
    console.error("Supabase territory upsert failed:", res.status, await res.text());
    return false;
  }

  return true;
}
