import { useCallback, useState } from "react";
import {
  useDeleteLeadSourceMutation,
  useGetMasterLeadSourcesQuery,
} from "@/global/service/end-points/customer-management/lead-sources";
import { logger } from "@/global/service";

export const useLeadSourceTable = () => {
  const { data = [], isFetching } = useGetMasterLeadSourcesQuery();
  const [deleteLeadSource] = useDeleteLeadSourceMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeadSourceId, setSelectedLeadSourceId] = useState<
    string | null
  >(null);

  const openDeleteModal = useCallback((leadSourceId: string) => {
    setSelectedLeadSourceId(leadSourceId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedLeadSourceId(null);
  }, []);

  const confirmDeleteLeadSource = useCallback(async () => {
    if (!selectedLeadSourceId) return;

    try {
      await deleteLeadSource(selectedLeadSourceId).unwrap();
      logger.info("Lead Source deleted successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [deleteLeadSource, selectedLeadSourceId, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteLeadSource,
  };
};
