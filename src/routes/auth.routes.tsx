import { AuthLayout } from "@/layout";
import LoginTemplate from "@/pages/auth/login-template";
import type { RouteObject } from "react-router-dom";

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginTemplate />,
      },
    ],
  },
];
