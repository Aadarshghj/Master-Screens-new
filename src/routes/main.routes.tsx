import { type RouteObject } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { publicRoutesList } from "./public-list.routes";
import { protectedRoutesList } from "./protected-list.routes";
import { RootRedirect } from "./root-redirect";
import NotFoundPage from "@/pages/not-found";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootRedirect />,
  },
  ...authRoutes,
  ...publicRoutesList,
  ...protectedRoutesList,
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
