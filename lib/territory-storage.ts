type StorageResult = { value?: string } | null | undefined;

type VisionStorage = {
  get: (key: string) => Promise<StorageResult>;
  set: (key: string, value: string) => Promise<void>;
};

function getVisionStorage(): VisionStorage | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { storage?: VisionStorage }).storage;
}

export async function territoryStorageGet(key: string): Promise<{ value?: string } | null> {
  const vs = getVisionStorage();
  if (vs?.get) {
    try {
      const r = await vs.get(key);
      if (r && typeof r.value === "string") return { value: r.value };
    } catch {
      /* use localStorage */
    }
  }
  try {
    const v = localStorage.getItem(key);
    return v != null ? { value: v } : null;
  } catch {
    return null;
  }
}

export async function territoryStorageSet(key: string, value: string): Promise<void> {
  const vs = getVisionStorage();
  if (vs?.set) {
    try {
      await vs.set(key, value);
      return;
    } catch {
      /* fall through */
    }
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    throw new Error("Could not persist territory data (storage blocked)");
  }
}
