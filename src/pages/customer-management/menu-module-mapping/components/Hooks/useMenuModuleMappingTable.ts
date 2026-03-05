import { useState, useCallback } from "react";
import {
  useDeleteMenuModuleMappingMutation,
  useGetMasterMenuModuleMappingQuery,
} from "@/global/service/end-points/customer-management/menu-module-mapping";
import { logger } from "@/global/service";

export const useMenuModuleMappingTable = () => {
const { data = [], isFetching } =
  useGetMasterMenuModuleMappingQuery();
    const [deleteMenuModuleMapping] = useDeleteMenuModuleMappingMutation();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMenuModuleMappingCode, setSelectedMenuModuleMappingCode] = useState<
    string | null
  >(null);
  
  const openDeleteModal = useCallback((menuModuleMappingCode: string) => {
    setSelectedMenuModuleMappingCode(menuModuleMappingCode);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setSelectedMenuModuleMappingCode(null);
    setShowDeleteModal(false);
  }, []);

  const confirmDeleteMenuModuleMapping = useCallback(async () => {
    if (!selectedMenuModuleMappingCode) return;

    try {
      await deleteMenuModuleMapping(selectedMenuModuleMappingCode).unwrap();
      logger.info("Deleted successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [deleteMenuModuleMapping, selectedMenuModuleMappingCode, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteMenuModuleMapping,
  };
};