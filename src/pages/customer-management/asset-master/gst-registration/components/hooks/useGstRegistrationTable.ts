import { useCallback, useState } from "react";
// import { toast } from "react-hot-toast";

export const useGstRegistrationTable = () => {

  const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedGstRegId, setSelectedGstRegId] = useState<string | null>(null);

  const openDeleteModal = useCallback(() => {
    // setSelectedGstRegId(gstRegId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    // setSelectedGstRegId(null);
  }, []);

  return {
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
  };
};
