import { useCallback, useState } from "react";
import {
  useDeleteOccupationMutation,
  useGetOccupationsQuery,
} from "@/global/service/end-points/customer-management/occupation";
import { logger } from "@/global/service";

export const useOccupationTable = () => {
  const { data = [], isFetching } = useGetOccupationsQuery();
  const [deleteOccupation] = useDeleteOccupationMutation();
  const { refetch } = useGetOccupationsQuery();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOccupationId, setSelectedOccupationId] = useState<
    string | null
  >(null);

  const openDeleteModal = useCallback((occupationId: string) => {
    setSelectedOccupationId(occupationId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedOccupationId(null);
  }, []);

  const confirmDeleteOccupation = useCallback(async () => {
    if (!selectedOccupationId) return;

    try {
      await deleteOccupation(selectedOccupationId).unwrap();
      logger.info("Occupation Deleted Successfully", { toast: true });
      refetch();
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [refetch, deleteOccupation, selectedOccupationId, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteOccupation,
  };
};
