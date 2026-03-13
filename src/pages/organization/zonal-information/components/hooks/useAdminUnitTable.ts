import { useCallback, useState, useMemo, useEffect } from "react";
import {
  useGetAllBranchesQuery,
  useDeleteBranchMutation,
} from "@/global/service/end-points/organisation/branches.api";
import { useGetAdminUnitTypesQuery } from "@/global/service/end-points/organisation/unit-type.api";
import type {
  BranchResponseDto,
  AdminUnitTypeOption,
} from "@/types/organisation/admin-unit";
import { toast } from "react-hot-toast";

export const ALL_UNIT_TYPES = "ALL";

interface UseAdminUnitTableProps {
  externalUnitType?: string;
}

export const useAdminUnitTable = ({
  externalUnitType,
}: UseAdminUnitTableProps = {}) => {
  const { data: rawAllData = [], isFetching } = useGetAllBranchesQuery();

  const { data: rawUnitTypeOptions = [] } = useGetAdminUnitTypesQuery();

  const [selectedUnitType, setSelectedUnitType] = useState<string>(
    externalUnitType ?? ALL_UNIT_TYPES
  );

  useEffect(() => {
    if (externalUnitType) {
      setSelectedUnitType(externalUnitType);
    }
  }, [externalUnitType]);

  /**
   * Normalize API data
   */
  const allData = useMemo<BranchResponseDto[]>(() => {
    return rawAllData.map(row => ({
      ...row,
      identity: row.identity ?? row.id ?? "",

      branchShortName: row.branchShortName || "",
      parentBranchName: row.parentBranchName || "",
      stateName: row.stateName || "",
      doorNumber: row.doorNumber || "",
      addressLine1: row.addressLine1 || "",
    }));
  }, [rawAllData]);
  /**
   * Sort admin unit types by hierarchy
   */
  const adminUnitTypeOptions = useMemo<AdminUnitTypeOption[]>(() => {
    return [...rawUnitTypeOptions].sort(
      (a, b) => (a.hierarchyLevel ?? 0) - (b.hierarchyLevel ?? 0)
    );
  }, [rawUnitTypeOptions]);

  /**
   * Selected label
   */
  const selectedUnitLabel = useMemo(() => {
    if (selectedUnitType === ALL_UNIT_TYPES) return "Branch";

    const match = adminUnitTypeOptions.find(o => o.value === selectedUnitType);

    return match?.label ?? "Branch";
  }, [selectedUnitType, adminUnitTypeOptions]);

  /**
   * Filter data by unit type
   */
  const data = useMemo<BranchResponseDto[]>(() => {
    if (selectedUnitType === ALL_UNIT_TYPES) return allData;

    return allData.filter(
      row => row.adminUnitTypeIdentity === selectedUnitType
    );
  }, [allData, selectedUnitType]);

  /**
   * Delete logic
   */
  const [deleteBranch] = useDeleteBranchMutation();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const openDeleteModal = useCallback((identity: string) => {
    if (!identity) return;
    setSelectedBranchId(identity);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setSelectedBranchId(null);
    setShowDeleteModal(false);
  }, []);

  const confirmDeleteAdminUnit = useCallback(async () => {
    if (!selectedBranchId) return;

    try {
      await deleteBranch(selectedBranchId).unwrap();
      toast.success("Deleted successfully");
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;

      toast.error(message ?? "Failed to delete");
    } finally {
      closeDeleteModal();
    }
  }, [deleteBranch, selectedBranchId, closeDeleteModal]);

  return {
    data,
    isFetching,
    adminUnitTypeOptions,
    selectedUnitType,
    setSelectedUnitType,
    selectedUnitLabel,
    showDeleteModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteAdminUnit,
  };
};
