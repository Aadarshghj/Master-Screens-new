import React from "react";
import { useAppSelector } from "@/hooks/store";
import { BusinessInformationForm } from "./components/Form/BusinessInformation";

interface FirmBusinessInformationPageProps {
  customerId?: string | null;
  onFormSubmit?: () => void;
  onSaveSuccess?: () => void;
  readonly?: boolean;
}

export const FirmBusinessInformationPage: React.FC<
  FirmBusinessInformationPageProps
> = ({
  customerId: propCustomerId,
  onFormSubmit,
  onSaveSuccess,
  readonly = false,
}) => {
  const firmOnboardingState = useAppSelector(state => state.firmOnboarding);
  const { customerId: reduxCustomerId } = firmOnboardingState;
  const customerId = propCustomerId || reduxCustomerId;

  if (!customerId) {
    return (
      <div className="space-y-6">
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-yellow-800">
            Please complete the firm details step first before proceeding to
            business information.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Debug: customerId = {String(customerId)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BusinessInformationForm
        firmId={customerId}
        onFormSubmit={onFormSubmit}
        onSaveSuccess={onSaveSuccess}
        readonly={readonly}
      />
    </div>
  );
};
