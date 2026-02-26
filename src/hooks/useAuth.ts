import { useEffect, useState } from "react";
import { isAuthenticated, logout as logoutUser } from "@/utils/token.utils";

export function useAuth() {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setAuthStatus(authenticated);
      setIsLoading(false);
    };

    // Initial check
    checkAuth();

    // Listen for storage changes (logout from other tabs)
    const handleStorageChange = (event: StorageEvent) => {
      // Only react to logout events or token changes
      if (
        event.key === "logout" ||
        event.key === "access_token" ||
        event.key === "refresh_token" ||
        event.key === "token_expires_at"
      ) {
        checkAuth();
      }
    };

    // Listen for custom logout events
    const handleLogout = () => {
      checkAuth();
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("logout", handleLogout);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("logout", handleLogout);
    };
  }, []);

  const logout = () => {
    logoutUser();
  };

  return {
    isAuthenticated: authStatus,
    isLoading,
    logout,
  };
}
