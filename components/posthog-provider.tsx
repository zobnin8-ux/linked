"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import posthog from "posthog-js";

const INIT_FLAG = "__linkedin_audit_posthog";

export function PHProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const landingTracked = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key) return;

    const w = window as unknown as Record<string, boolean>;
    if (!w[INIT_FLAG]) {
      posthog.init(key, {
        api_host: host || "https://eu.posthog.com",
        capture_pageview: false,
        persistence: "localStorage+cookie",
      });
      w[INIT_FLAG] = true;
    }

    if (pathname === "/" && !landingTracked.current) {
      landingTracked.current = true;
      posthog.capture("landing_viewed");
    }
  }, [pathname]);

  return <>{children}</>;
}
