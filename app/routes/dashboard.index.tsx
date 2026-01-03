import { NavLink } from "react-router";

const links = [
  {
    to: "/dashboard/categories",
    text: "Categories",
  },
  {
    to: "/dashboard/tags",
    text: "Tags",
  }
] as const;

export default function DashboardIndex() {
  return (
    <div className="flex flex-col items-center gap-8">
      {links.map(({ to, text }) =>
        <NavLink key={to} to={to} className="p-4 border rounded self-stretch flex-1">
          <h2 className="font-bold text-lg">{text}</h2>
        </NavLink>
      )}
    </div>
  )
}