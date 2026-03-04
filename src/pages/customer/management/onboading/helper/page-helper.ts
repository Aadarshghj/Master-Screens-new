export const getStepFromUrl = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if (lastSegment === "onboarding") {
    return "kyc-document";
  }

  return lastSegment;
};

export const getStepLabel = (stepKey: string): string => {
  const stepLabels: Record<string, string> = {
    "basic-information": "Basic Information",
    "photo-liveness": "Photo Liveliness",
    "address-details": "Address Details",
    "additional-opt-details": "Additional Details",
    "nominee-details": "Nominee Details",
    "bank-account-details": "Bank Account Details",
    "contact-notification-preferences": "Contact Preferences",
    "kyc-document": "KYC Document",
    form60: "Form 60",
  };
  return stepLabels[stepKey] || stepKey;
};
