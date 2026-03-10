import { useCallback, useState } from "react";
import type { AddressTypeMaster } from "../../../../../types/customer-management/address-type-master";
import { ADDRESS_TYPE_MASTER_SAMPLE_DATA } from "@/mocks/customer-management-master/address-type";
import { logger } from "../../../../../global/service";

export const useAddressTypeMasterTable = () => {

  const [data, setData] = useState<AddressTypeMaster[]>(
    ADDRESS_TYPE_MASTER_SAMPLE_DATA
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAddressTypeId, setSelectedAddressTypeId] = useState<string | null>(null);

  const openDeleteModal = useCallback((id: string) => {
    setSelectedAddressTypeId(id);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedAddressTypeId(null);
  }, []);

  const confirmDeleteAddressType = useCallback(() => {
    if (!selectedAddressTypeId) return;

    try {
      setData((prev) =>
        prev.filter((item) => item.identity !== selectedAddressTypeId)
      );

      logger.info("Address Type Deleted Successfully", { toast: true });
      closeDeleteModal();
    } catch (err) {
      logger.error(err, { toast: true });
    }
  }, [selectedAddressTypeId, closeDeleteModal]);

  return {
    data,
    isFetching: false,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteAddressType,
  };
};