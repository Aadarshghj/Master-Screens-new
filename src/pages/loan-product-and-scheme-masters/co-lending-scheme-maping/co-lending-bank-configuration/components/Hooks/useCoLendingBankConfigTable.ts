import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

export const useBankRegTable = () => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBankRegId, setSelectedBankRegId] = useState<string | null>(null);

  const openDeleteModal = useCallback((bankRegId: string) => {
    setSelectedBankRegId(bankRegId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedBankRegId(null);
  }, []);

  const confirmDeleteBankReg = useCallback(async() => {
    if (!selectedBankRegId) return;
    try {
          closeDeleteModal();
    } catch (err:any) {
          toast.error(err?.data?.message ?? "Failed to delete Bank Registration");
          closeDeleteModal();
        }
}, [ selectedBankRegId, closeDeleteModal]);

  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteBankReg,
  };
};
