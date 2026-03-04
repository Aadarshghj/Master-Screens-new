import { useState, useEffect } from "react";
import { clearCustomerIdentity } from "@/global/reducers/customer/customer-identity.reducer";
import { clearForm60Identity } from "@/global/reducers/customer/form60-identity.reducer";
import { useAppDispatch } from "./store";
import { clearViewCustomerIdentity } from "@/global/reducers/customer/customer-identity-view.reducer";

export const useRefreshConfirmation = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if we have customer data and show confirmation immediately
    const checkForCustomerData = () => {
      const customerIdentity = sessionStorage.getItem("customerIdentity");
      const form60Identity = sessionStorage.getItem("form60Identity");

      if (customerIdentity || form60Identity) {
        setShowConfirmation(true);
      }
    };

    // Check immediately when component mounts
    checkForCustomerData();

    // Set up refresh detection using performance API
    const handleBeforeUnload = () => {
      const customerIdentity = sessionStorage.getItem("customerIdentity");
      const form60Identity = sessionStorage.getItem("form60Identity");

      if (customerIdentity || form60Identity) {
        // Set a flag in session storage to detect refresh
        sessionStorage.setItem("_refreshDetected", "true");
      }
    };

    // Check if this is a refresh after page load
    const checkForRefresh = () => {
      const isRefresh = sessionStorage.getItem("_refreshDetected");
      const customerIdentity = sessionStorage.getItem("customerIdentity");
      const form60Identity = sessionStorage.getItem("form60Identity");

      if (isRefresh && (customerIdentity || form60Identity)) {
        setShowConfirmation(true);
        sessionStorage.removeItem("_refreshDetected");
      }
    };

    // Check for refresh after a short delay to ensure page is loaded
    const timeoutId = setTimeout(checkForRefresh, 100);

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleConfirmRefresh = () => {
    // Clear customer identity and form data from session storage
    sessionStorage.removeItem("customerIdentity");
    sessionStorage.removeItem("form60Identity");
    sessionStorage.removeItem("panSubmitted");
    sessionStorage.removeItem("aadhaarSubmitted");

    // Clear Redux stores
    dispatch(clearCustomerIdentity());
    dispatch(clearViewCustomerIdentity());
    dispatch(clearForm60Identity());

    // Allow the refresh to proceed
    setShowConfirmation(false);

    // Force refresh after a short delay to ensure state is cleared
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleCancelRefresh = () => {
    setShowConfirmation(false);
  };

  return {
    showConfirmation,
    handleConfirmRefresh,
    handleCancelRefresh,
  };
};
