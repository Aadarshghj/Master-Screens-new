import DigilockerCallback from "@/pages/digilocker/DigilockerCallback";
import LandingPage from "@/pages/landing-page";
import type { RouteObject } from "react-router-dom";

export const publicRoutesList: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/digilocker/callback",
    element: <DigilockerCallback />,
  },
];
