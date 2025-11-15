import { Link, NavLink, useMatches } from "react-router";
import { isBreadcrumbHandle, type Breadcrumb, type BreadcrumbHandle } from "~/utils/breadcrumb";

export const DashboardBreadcrumbs: React.FC = () => {
  const matches = useMatches();

  const breadcrumbs = matches.reduce<ReturnType<Breadcrumb>[]>(
    (accum, match) => {
      if (isBreadcrumbHandle(match.handle)) {

        if (Array.isArray(match.handle.breadcrumb)) {
          return accum.concat(
            match.handle.breadcrumb.map((breadcrumb) => breadcrumb(match))
          );
        }

        return accum.concat(
          match.handle.breadcrumb(match)
        );
      }

      return accum;
    },
    []
  );

  return (
    <nav>
      <ul className="flex gap-2">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        {breadcrumbs.map(({ name, to }, index, arr) =>
          <li className="flex gap-2">
            <span>/</span>
            <NavLink
              to={to}
              className={() => index === arr.length - 1 ? "font-semibold" : ""}
            >
              {name}
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  )
}