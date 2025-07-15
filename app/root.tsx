import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  redirect,
} from "react-router";

import type { Route } from "./+types/root";
import { todoQueries } from "./lib/db";
import "./app.css";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      const title = formData.get("title") as string;
      if (title?.trim()) {
        todoQueries.create.run(title.trim());
      }
      return redirect("/");
    }
    case "toggle": {
      const id = formData.get("id") as string;
      todoQueries.toggleComplete.run(Number(id));
      return redirect("/");
    }
    case "delete": {
      const id = formData.get("id") as string;
      todoQueries.delete.run(Number(id));
      return redirect("/");
    }
    case "update": {
      const id = formData.get("id") as string;
      const title = formData.get("title") as string;
      const completed = formData.get("completed") === "true";
      if (title?.trim()) {
        todoQueries.update.run(title.trim(), completed, Number(id));
      }
      return redirect("/");
    }
    default:
      return data({ error: "Invalid action" }, { status: 400 });
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
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
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
