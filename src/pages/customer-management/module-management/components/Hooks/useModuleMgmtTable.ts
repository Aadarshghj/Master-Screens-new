import { useCallback, useState } from "react";
import { 
  useGetModuleDataQuery, 
  useDeleteModuleMutation 
} from "@/global/service/end-points/customer-management/module-management.api";
import { toast } from "react-hot-toast";

export const useModuleMgmtTable = () => {
  const { data = [], isFetching } = useGetModuleDataQuery();
  const [ deleteModule ] = useDeleteModuleMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const openDeleteModal = useCallback((moduleId: string) => {
    setSelectedModuleId(moduleId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedModuleId(null);
  }, []);

  const confirmDeleteModule = useCallback(async() => {
    if (!selectedModuleId) return;
    try {
          const res = await deleteModule(selectedModuleId).unwrap();
          toast.success(res?.message ?? "Module deleted successfully");
          closeDeleteModal();
          console.log(res);
    } catch (err:any) {
          toast.error(err?.data?.message ?? "Failed to delete Module");
          closeDeleteModal();
        }
}, [ deleteModule, selectedModuleId, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteModule,
  };
};
