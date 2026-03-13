import { useCallback, useState } from "react";
import type {LoanSchemeTypeType} from "@/types/customer-management/loan-scheme-type"
import { logger } from "@/global/service";
import { useDeleteLoanSchemeTypeMutation, useGetMasterLoanSchemeTypeQuery } from "@/global/service/end-points/customer-management/loan-scheme-type";

export const useLoanSchemeTypeTable  = () => {

const { data = [], isFetching } =
  useGetMasterLoanSchemeTypeQuery();
    const [deleteLoanSchemeType] = useDeleteLoanSchemeTypeMutation();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLoanSchemeTypeCode, setSelectedLoanSchemeTypeCode] = useState<
    string | null
  >(null);
  
  const openDeleteModal = useCallback((loanSchemeTypeCode: string) => {
    setSelectedLoanSchemeTypeCode(loanSchemeTypeCode);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setSelectedLoanSchemeTypeCode(null);
    setShowDeleteModal(false);
  }, []);

  const confirmDeleteLoanSchemeType = useCallback(async () => {
    if (!selectedLoanSchemeTypeCode) return;

    try {
      await deleteLoanSchemeType(selectedLoanSchemeTypeCode).unwrap();
      logger.info("Deleted successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [deleteLoanSchemeType, selectedLoanSchemeTypeCode, closeDeleteModal]);
  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteLoanSchemeType,
  };
};

