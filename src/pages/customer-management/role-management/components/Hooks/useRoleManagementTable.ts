import { useCallback, useState } from "react";
import { logger } from "@/global/service";
import {
  useDeleteRoleManagementMutation,
  useGetMasterRoleManagementQuery,
} from "@/global/service/end-points/customer-management/role-management";
export const useRoleManagementTable = () => {
  const [deleteRoleManagement] = useDeleteRoleManagementMutation();
  const { data = [], isFetching } = useGetMasterRoleManagementQuery();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const openDeleteModal = useCallback((userId: string) => {
    setSelectedRoleId(userId);
    setShowDeleteModal(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedRoleId(null);
  }, []);
  const confirmDeleteRoleManagement = useCallback(async () => {
    if (!selectedRoleId) return;
    try {
      await deleteRoleManagement(selectedRoleId).unwrap();

      logger.info("Role Delete Successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [selectedRoleId, closeDeleteModal, deleteRoleManagement]);
  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteRoleManagement,
    isFetching,
    data,
  };
};
