import { usePuterStore } from "~/lib/puter";

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': any;
    }
  }
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { init } = usePuterStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-dark-100 text-white min-h-screen relative overflow-x-hidden">
        <script src="https://js.puter.com/v2/"></script>
        
        {/* MOBILE: Particles — full screen background, no robot */}
        <div className="lg:hidden fixed inset-0 w-full h-full z-0 pointer-events-none">
          <iframe 
            src="https://my.spline.design/particles-2v7aUJ4K5nvf6nWYKTcJSFB5/"
            frameBorder="0" 
            width="100%" 
            height="100%" 
            className="w-full h-full"
            title="Spline Particles Background"
          ></iframe>
        </div>

        {/* DESKTOP: Particles — subtle full-screen glow behind everything */}
        <div className="hidden lg:block fixed inset-0 w-full h-full z-0 pointer-events-none opacity-40">
          <iframe 
            src="https://my.spline.design/particles-2v7aUJ4K5nvf6nWYKTcJSFB5/"
            frameBorder="0" 
            width="100%" 
            height="100%" 
            className="w-full h-full"
            title="Spline Particles Background Desktop"
          ></iframe>
        </div>

        {/* DESKTOP: Robot model — right half only, interactive, sits above particles */}
        <div className="hidden lg:block fixed top-0 right-0 w-1/2 h-full z-10 pointer-events-auto">
          <iframe 
            src="https://my.spline.design/genkubgreetingrobot-8QFelylfHmALpFyCRecHDJBp/" 
            frameBorder="0" 
            width="100%" 
            height="100%" 
            className="w-full h-full"
            title="Spline 3D Robot"
            allowFullScreen
          ></iframe>
        </div>

        {/* Main Content — sits on top */}
        <div className="relative z-20 min-h-screen">
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
