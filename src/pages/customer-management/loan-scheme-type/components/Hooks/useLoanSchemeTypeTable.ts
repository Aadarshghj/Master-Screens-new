import { useCallback } from "react";
import { LOANSCHEMETYPE_SAMPLE_DATA } from "@/mocks/customer-management-master/loan-scheme-type";
import type {LoanSchemeTypeType} from "@/types/customer-management/loan-scheme-type"

export const useLoanSchemeTypeTable  = () => {


    const data = LOANSCHEMETYPE_SAMPLE_DATA;
  const onEdit = useCallback((row: LoanSchemeTypeType) => {
    console.log("Edit clicked:", row);
  }, []);
  const openDeleteModal = useCallback((row: LoanSchemeTypeType) => {
  console.log("Delete clicked:", row);
}, []);
  return {
    data,
     isFetching: false,
    onEdit,
    openDeleteModal,
  };
};

