import { getItemFromStorage } from "@/utils";
import React from "react";
import { useLocation } from "react-router-dom";

export function withAuthRedirection<P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> {
  const ComponentWithAuthRedirection: React.FC<P> = props => {
    const location = useLocation();

    const session = getItemFromStorage<string>({
      key: "access_token",
      type: "session",
    });

    if (location.pathname === "/") {
      // If accessed login route with session then re-direct to protected route home page
      if (session) {
        window.location.href = "/customer/management/onboarding";

        return null;
      }
    } else {
      // If accessed protected route without session then re-direct to login page
      if (!session) {
        window.location.href = "/";

        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithAuthRedirection;
}
