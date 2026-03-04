import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AdditionalOptionalForm } from "./components/Form/AdditionalOptional";
import type { AdditionalOptionalFormProps } from "@/types/customer/additional.types";

export const AdditionalOptionalPage: React.FC<
  AdditionalOptionalFormProps & {
    onFormSubmit?: () => void;
  }
> = ({
  customerIdentity,
  onFormSubmit,
  isView = false,
  readOnly,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  return (
    <div className="space-y-6">
      <ErrorBoundary
        fallback={
          <div className="text-status-error p-4">
            Error loading additional optional details form
          </div>
        }
      >
        <AdditionalOptionalForm
          customerIdentity={customerIdentity}
          onFormSubmit={onFormSubmit}
          isView={isView}
          readOnly={readOnly}
          handleSetConfirmationModalData={handleSetConfirmationModalData}
          confirmationModalData={confirmationModalData}
        />
      </ErrorBoundary>
    </div>
  );
};
