import { useCallback, useState } from "react";
import type { SupplierMasterType } from "@/types/asset-management-system/supplier-management/supplier-list";
import { SUPPLIER_MASTER_MOCK } from "@/mocks/asset-management-system/supplier-management/supplier-list-mock"
import { logger } from "@/global/service";

export const useSupplierTable = () => {

  const [data, setData] = useState<SupplierMasterType[]>(SUPPLIER_MASTER_MOCK);
  const [isFetching] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  const openDeleteModal = useCallback((identity: string) => {
    setSelectedSupplierId(identity);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedSupplierId(null);
  }, []);

  const confirmDeleteSupplier = useCallback(() => {
    if (!selectedSupplierId) return;

    const updatedData = data.filter(
      (supplier) => supplier.identity !== selectedSupplierId
    );

    setData(updatedData);

    logger.info("Supplier deleted successfully", { toast: true });

    closeDeleteModal();
  }, [data, selectedSupplierId, closeDeleteModal]);

  const onEdit = useCallback((supplier: SupplierMasterType) => {
    console.log("Edit supplier:", supplier);
    logger.info("Edit clicked");
  }, []);

  return {
    data,
    isFetching,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteSupplier,
    onEdit,
  };
};