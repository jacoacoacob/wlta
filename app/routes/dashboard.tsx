import { authServerMiddleware } from "~/middleware/auth.middleware";
import { Outlet } from "react-router";
import type { Route } from "./+types/dashboard";
import { GlobalHeader } from "~/features/GlobalHeader";
import { deriveIsLoggedIn } from "~/utils";
import { ProfileMenu } from "~/features/ProfileMenu";
import { DashboardBreadcrumbs } from "~/features/DashboardBreadcrumbs";

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
      <GlobalHeader
        rightNavContent={
          <div>
            <ProfileMenu isLoggedIn={isLoggedIn} />
          </div>
        }
      />
      <header className="flex justify-between p-4 sticky top-0">
        <DashboardBreadcrumbs />
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
