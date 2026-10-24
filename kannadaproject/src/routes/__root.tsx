import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <section className="wrap center">
      <h1>404</h1>
      <p className="muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn">Go home</Link>
    </section>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <section className="wrap center">
      <h1>This page didn't load</h1>
      <button className="btn" onClick={() => { router.invalidate(); reset(); }}>Try again</button>
    </section>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Namma Baashe · Understand Kannada" },
      { name: "description", content: "Translate, scan, simplify and learn Kannada in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Noto+Sans+Kannada:wght@400;600&family=Figtree:wght@400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  ["/", "Home"], ["/translate", "Translate"], ["/scan", "Scan & Translate"], ["/qr", "QR Scanner"],
  ["/simplify", "Simplify Kannada"], ["/learn", "Learn Kannada"], ["/travel", "Travel & Pilgrimage"], ["/tools", "More Tools"],
] as const;

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <header className="nav">
        <Link className="brand" to="/">
          <span className="logo">ನ</span>
          <span><b>Namma <em>Baashe</em></b><small>Understand · Translate · Connect</small></span>
        </Link>
        <input type="checkbox" id="menu" hidden />
        <label htmlFor="menu" className="burger">☰</label>
        <nav>
          {NAV.map(([to, label]) => (
            <Link key={to} to={to} activeProps={{ className: "active" }} activeOptions={{ exact: true }}>{label}</Link>
          ))}
        </nav>
      </header>
      <main><Outlet /></main>
      <footer className="footer">
        <div><b>Namma Baashe</b><p>Understand Kannada. Connect with Everyone.</p></div>
        <div className="links"><a href="#">About</a><a href="#">Contact</a><a href="#">Privacy Policy</a><a href="#">Terms</a><a href="#">Feedback</a></div>
      </footer>
    </QueryClientProvider>
  );
}
