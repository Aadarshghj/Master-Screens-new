import { useCallback, useState } from "react";
import {
  useDeleteRiskCategoryMutation,
  useGetMasterRiskCategoriesQuery,
} from "@/global/service/end-points/customer-management/risk-categories";
import { logger } from "@/global/service";

export const useRiskCategoryTable = () => {
  const { data = [], isFetching } = useGetMasterRiskCategoriesQuery();
  const [deleteRiskCategory] = useDeleteRiskCategoryMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRiskCategoryId, setSelectedRiskCategoryId] = useState<
    string | null
  >(null);

  const openDeleteModal = useCallback((riskCategoryId: string) => {
    setSelectedRiskCategoryId(riskCategoryId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedRiskCategoryId(null);
  }, []);

  const confirmDeleteRiskCategory = useCallback(async () => {
    if (!selectedRiskCategoryId) return;

    try {
      await deleteRiskCategory(selectedRiskCategoryId).unwrap();
      logger.info("Risk Category deleted successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [deleteRiskCategory, selectedRiskCategoryId, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteRiskCategory,
  };
};
