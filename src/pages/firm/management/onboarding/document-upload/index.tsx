import React, { useEffect, useState } from "react";
import KYCDocumentForm from "./components/Form/KYCDocument";
import KYCDocumentsTable from "./components/Table/KYCDocument";
import FirmPhotoUpload from "./components/Form/Firm-Photo-Upload";
import { useGetKycDocumentsQuery } from "@/global/service/end-points/master/firm-master";
import {
  setCurrentStepSaved,
  setFirmOnboardState,
} from "@/global/reducers/firm/firmOnboarding.reducer";
import { useAppDispatch } from "@/hooks/store";

interface DocumentUploadPageProps {
  firmIdentity?: string;
  customerId?: string;
  onFormSubmit?: () => void;
  onSaveSuccess?: () => void;
  readonly?: boolean;
}

export const DocumentUploadPage: React.FC<DocumentUploadPageProps> = ({
  firmIdentity,
  customerId,
  onFormSubmit,
  readonly = false,
}) => {
  const dispatch = useAppDispatch();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: documents = [], refetch } = useGetKycDocumentsQuery(
    customerId || "",
    {
      skip: !customerId,
    }
  );

  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  useEffect(() => {
    const hasDocument = Array.isArray(documents) && documents.length > 0;

    if (!hasDocument) {
      dispatch(setCurrentStepSaved(false));
      dispatch(
        setFirmOnboardState({
          disableNext: true,
          title: "Document Required",
          disableReason:
            "Please upload at least one KYC document before sending for approval.",
          currentPath: "/firm/management/onboarding/document-upload",
        })
      );
    } else {
      dispatch(setCurrentStepSaved(true));
      dispatch(
        setFirmOnboardState({
          disableNext: false,
          title: null,
          disableReason: null,
          currentPath: "/firm/management/onboarding/document-upload",
        })
      );
    }
  }, [documents, dispatch]);

  const handleDocumentUploaded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {!readonly && (
        <KYCDocumentForm
          firmIdentity={firmIdentity}
          customerId={customerId}
          onFormSubmit={onFormSubmit}
          onDocumentUploaded={handleDocumentUploaded}
        />
      )}

      <KYCDocumentsTable
        customerId={customerId}
        refreshTrigger={refreshTrigger}
      />

      {customerId && (
        <FirmPhotoUpload customerId={customerId} readonly={readonly} />
      )}
    </div>
  );
};
