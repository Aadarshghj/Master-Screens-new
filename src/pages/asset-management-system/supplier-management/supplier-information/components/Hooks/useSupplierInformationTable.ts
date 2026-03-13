import { useCallback } from "react";
import type { SupplierAssetGroupType, SupplierContactManagementType } from "@/types/asset-management-system/supplier-management/supplier-information";
import { supplierAssetGroupMock, supplierContactMock } from "@/mocks/asset-management-system/supplier-management/supplier-information";

export const useSupplierContactManagementTable = () => {

  const data: SupplierContactManagementType[] = supplierContactMock;

  const onEdit = useCallback((row: SupplierContactManagementType) => {
    console.log("Edit clicked:", row);
  }, []);

  const onDelete = useCallback((row: SupplierContactManagementType) => {
    console.log("Delete clicked:", row);
  }, []);

  return {
    data,
    isFetching: false,
    onEdit,
    onDelete,
  };
};

export const useSupplierAssetGroupTable = () => {

  const data: SupplierAssetGroupType[] = supplierAssetGroupMock;

  const onEdit = useCallback((row: SupplierAssetGroupType) => {
    console.log("Edit clicked:", row);
  }, []);

  const onDelete = useCallback((row: SupplierAssetGroupType) => {
    console.log("Delete clicked:", row);
  }, []);

  return {
    data,
    isFetching: false,
    onEdit,
    onDelete,
  };
};