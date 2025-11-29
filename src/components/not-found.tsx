import { Button } from "@ras-sh/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

export function NotFound({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="space-y-3">
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl">
            404
          </h1>
          <div className="text-lg text-muted-foreground leading-relaxed sm:text-xl">
            {children || <p>The page you are looking for does not exist.</p>}
          </div>
        </div>

        <div className="flex flex-col flex-wrap items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
          <Button
            onClick={() => window.history.back()}
            size="lg"
            type="button"
            variant="outline"
          >
            <ArrowLeft aria-hidden="true" />
            Go back
          </Button>
          <Button asChild size="lg">
            <Link to="/">
              <Home aria-hidden="true" />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
