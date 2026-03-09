import { useCallback, useState } from "react";
import { logger } from "@/global/service";
import {
  useGetMasterRoleManagementQuery,
} from "@/global/service/end-points/customer-management/role-management";
export const useRoleManagementTable = () => {
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

  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    isFetching,
    data,
  };
};
