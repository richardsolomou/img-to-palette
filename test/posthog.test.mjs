import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "vite";
import { renderToStaticMarkup } from "react-dom/server";

for (const token of ["phc_test", "", "   "]) {
  test(`application provider preserves direct EU ingestion with ${token.trim() ? "configured" : "missing"} credentials`, async () => {
    const server = await createServer({
      configFile: false,
      envDir: false,
      define: {
        "import.meta.env.VITE_POSTHOG_KEY": JSON.stringify(token),
        "import.meta.env.MODE": JSON.stringify("development"),
      },
      server: { middlewareMode: true },
      appType: "custom",
    });
    try {
      const { PHProvider } = await server.ssrLoadModule("/src/components/ph-provider.tsx");
      const element = PHProvider({ children: "application" });
      assert.deepEqual(
        {
          key: element.props.environment?.projectToken,
          host: element.props.ingestPath,
          options: element.props.options,
          html: renderToStaticMarkup(element),
        },
        {
          key: token.trim() || undefined,
          host: token.trim() ? "https://eu.i.posthog.com" : undefined,
          options: { defaults: "2025-05-24", capture_exceptions: true, debug: true },
          html: "application",
        },
      );
    } finally {
      await server.close();
    }
  });
}
