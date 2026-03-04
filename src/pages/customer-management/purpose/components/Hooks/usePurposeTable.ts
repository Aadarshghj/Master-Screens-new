import { useCallback, useState } from "react";
import {
  useDeletePurposeMutation,
  useGetPurposesQuery,
} from "@/global/service/end-points/customer-management/purpose";
import { logger } from "@/global/service";

export const usePurposeTable = () => {
  const { data = [], isFetching } = useGetPurposesQuery();
  const [deletePurpose] = useDeletePurposeMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPurposeId, setSelectedPurposeId] = useState<string | null>(
    null
  );

  const openDeleteModal = useCallback((purposeId: string) => {
    setSelectedPurposeId(purposeId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedPurposeId(null);
  }, []);

  const confirmDeletePurpose = useCallback(async () => {
    if (!selectedPurposeId) return;

    try {
      await deletePurpose(selectedPurposeId).unwrap();
      logger.info("Purpose Deleted Successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [deletePurpose, selectedPurposeId, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeletePurpose,
  };
};
