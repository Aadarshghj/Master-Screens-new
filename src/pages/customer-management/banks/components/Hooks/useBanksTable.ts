import { useCallback, useState } from "react";
import {
  useDeleteBankMutation,
  useGetMasterBanksQuery,
} from "@/global/service/end-points/customer-management/bank";
import { logger } from "@/global/service";

export const useBankTable = () => {
  const { data = [], isFetching } = useGetMasterBanksQuery();
  const [deleteBank] = useDeleteBankMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBankCode, setSelectedBankCode] = useState<string | null>(null);

  const openDeleteModal = useCallback((bankCode: string) => {
    setSelectedBankCode(bankCode);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedBankCode(null);
  }, []);

  const confirmDeleteBank = useCallback(async () => {
    if (!selectedBankCode) return;

    try {
      await deleteBank(selectedBankCode).unwrap();
      logger.info("Bank deleted successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [deleteBank, selectedBankCode, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteBank,
  };
};
