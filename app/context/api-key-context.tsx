"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const API_KEY_STORAGE_KEY = "databricks-gtm-api-key";

interface ApiKeyContextValue {
  apiKey: string;
  hasApiKey: boolean;
  isReady: boolean;
  setApiKey: (apiKey: string) => void;
  clearApiKey: () => void;
  getRequestHeaders: () => { "x-databricks-api-key"?: string };
}

const ApiKeyContext = createContext<ApiKeyContextValue | null>(null);

function normalizeApiKey(apiKey: string) {
  return apiKey.trim();
}

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedApiKey = window.localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
    setApiKeyState(storedApiKey);
    setIsReady(true);
  }, []);

  const setApiKey = useCallback((nextApiKey: string) => {
    const normalizedKey = normalizeApiKey(nextApiKey);
    setApiKeyState(normalizedKey);
    window.localStorage.setItem(API_KEY_STORAGE_KEY, normalizedKey);
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState("");
    window.localStorage.removeItem(API_KEY_STORAGE_KEY);
  }, []);

  const getRequestHeaders = useCallback(() => {
    if (!apiKey) {
      return {};
    }

    return { "x-databricks-api-key": apiKey };
  }, [apiKey]);

  const value = useMemo(
    () => ({
      apiKey,
      hasApiKey: apiKey.length > 0,
      isReady,
      setApiKey,
      clearApiKey,
      getRequestHeaders,
    }),
    [apiKey, clearApiKey, getRequestHeaders, isReady, setApiKey]
  );

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);

  if (!context) {
    throw new Error("useApiKey must be used within ApiKeyProvider");
  }

  return context;
}
