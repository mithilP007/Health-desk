import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AmbientBackground } from "../components/ambient";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <AmbientBackground />
      <div className="glass max-w-md rounded-2xl p-10 text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Signal lost</h2>
        <p className="mt-2 text-sm text-white/60">
          The neural pathway you requested does not exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#04111d] transition hover:bg-cyan-300"
          >
            Return to HealthDesk
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <AmbientBackground />
      <div className="glass max-w-md rounded-2xl p-10 text-center">
        <h1 className="text-xl font-semibold text-white">Diagnostic interrupted</h1>
        <p className="mt-2 text-sm text-white/60">{error.message || "An unexpected error occurred."}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-[#04111d] hover:bg-cyan-300"
          >Retry</button>
          <a href="/" className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#07111f" },
      { title: "HealthDesk Pro — Advanced Medical Reasoning AI" },
      { name: "description", content: "A cinematic, futuristic medical AI operating system. Reason, triage, and act with confidence — online or offline." },
      { property: "og:title", content: "HealthDesk Pro — Medical AI OS" },
      { property: "og:description", content: "Luxury futuristic AI healthcare interface." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" } as any,
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" } as any,
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AmbientBackground />
      <Outlet />
    </QueryClientProvider>
  );
}
