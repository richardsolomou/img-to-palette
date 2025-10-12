import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "~/components/layout";
import { PaletteGenerator } from "~/components/palette-generator";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Layout>
      <PaletteGenerator />
    </Layout>
  );
}
