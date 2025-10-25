import { authServerMiddleware } from "~/middleware/auth.middleware";
import { Link, Outlet } from "react-router";
import type { Route } from "./+types/dashboard";
import { GlobalHeader } from "~/features/GlobalHeader";
import { deriveIsLoggedIn } from "~/utils";

export const middleware: Route.MiddlewareFunction[] = [
  authServerMiddleware,
];

export async function loader({ context }: Route.ClientLoaderArgs) {
  return {
    isLoggedIn: deriveIsLoggedIn(context),
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { isLoggedIn } = loaderData;

  return (
    <div>
      <GlobalHeader isLoggedIn={isLoggedIn} />
      <header className="flex justify-between p-4 sticky top-0">
        <h1>Dashboard</h1>
        <nav>
          <ul className="flex items-center gap-2">
            <li>
              <Link to="/dashboard">Home</Link>
            </li>
            <li>
              <Link to="/dashboard/search">Search</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
