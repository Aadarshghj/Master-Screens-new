import { ErrorBoundaryProvider } from "@/components";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="gird min-h-screen place-content-center">
      <ErrorBoundaryProvider>
        <Outlet />
      </ErrorBoundaryProvider>
    </div>
  );
}
