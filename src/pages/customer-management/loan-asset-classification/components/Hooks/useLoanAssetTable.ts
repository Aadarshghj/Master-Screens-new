import { logger } from "@/global/service";
import { useCallback, useState } from "react";

export const useLoanAssetClassificationTable = () => {

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
      logger.info("Asset Classification Deleted",{toast :true})
      closeDeleteModal();
    }catch(err){
      logger.error(err,{toast:true});
    }
 }, [selectRiskId, closeDeleteModal]);

    
  return {
    // data,
    // isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleConfirmDelete,
  };
};