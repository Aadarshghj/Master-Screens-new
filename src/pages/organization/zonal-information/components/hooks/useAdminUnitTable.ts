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
  // ── Data ─────────────────────────────────────────────────────────────────
  const { data: allData = [], isFetching } = useGetAllBranchesQuery() as {
    data?: BranchResponseDto[];
    isFetching: boolean;
  };

  const { data: rawUnitTypeOptions = [] } = useGetAdminUnitTypesQuery() as {
    data?: AdminUnitTypeOption[];
  };

  // ── Unit type filter state ────────────────────────────────────────────────
  const [selectedUnitType, setSelectedUnitType] = useState<string>(
    externalUnitType ?? ALL_UNIT_TYPES
  );

  // Sync when parent page changes the locked unit type
  useEffect(() => {
    if (!externalUnitType) return;
    setSelectedUnitType(externalUnitType);
  }, [externalUnitType]);

  // ── Options — sorted by hierarchy, labels kept RAW from DB ───────────────
  const adminUnitTypeOptions = useMemo(
    () =>
      [...rawUnitTypeOptions].sort(
        (a, b) => (a.hierarchyLevel ?? 0) - (b.hierarchyLevel ?? 0)
      ),
    [rawUnitTypeOptions]
  );

  // ── Selected label ────────────────────────────────────────────────────────
  // When externalUnitType is a UUID we resolve its label from the options.
  // Fallback chain: matched label → "All"
  const selectedUnitLabel = useMemo(() => {
    if (selectedUnitType === ALL_UNIT_TYPES) return "All";
    return (
      adminUnitTypeOptions.find(o => o.value === selectedUnitType)?.label ??
      "All"
    );
  }, [selectedUnitType, adminUnitTypeOptions]);

  // ── Filtered data ─────────────────────────────────────────────────────────
  const data = useMemo<BranchResponseDto[]>(() => {
    if (selectedUnitType === ALL_UNIT_TYPES) return allData;
    return allData.filter(
      row => row.adminUnitTypeIdentity === selectedUnitType
    );
  }, [allData, selectedUnitType]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const [deleteBranch] = useDeleteBranchMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const openDeleteModal = useCallback((identity: string) => {
    setSelectedBranchId(identity);
    setShowDeleteModal(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedBranchId(null);
  }, []);

  const confirmDeleteAdminUnit = useCallback(async () => {
    if (!selectedBranchId) return;
    try {
      await deleteBranch(selectedBranchId).unwrap();
      toast.success("Deleted successfully");
      closeDeleteModal();
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message ?? "Failed to delete");
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
