import { Button } from "@ras-sh/ui/button";
import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";
import { ArrowLeft, Home, RefreshCcw } from "lucide-react";

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <div className="flex min-h-[400px] min-w-0 flex-1 flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <div className="space-y-3">
          <h1 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Something went wrong
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            An error occurred while processing your request. Please try again or
            go back to continue.
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-4 text-left">
          <ErrorComponent error={error} />
        </div>

        <div className="flex flex-col flex-wrap items-center justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
          <Button
            onClick={() => {
              router.invalidate();
            }}
            size="lg"
            type="button"
          >
            <RefreshCcw aria-hidden="true" />
            Try again
          </Button>
          {isRoot ? (
            <Button asChild size="lg" variant="outline">
              <Link to="/">
                <Home aria-hidden="true" />
                Go home
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" variant="outline">
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  window.history.back();
                }}
                to="/"
              >
                <ArrowLeft aria-hidden="true" />
                Go back
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
