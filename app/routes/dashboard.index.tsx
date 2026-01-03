import { NavLink } from "react-router";
import { DASHBOARD_PAGES } from "~/constants";

export default function DashboardIndex() {
  return (
    <div className="flex flex-col items-center gap-8">
      {DASHBOARD_PAGES.map(({ to, text }) =>
        <NavLink key={to} to={to} className="p-4 border rounded self-stretch flex-1">
          <h2 className="font-bold text-lg">{text}</h2>
        </NavLink>
      )}
    </div>
  )
}