import { PostHogProvider } from "@posthog/react";
import posthogClient from "posthog-js";

const client =
  typeof window === "undefined"
    ? null
    : posthogClient.init(import.meta.env.VITE_POSTHOG_KEY, {
        api_host: "https://eu.i.posthog.com",
        defaults: "2025-05-24",
        capture_exceptions: true,
        debug: import.meta.env.MODE === "development",
      });

export function PHProvider({ children }: { children: React.ReactNode }) {
  if (!client) {
    return <>{children}</>;
  }
  return <PostHogProvider client={client}>{children}</PostHogProvider>;
}
