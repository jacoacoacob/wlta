export const DASHBOARD_PAGES = [
  {
    to: "/dashboard/activities",
    text: "Activities"
  },
  {
    to: "/dashboard/categories",
    text: "Categories",
  },
  {
    to: "/dashboard/tags",
    text: "Tags",
  }
] as const;

export const DASHBOARD_LEFT_MENU_LINKS = [
  {
    to: "/dashboard",
    text: "Home",
  },
  ...DASHBOARD_PAGES
]