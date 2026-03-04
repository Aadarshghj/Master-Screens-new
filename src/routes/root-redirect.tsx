import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RootRedirect() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-theme-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  // Redirect based on authentication status
  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
}
