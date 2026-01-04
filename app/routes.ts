import { type RouteConfig, index, layout, route, prefix } from "@react-router/dev/routes";

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
      ),
      route(
        "tags",
        "routes/dashboard-tags.tsx",
        [
          index("routes/dashboard-tags.index.tsx"),
          route(
            "create",
            "routes/dashboard-tags.create.tsx",
          ),
          route(
            ":tagId",
            "routes/dashboard-tags-detail.tsx",
          ),
          route(
            ":tagId/edit",
            "routes/dashboard-tags-edit.tsx",
          ),
        ],
      ),
      route(
        "activities",
        "routes/dashboard-activities.tsx",
        [
          index("routes/dashboard-activities.index.tsx"),
          route(
            "create",
            "routes/dashboard-activities.create.tsx"
          ),
          route(
            ":activityId",
            "routes/dashboard-activities.detail.tsx"
          ),

        ]
      )
    ]
  ),
  ...prefix(
    "api",
    [
      route("tags-categories", "routes/api-tags-categories.ts"),
      route("tags/search", "routes/api-tags.search.ts"),
      route("tags/create", "routes/api-tags.create.ts"),
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
