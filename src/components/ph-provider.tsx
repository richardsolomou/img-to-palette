import { PostHogProvider } from "@posthog/react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";

export function PHProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: "https://eu.i.posthog.com",
      defaults: "2025-05-24",
      capture_exceptions: true,
      debug: import.meta.env.MODE === "development",
    });

    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <>{children}</>;
  }
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
