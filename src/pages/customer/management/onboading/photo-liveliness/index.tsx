import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PhotoLivelinessForm } from "./components/Form/PhotoLiveliness";
import { PhotoDocumentsTable } from "./components/Table/PhotoLiveliness";
import type {
  PhotoLivelinessPageProps,
  PhotoLivelinessFormData,
} from "@/types/customer/photo.types";

export const PhotoLivelinessPage: React.FC<
  PhotoLivelinessPageProps & {
    onFormSubmit?: (data?: PhotoLivelinessFormData) => Promise<void>;
  }
> = ({
  customerIdentity,
  onFormSubmit,
  isView = false,
  readOnly = false,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  return (
    <div className="space-y-4">
      {!readOnly && (
        <PhotoLivelinessForm
          customerIdentity={customerIdentity}
          onFormSubmit={onFormSubmit}
          isView={isView}
          readOnly={readOnly}
          handleSetConfirmationModalData={handleSetConfirmationModalData}
          confirmationModalData={confirmationModalData}
        />
      )}

      <ErrorBoundary
        fallback={
          <div className="text-status-error p-4">
            Error loading photo documents table
          </div>
        }
      >
        <PhotoDocumentsTable
          isView={isView}
          customerIdentity={customerIdentity}
          readOnly={readOnly}
        />
      </ErrorBoundary>
    </div>
  );
};
