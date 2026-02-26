import { useCallback, useState } from "react";
import { 
  useGetAdminUnitDataQuery,
  useDeleteAdminUnitDataMutation 
} from "@/global/service/end-points/customer-management/admin-unit-type.api";
import { toast } from "react-hot-toast";

export const useAdminUnitTypeTable = () => {
  const { data = [], isFetching } = useGetAdminUnitDataQuery();
  const [ deleteAdminUnit ] = useDeleteAdminUnitDataMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdminUnitTypeId, setSelectedAdminUnitTypeId] = useState<string | null>(null);

  const openDeleteModal = useCallback((adminUnitId: string) => {
    setSelectedAdminUnitTypeId(adminUnitId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedAdminUnitTypeId(null);
  }, []);

  const confirmDeleteAdminUnit = useCallback(async() => {
    if (!selectedAdminUnitTypeId) return;
    try {
          const response = await deleteAdminUnit(selectedAdminUnitTypeId).unwrap();
          toast.success(response?.message ?? "Admin Unit Type deleted successfully");
          closeDeleteModal();
          console.log(response);
    } catch (err:any) {
          toast.error(err?.data?.message ?? "Failed to delete Admin Unit Type");
          closeDeleteModal();
        }
}, [ deleteAdminUnit, selectedAdminUnitTypeId, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteAdminUnit,
  };
};
