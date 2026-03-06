import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

export const useQuotRegTable = () => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);

  const openDeleteModal = useCallback((quotRegId: string) => {
    setSelectedQuotationId(quotRegId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedQuotationId(null);
  }, []);

  const confirmDeleteQuotReg = useCallback(async() => {
    if (!selectedQuotationId) return;
    try {
          closeDeleteModal();
    } catch (err:any) {
          toast.error(err?.data?.message ?? "Failed to delete Quotation");
          closeDeleteModal();
        }
}, [ selectedQuotationId, closeDeleteModal]);

  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteQuotReg,
  };
};
