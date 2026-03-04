import { useCallback, useState } from "react";
import {
  useDeleteDesignationMutation,
  useGetMasterDesignationsQuery,
} from "@/global/service/end-points/customer-management/designation";
import { logger } from "@/global/service";

export const useDesignationTable = () => {
  const { data = [], isFetching } = useGetMasterDesignationsQuery();
  const [deleteDesignation] = useDeleteDesignationMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDesignationCode, setSelectedDesignationCode] = useState<
    string | null
  >(null);

  const openDeleteModal = useCallback((designationCode: string) => {
    setSelectedDesignationCode(designationCode);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedDesignationCode(null);
  }, []);

  const confirmDeleteDesignation = useCallback(async () => {
    if (!selectedDesignationCode) return;

    try {
      await deleteDesignation(selectedDesignationCode).unwrap();
      logger.info("Designation deleted successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [deleteDesignation, selectedDesignationCode, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteDesignation,
  };
};
