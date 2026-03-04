import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { NomineeForm } from "./components/Form/Nominee";
import { NomineeTable } from "./components/Table/Nominee";
import { useGetNomineesQuery } from "@/global/service";
import type { NomineeData, NomineePageProps } from "@/types";

export const NomineePage: React.FC<
  NomineePageProps & {
    onFormSubmit?: () => void;
    onUnsavedChanges?: (hasChanges: boolean) => void;
  }
> = ({
  customerIdentity,
  onFormSubmit,
  onUnsavedChanges,
  isView = false,
  readOnly = false,
  pendingForApproval = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const [editingNominee, setEditingNominee] = useState<NomineeData | null>(
    null
  );

  // Get existing nominees to pass to form for duplicate validation
  const { data: existingNominees = [] } = useGetNomineesQuery(
    customerIdentity!
  );
  const formRef = React.useRef<HTMLDivElement | null>(null);

  const handleEditNominee = (nominee: NomineeData) => {
    setEditingNominee(nominee);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingNominee(null);
  };

  return (
    <div className="space-y-6" ref={formRef}>
      {!readOnly && (
        <ErrorBoundary
          fallback={
            <div className="text-status-error p-4">
              Error loading nominee form
            </div>
          }
        >
          <NomineeForm
            editingNominee={editingNominee}
            onCancelEdit={handleCancelEdit}
            customerIdentity={customerIdentity}
            existingNominees={existingNominees}
            onFormSubmit={onFormSubmit}
            onUnsavedChanges={onUnsavedChanges}
            isView={isView}
            handleSetConfirmationModalData={handleSetConfirmationModalData}
            confirmationModalData={confirmationModalData}
          />
        </ErrorBoundary>
      )}
      <ErrorBoundary
        fallback={
          <div className="text-status-error p-4">
            Error loading nominee table
          </div>
        }
      >
        <NomineeTable
          onEditNominee={handleEditNominee}
          customerIdentity={customerIdentity}
          isView={isView}
          readOnly={readOnly}
          pendingForApproval={pendingForApproval}
          handleSetConfirmationModalData={handleSetConfirmationModalData}
          confirmationModalData={confirmationModalData}
        />
      </ErrorBoundary>
    </div>
  );
};
