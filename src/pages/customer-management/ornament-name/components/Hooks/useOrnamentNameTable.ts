import { useCallback, useState } from "react";
import { 
  useGetOrnamentNameQuery, 
  useDeleteOrnamentNameMutation 
} from "@/global/service/end-points/customer-management/ornament-name.api";
import { toast } from "react-hot-toast";

export const useOrnamentNameTable = () => {
  const { data = [], isFetching } = useGetOrnamentNameQuery();
  const [ deleteOrnamentName ] = useDeleteOrnamentNameMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrnamentId, setSelectedOrnamentId] = useState<string | null>(null);

  const openDeleteModal = useCallback((ornamentId: string) => {
    setSelectedOrnamentId(ornamentId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedOrnamentId(null);
  }, []);

  const confirmDeleteOrnamentName = useCallback(async() => {
    if (!selectedOrnamentId) return;
    try {
          const res = await deleteOrnamentName(selectedOrnamentId).unwrap();
          toast.success(res?.message ?? "Ornament Name deleted successfully");
          closeDeleteModal();
          console.log(res);
    } catch (err:any) {
          toast.error(err?.data?.message ?? "Failed to delete Ornament Name");
          closeDeleteModal();
        }
}, [ deleteOrnamentName, selectedOrnamentId, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteOrnamentName,
  };
};
