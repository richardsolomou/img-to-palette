import { SiGithub } from "@icons-pack/react-simple-icons";
import { usePostHog } from "@posthog/react";
import { Avatar, AvatarFallback, AvatarImage } from "@ras-sh/ui/avatar";
import { Button } from "@ras-sh/ui/button";

export function Layout({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center space-y-12 p-8 transition-all duration-300 sm:p-12 md:p-16 lg:p-20">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-bold font-mono text-4xl text-zinc-100">img-to-palette</h1>

          <Button asChild>
            <a
              href="https://github.com/richardsolomou/img-to-palette"
              onClick={() =>
                posthog?.capture("github_link_clicked", {
                  destination_url: "https://github.com/richardsolomou/img-to-palette",
                })
              }
              rel="noopener noreferrer"
              target="_blank"
            >
              <SiGithub className="size-4" />
              GitHub
            </a>
          </Button>
        </div>

        <p className="font-sans text-xl text-zinc-300 leading-relaxed">
          🎨 Generate color palettes from any image and find the nearest Tailwind colors for quick
          design matching.
        </p>
      </header>

      <main className="w-full space-y-8">{children}</main>

      <footer className="inline-flex flex-wrap items-center justify-center gap-1 text-center text-sm text-zinc-400">
        Made with ❤️ by{" "}
        <a
          className="inline-flex items-center gap-1 font-medium underline decoration-zinc-600 underline-offset-2 transition-colors hover:text-zinc-100 hover:decoration-zinc-400"
          href="https://solomou.dev"
          onClick={() =>
            posthog?.capture("footer_link_clicked", {
              destination_url: "https://solomou.dev",
            })
          }
          rel="noopener noreferrer"
          target="_blank"
        >
          <Avatar className="size-5">
            <AvatarImage alt="Richard Solomou" src="https://github.com/richardsolomou.png" />
            <AvatarFallback>RS</AvatarFallback>
          </Avatar>
          @richardsolomou
        </a>
      </footer>
    </div>
  );
}
