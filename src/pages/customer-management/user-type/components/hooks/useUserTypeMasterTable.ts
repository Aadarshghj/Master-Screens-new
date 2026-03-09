import { useCallback, useState } from "react";

export const useUserTypeMasterTable = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserTypeId, setSelectedUserTypeId] = useState<string | null>(
    null
  );

  const openDeleteModal = useCallback((userTypeId: string) => {
    setSelectedUserTypeId(userTypeId);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedUserTypeId(null);
  }, []);

  return {
    showDeleteModal,
    selectedUserTypeId,
    openDeleteModal,
    closeDeleteModal,
  };
};
