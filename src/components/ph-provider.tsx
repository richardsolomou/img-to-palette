import { postHogEnvironment } from "ras-stack/posthog";
import { PostHogIntegration } from "ras-stack/posthog/react";

const projectToken = import.meta.env.VITE_POSTHOG_KEY?.trim();
const environment = projectToken
  ? postHogEnvironment({ projectToken, host: "https://eu.i.posthog.com" })
  : undefined;

export function PHProvider({ children }: { children: React.ReactNode }) {
  return (
    <PostHogIntegration
      environment={environment}
      ingestPath={environment?.host}
      options={{
        defaults: "2025-05-24",
        capture_exceptions: true,
        debug: import.meta.env.MODE === "development",
      }}
    >
      {children}
    </PostHogIntegration>
  );
}
