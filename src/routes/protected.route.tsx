import { MainLayout } from "@/layout/MainLayout";
import { useEffect, type PropsWithChildren } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { scheduleTokenRefresh } from "@/utils";

export type ProtectedRoutesProps = PropsWithChildren & {
  allowedRoles?: string[];
  isLayoutHidden?: boolean;
};

export function ProtectedRoutes({
  // allowedRoles,
  children,
  isLayoutHidden = false,
}: ProtectedRoutesProps) {
  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      scheduleTokenRefresh();
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-theme-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Add role-based access control when needed
  // if (allowedRoles && allowedRoles.length > 0) {
  //   const userRole = getUserRole(); // Implement this function
  //   if (!allowedRoles.includes(userRole)) {
  //     return <div>Permission denied</div>;
  //   }
  // }

  return (
    <MainLayout isLayoutHidden={isLayoutHidden}>
      {children ? children : <Outlet />}
    </MainLayout>
  );
}
