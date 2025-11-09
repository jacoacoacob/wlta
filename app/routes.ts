import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route(
    "dashboard",
    "routes/dashboard.tsx",
    [
      index(
        "routes/dashboard.index.tsx"
      ),
      route(
        "categories",
        "routes/dashboard-categories.tsx",
        [
          index("routes/dashboard-categories.index.tsx"),
          route(
            "create",
            "routes/dashboard-categories-create.tsx",
          ),
          route(
            ":categoryId",
            "routes/dashboard-categories-detail.tsx",
          ),
          route(
            ":categoryId/edit",
            "routes/dashboard-categories-edit.tsx",
          ),
        ]
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
