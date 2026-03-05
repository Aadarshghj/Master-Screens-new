import { useCallback, useState } from "react";
import { logger } from "@/global/service";
export const useAssetTypeTable = () => {

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
  const confirmDeleteRoleManagement = useCallback(() => {
    if (!selectedRoleId) return;
    try {
      selectedRoleId;
      logger.info("AssetType Delete Successfully", { toast: true })
      closeDeleteModal()
    } catch (err) {
      logger.error(err, { toast: true })
    }
  }, [selectedRoleId, closeDeleteModal]);
  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteRoleManagement,
  };
};