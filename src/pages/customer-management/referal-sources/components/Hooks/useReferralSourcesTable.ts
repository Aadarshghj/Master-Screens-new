import { useCallback, useState } from "react";
import { logger } from "@/global/service";
import {
  useDeleteReferralSourceMutation,
  useGetReferralSourcesQuery,
} from "@/global/service/end-points/customer-management/referral-sources";

export const useReferralSourceTable = () => {
  const { data = [], isFetching } = useGetReferralSourcesQuery();
  const [deleteReferralSource] = useDeleteReferralSourceMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReferralSourceCode, setSelectedReferralSourceCode] = useState<
    string | null
  >(null);

  const openDeleteModal = useCallback((referralCode: string) => {
    setSelectedReferralSourceCode(referralCode);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedReferralSourceCode(null);
  }, []);

  const confirmDeleteReferralSource = useCallback(async () => {
    if (!selectedReferralSourceCode) return;

    try {
      await deleteReferralSource(selectedReferralSourceCode).unwrap();
      logger.info("Referral Source deleted successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [deleteReferralSource, selectedReferralSourceCode, closeDeleteModal]);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteReferralSource,
  };
};
