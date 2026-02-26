import { ErrorBoundary } from "react-error-boundary";
import { AddressDetailsForm } from "./components/Form/Address";
import type { AddressDetailsProps } from "@/types/customer/address.types";

export function AddressDetails({
  customerIdentity,
  onFormSubmit,
  onUnsavedChanges,
  isView = false,
  readOnly = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}: AddressDetailsProps & {
  onFormSubmit?: () => void;
  onUnsavedChanges?: (hasChanges: boolean) => void;
}) {
  return (
    <div className="address-details-container space-y-6">
      <ErrorBoundary
        fallback={
          <div className="text-status-error p-4">
            Error loading address details form
          </div>
        }
      >
        <AddressDetailsForm
          isView={isView}
          customerIdentity={customerIdentity}
          customerId={customerIdentity || undefined}
          onFormSubmit={onFormSubmit}
          onUnsavedChanges={onUnsavedChanges}
          readOnly={readOnly}
          handleSetConfirmationModalData={handleSetConfirmationModalData}
          confirmationModalData={confirmationModalData}
        />
      </ErrorBoundary>
    </div>
  );
}
