import { logger } from "@/global/service";
import { useDeleteLoanAssetClassiMutation, useGetLoanAssetClassiQuery } from "@/global/service/end-points/customer-management/loan-asset-classification";
import { useCallback, useState } from "react";

export const useLoanAssetClassificationTable = () => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectRiskId, setSelectRiskId] = useState<string | null>(null);
  const [deleteLoanAssetClassi] = useDeleteLoanAssetClassiMutation();
  const {data =[],isFetching} = useGetLoanAssetClassiQuery();

  const openDeleteModal = useCallback((assetId: string) => {
    setSelectRiskId(assetId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectRiskId(null);
  }, []);

  const handleConfirmDelete = useCallback(async()=>{
    if (!selectRiskId) return;
    try{
      await deleteLoanAssetClassi(selectRiskId).unwrap();
      logger.info("Asset Classification Deleted",{toast :true})
      closeDeleteModal();
    }catch(err){
      logger.error(err,{toast:true});
    }
 }, [selectRiskId, closeDeleteModal,deleteLoanAssetClassi]);

    
  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
  };
};