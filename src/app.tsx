import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import AppVersion from "./components/ui/app-version/app-version";

export default function App() {
  const router = createBrowserRouter(routes);
  return (
    <div>
      <RouterProvider router={router} />
      <AppVersion />
    </div>
  );
}
