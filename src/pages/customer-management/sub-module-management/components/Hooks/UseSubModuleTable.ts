import { useCallback, useState } from "react";
import { logger } from "@/global/service";
import type { SubModule } from "@/types/customer-management/sub-module-management-type";


import {
  useGetMasterSubModulesQuery,
  useDeleteSubModuleMutation,
} from "../../../../../global/service/end-points/customer-management/sub-module"; // Update path if needed

export const useSubModuleTable = (onEdit: (subModule: SubModule) => void) => {

  const { data = [], isLoading, isFetching } = useGetMasterSubModulesQuery();
  
  const [deleteSubModule, { isLoading: isDeleting }] = useDeleteSubModuleMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubModuleId, setSelectedSubModuleId] = useState<string | null>(null);

  const openDeleteModal = useCallback((id: string) => {
    setSelectedSubModuleId(id);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedSubModuleId(null);
  }, []);

  const confirmDeleteSubModule = useCallback(async () => {
    if (!selectedSubModuleId) return;

    try {
      await deleteSubModule(selectedSubModuleId).unwrap();
      
      logger.info("Sub Module deleted successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [selectedSubModuleId, deleteSubModule, closeDeleteModal]);

  return {
    data,
    isLoading: isLoading || isFetching,
    isDeleting,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteSubModule,
    onEdit,
  };
};