import { useCallback, useState } from "react";
import { logger } from "../../../../../global/service";
import { ORNAMENT_TYPE_TABLE_MOCK } from "../../../../../mocks/customer-management-master/ornament-type";
import type { OrnamentType } from "@/types/customer-management/ornament-type";

export const useOrnamentTypeMasterTable = () => {

  const [data, setData] = useState<OrnamentType[]>(ORNAMENT_TYPE_TABLE_MOCK);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrnamentTypeCode, setSelectedOrnamentTypeCode] = useState<string | null>(null);

  const onEdit = useCallback((row: OrnamentType) => {
    console.log("Edit clicked:", row);
  }, []);

  const openDeleteModal = useCallback((ornamentTypeCode: string) => {
    setSelectedOrnamentTypeCode(ornamentTypeCode);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedOrnamentTypeCode(null);
  }, []);

  const confirmDeleteOrnamentType = useCallback(() => {
    if (!selectedOrnamentTypeCode) return;

    const updatedData = data.filter(
      (item) => item.ornamentTypeCode !== selectedOrnamentTypeCode
    );

    setData(updatedData);

    logger.info("Ornament Type Deleted Successfully", { toast: true });

    closeDeleteModal();
  }, [selectedOrnamentTypeCode, data, closeDeleteModal]);

  return {
    data,
    isFetching: false,

    onEdit,

    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteOrnamentType,
  };
};