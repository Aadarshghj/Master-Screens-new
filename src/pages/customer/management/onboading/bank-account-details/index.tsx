import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { BankAccountDetailsForm } from "./components/Form/BankAccount";
import { BankAccountDetailsTable } from "./components/Table/BankAccount";
import type { BankAccountDetailsPageProps } from "@/types/customer/bank.types";

export const BankAccountDetailsPage: React.FC<
  BankAccountDetailsPageProps & {
    onFormSubmit?: () => void;
  }
> = ({
  customerIdentity,
  onFormSubmit,
  isView = false,
  readOnly = false,
  pendingForApproval = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  return (
    <div className="space-y-6">
      {!readOnly && (
        <ErrorBoundary
          fallback={
            <div className="text-status-error p-4">
              Error loading bank account form
            </div>
          }
        >
          <BankAccountDetailsForm
            customerIdentity={customerIdentity}
            onFormSubmit={onFormSubmit}
            isView={isView}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        </ErrorBoundary>
      )}
      <ErrorBoundary
        fallback={
          <div className="text-status-error p-4">
            Error loading bank account table
          </div>
        }
      >
        <BankAccountDetailsTable
          isView={isView}
          customerIdentity={customerIdentity}
          readOnly={readOnly}
          pendingForApproval={pendingForApproval}
        />
      </ErrorBoundary>
    </div>
  );
};
