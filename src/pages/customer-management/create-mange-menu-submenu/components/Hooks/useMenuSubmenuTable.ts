import { useCallback, useState } from "react";
import { logger } from "@/global/service";
import { useDeleteMenuSubmenuMutation, useGetMasterMenuSubmenuQuery } from "@/global/service/end-points/customer-management/create-update-menu-submenu";

export const useMenuSubmenuTable = () => {
  const [deleteMenuSubmenu] = useDeleteMenuSubmenuMutation();
  const { data = [], isFetching } = useGetMasterMenuSubmenuQuery();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);
  const openDeleteModal = useCallback((userId: string) => {
    setSelectedMenuId(userId);
    setShowDeleteModal(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedMenuId(null);
  }, []);
  const confirmDeleteMenuSubmenu = useCallback(async () => {
    if (!selectedMenuId) return;
    try {
      await deleteMenuSubmenu(selectedMenuId).unwrap();
      logger.info("Menu Delete Succesfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [selectedMenuId, closeDeleteModal, deleteMenuSubmenu]);
  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteMenuSubmenu,
    isFetching,
    data,
  };
};
