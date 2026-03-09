import { useCallback, useState } from "react";
// import { toast } from "react-hot-toast";

export const useChargesMasterTable = () => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedChargesId, setSelectedChargesId] = useState<string | null>(null);

  const openDeleteModal = useCallback(() => {
    // setSelectedChargeId(chargesId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    // setSelectedChargesId(null);
  }, []);

  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
  };
};
