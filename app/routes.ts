import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(
    "dashboard",
    "routes/dashboard.tsx",
    [
      index(
        "routes/dashboard.home.tsx"
      ),
      route(
        "search",
        "routes/dashboard.search.tsx"
      )
    ]
  ),
  layout(
    "routes/auth/auth.layout.tsx",
    [
      route("login",         "routes/auth/login.tsx"),
      route("logout",        "routes/auth/logout.tsx"),
      route("auth/confirm",  "routes/auth/confirm.tsx"),
    ]
  ),
] satisfies RouteConfig;
