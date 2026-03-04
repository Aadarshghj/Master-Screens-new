import { useEffect } from "react";

/**
 * DigiLockerCallback Pagee
 *
 * Purpose:
 * - Acts as a redirect landing page for DigiLocker UIStream
 * - Safely closes the popup window after consent completion
 *

 */
const DigilockerCallback = () => {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: "DIGILOCKER_CONSENT_COMPLETED" },
        window.location.origin
      );
      window.close();
    }
  }, []);

  return (
    <div
      style={{
        padding: "16px",
        textAlign: "center",
        fontSize: "14px",
      }}
    >
      Verification completed. You may close this window.
    </div>
  );
};

export default DigilockerCallback;
