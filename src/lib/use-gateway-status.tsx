"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface GatewayStatus {
  online: boolean | null; // null = checking
  checkedAt: Date | null;
  checking: boolean;
  refresh: () => void;
}

const GatewayStatusContext = createContext<GatewayStatus>({
  online: null,
  checkedAt: null,
  checking: true,
  refresh: () => {},
});

const POLL_INTERVAL = 15_000; // 15 seconds

export function GatewayStatusProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState<boolean | null>(null);
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const [checking, setChecking] = useState(true);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch("/api/gateway/health", { cache: "no-store" });
      const data = await res.json();
      setOnline(data.ok === true);
    } catch {
      setOnline(false);
    } finally {
      setCheckedAt(new Date());
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [check]);

  return (
    <GatewayStatusContext.Provider value={{ online, checkedAt, checking, refresh: check }}>
      {children}
    </GatewayStatusContext.Provider>
  );
}

export function useGatewayStatus() {
  return useContext(GatewayStatusContext);
}
