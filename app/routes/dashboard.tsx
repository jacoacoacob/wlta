import { authServerMiddleware } from "~/middleware/auth.middleware";
import { NavLink, Outlet } from "react-router";
import type { Route } from "./+types/dashboard";
import { GlobalHeader } from "~/features/GlobalHeader";
import { deriveIsLoggedIn } from "~/utils";
import { ProfileMenu } from "~/features/ProfileMenu";
import { DashboardBreadcrumbs } from "~/features/DashboardBreadcrumbs";
import { cn } from "~/utils/cn";
import { DASHBOARD_LEFT_MENU_LINKS } from "~/constants";

export const middleware: Route.MiddlewareFunction[] = [
  authServerMiddleware,
];

export async function loader({ context }: Route.ClientLoaderArgs) {
  return {
    isLoggedIn: deriveIsLoggedIn(context),
  }
}

const BREADCRUMBS_POSITIONS = {
  header: "header",
  outlet: "outlet",
}

const BREADCRUMBS_POSITION = BREADCRUMBS_POSITIONS.outlet;

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { isLoggedIn } = loaderData;

  return (
    <div className="h-dvh">
      <GlobalHeader
        rightNavContent={
          <div>
            <ProfileMenu isLoggedIn={isLoggedIn} />
          </div>
        }
      />
      {BREADCRUMBS_POSITION === BREADCRUMBS_POSITIONS.header && (
        <header className="flex justify-between p-4 sticky top-0">
          <DashboardBreadcrumbs />
        </header>
      )}
      <div className="flex p-4 h-full gap-4">
        <section className="min-w-3xs">
          <div className="flex flex-col items-center gap-4">
            {DASHBOARD_LEFT_MENU_LINKS.map(({ to, text }) =>
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => cn("py-2 px-4 border rounded self-stretch flex-1", isActive && "bg-slate-50/15")}
              >
                <h2 className="font-bold text-lg">{text}</h2>
              </NavLink>
            )}
          </div>
        </section>

        {BREADCRUMBS_POSITION === BREADCRUMBS_POSITIONS.outlet ? (
          <main className="px-8 py-4 max-w-3xl flex-1 border border-slate-400 rounded">
            <DashboardBreadcrumbs />
            <div className="py-4">
              <Outlet />
            </div>
          </main>
        ) : (
          <main className="p-8 max-w-3xl flex-1 border border-slate-400 rounded">
            <Outlet />
          </main>
        )}
      </div>
    </div>
  );
}
