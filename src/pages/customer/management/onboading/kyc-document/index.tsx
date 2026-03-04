import React from "react";
import { DocumentsTable } from "./components/Table/Kyc";
import { KycForm } from "./components/Form/Kyc";
import type { KYCPageProps } from "@/types/customer/kyc.types";
import { useGetKycQuery } from "@/global/service";
import { useAppSelector } from "@/hooks/store";

export const KYCPage: React.FC<
  KYCPageProps & { onFormSubmit?: () => void; isView?: boolean }
> = ({
  customerIdentity,
  onFormSubmit,
  isView = false,
  readOnly,
  customerCreationMode,
  handleSetConfirmationModalData,
  confirmationModalData,
}) => {
  const customerIdentityView = useAppSelector(
    state => state.customerIdentityView?.identity
  );
  const customerIdentityEdit = useAppSelector(
    state => state.customerIdentity?.identity
  );
  const viewCustomerId = customerIdentity ?? customerIdentityView;
  const editCustomerId = customerIdentity ?? customerIdentityEdit;
  const { data: kycDataEdit } = useGetKycQuery(editCustomerId || "", {
    skip: !editCustomerId || isView,
  });
  const { data: kycDataView } = useGetKycQuery(viewCustomerId || "", {
    skip: !viewCustomerId || !isView,
  });
  const kycDocuments = isView
    ? kycDataView?.kycDocuments
    : kycDataEdit?.kycDocuments;

  return (
    <div className="">
      {!readOnly && (
        <KycForm
          customerIdentity={customerIdentity}
          onFormSubmit={onFormSubmit}
          isView={isView}
          readOnly={readOnly}
          customerCreationMode={customerCreationMode}
          tableData={kycDocuments ?? []}
          handleSetConfirmationModalData={handleSetConfirmationModalData}
          confirmationModalData={confirmationModalData}
        />
      )}
      <DocumentsTable
        customerIdentity={customerIdentity}
        isView={isView}
        readOnly={readOnly}
      />
    </div>
  );
};
