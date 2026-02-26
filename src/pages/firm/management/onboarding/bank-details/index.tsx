import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { setCurrentStepSaved } from "@/global/reducers/firm/firmOnboarding.reducer";
import { BankDetailsForm } from "./components/Form/bank-details";
import { BankDetailsTable } from "./components/Table/bank-details";
import { useGetFirmBankAccountsQuery } from "@/global/service/end-points/Firm/firmDetails";
import type { FirmBankAccountResponse } from "@/global/service/end-points/master/firm-master";
import { useFirmOnboardState } from "@/hooks/useFirmOnboardState";

interface BankDetailsPageProps {
  firmIdentity?: string;
  customerId?: string | null;
  onFormSubmit?: () => void;
  onSaveSuccess?: () => void;
  readonly?: boolean;
}

export const BankDetailsPage: React.FC<BankDetailsPageProps> = ({
  firmIdentity,
  customerId: propCustomerId,
  onFormSubmit: propOnFormSubmit,
  readonly = false,
}) => {
  const dispatch = useAppDispatch();
  const { firmId } = useParams<{ firmId: string }>();
  const { customerId: reduxCustomerId } = useAppSelector(
    state => state.firmOnboarding
  );
  const customerId = propCustomerId || reduxCustomerId;
  const actualFirmId = firmId || firmIdentity || customerId;
  const { handleUpdateState, handleResetState } = useFirmOnboardState();

  // Validate customer ID is UUID format
  const isValidUUID = (id: string) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  // Use the actual firm ID from Redux state
  const validFirmId =
    actualFirmId && isValidUUID(actualFirmId) ? actualFirmId : null;
  const handleFormSubmit = () => {
    propOnFormSubmit?.();
  };

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetFirmBankAccountsQuery(validFirmId || "", {
    skip: !validFirmId,
    refetchOnMountOrArgChange: true,
  });

  // Force refetch when firmId changes to null (after reset)
  useEffect(() => {
    if (!validFirmId) {
      refetch();
    }
  }, [validFirmId, refetch]);

  interface BankAccountWithPrimary extends FirmBankAccountResponse {
    isPrimary?: boolean;
  }

  const bankAccounts: BankAccountWithPrimary[] = useMemo(() => {
    if (Array.isArray(response)) {
      return response;
    }
    if (
      response &&
      typeof response === "object" &&
      "bankAccounts" in response
    ) {
      return (
        (response as { bankAccounts: BankAccountWithPrimary[] }).bankAccounts ||
        []
      );
    }
    if (response && typeof response === "object" && "data" in response) {
      return (response as { data: BankAccountWithPrimary[] }).data || [];
    }
    return [];
  }, [response]);

  useEffect(() => {
    const hasPrimary = bankAccounts.some(acc => acc.isPrimary === true);

    if (!hasPrimary) {
      handleUpdateState(
        "Incomplete Step",
        "Please Add and Save at least One Primary Bank account before continuing."
      );
      dispatch(setCurrentStepSaved(false));
    } else {
      handleResetState();
      dispatch(setCurrentStepSaved(true));
    }
  }, [bankAccounts, handleUpdateState, handleResetState, dispatch]);

  if (isLoading) {
    return <div>Loading bank accounts...</div>;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <BankDetailsForm onFormSubmit={handleFormSubmit} />
        <BankDetailsTable data={[]} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BankDetailsForm
        onFormSubmit={handleFormSubmit}
        hasExistingAccounts={bankAccounts.length > 0}
        readonly={readonly}
      />
      <BankDetailsTable data={bankAccounts} />
    </div>
  );
};
