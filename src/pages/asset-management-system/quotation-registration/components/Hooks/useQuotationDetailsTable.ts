import { useCallback, useState } from "react";
// import { toast } from "react-hot-toast";

export const useQuotDetTable = () => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedQuotDetId, setSelectedQuotDetId] = useState<string | null>(null);

  const openDeleteModal = useCallback(() => {
    // setSelectedQuotDetId(quotDetId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    // setSelectedQuotDetId(null);
  }, []);

  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
  };
};
