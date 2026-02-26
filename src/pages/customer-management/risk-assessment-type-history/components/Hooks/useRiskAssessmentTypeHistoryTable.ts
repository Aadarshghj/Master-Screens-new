import { logger } from "@/global/service";
import { useDeleteRiskAssessmentTypeMutation, useGetMasterRiskAssessmentTypeQuery } from "@/global/service/end-points/customer-management/risk-assessment-type";
//import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useCallback, useState } from "react";

export const useRiskAssessmentTypeHistoryTable = () => {
const [deleteRiskAssessmentType] = useDeleteRiskAssessmentTypeMutation();
const {data =[],isFetching} = useGetMasterRiskAssessmentTypeQuery();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectRiskId, setSelectRiskId] = useState<string | null>(null);

  const openDeleteModal = useCallback((riskId: string) => {
    setSelectRiskId(riskId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectRiskId(null);
  }, []);

  const handleConfirmDelete = useCallback(async()=>{
    if (!selectRiskId) return;
    try{
      await deleteRiskAssessmentType(selectRiskId).unwrap();
      logger.info("Risk Assessment Type Deleted",{toast :true})
      closeDeleteModal();
    }catch(err){
      logger.error(err,{toast:true});
    }
 }, [selectRiskId, deleteRiskAssessmentType, closeDeleteModal]);

    
  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
  };
};