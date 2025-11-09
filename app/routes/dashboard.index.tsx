import { NavLink } from "react-router";

export default function DashboardIndex() {
  return (
    <div>
      <div>This is your dashboard</div>
      <NavLink to="/dashboard/categories">Categories</NavLink>
    </div>
  )
}