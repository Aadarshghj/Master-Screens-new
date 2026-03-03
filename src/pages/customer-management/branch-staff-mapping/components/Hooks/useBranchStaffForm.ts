import { useState, useMemo } from "react";
import type { AssignedStaff, AvailableStaff } from "@/types/customer-management/branch-staff";
import {
  useGetAllStaffQuery,
  useGetAllBranchesQuery,
  useGetAssignedStaffQuery,
  useSaveBranchStaffMappingMutation,
  useDeleteBranchStaffMappingMutation,
  useGetAdminUnitTypesQuery,
} from "@/global/service/end-points/customer-management/branch-staff-mapping";
import { logger } from "@/global/service";
import { ADMIN_UNIT_TYPE } from "../../constants/BranchStaffDefaults";

export const useBranchStaffMapping = () => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [branchSearchQuery, setBranchSearchQuery] = useState<string>("");
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [branchAssignments, setBranchAssignments] = useState<Record<string, AssignedStaff[]>>({});
  const [staffToRemove, setStaffToRemove] = useState<AssignedStaff | null>(null);

  const { data: adminUnitTypes = [] } = useGetAdminUnitTypesQuery();
  const { data: allStaff = [], isLoading: allStaffLoading } = useGetAllStaffQuery();
  const { data: branchesData = [] } = useGetAllBranchesQuery();
  const { data: assignedStaffBackend = [] } =
    useGetAssignedStaffQuery(selectedBranchId, { skip: !selectedBranchId });

  const [saveBranchStaffMapping] = useSaveBranchStaffMappingMutation();
  const [deleteBranchStaffMapping] = useDeleteBranchStaffMappingMutation();

  const branchAdminUnitTypeIdentity = useMemo(() => {
    return adminUnitTypes.find(
      (type) => type.code === ADMIN_UNIT_TYPE.BRANCH_CODE  && type.isActive
    )?.identity;
  }, [adminUnitTypes]);

  const filteredBranches = useMemo(() => {
    if (!branchAdminUnitTypeIdentity) return [];
    return branchesData.filter(
      (b) => b.adminUnitTypeIdentity === branchAdminUnitTypeIdentity
    );
  }, [branchesData, branchAdminUnitTypeIdentity]);

  const selectedBranch = useMemo(
    () => filteredBranches.find((b) => b.id === selectedBranchId) || null,
    [filteredBranches, selectedBranchId]
  );

  const branches = useMemo(() => {
    if (!branchSearchQuery) return filteredBranches;
    const lower = branchSearchQuery.toLowerCase();
    return filteredBranches.filter(
      (b) =>
        b.branchName.toLowerCase().includes(lower) ||
        b.branchCode.toLowerCase().includes(lower)
    );
  }, [filteredBranches, branchSearchQuery]);

 const backendAssignments = useMemo(() => {
  if (!selectedBranchId) return {};

  return {
    [selectedBranchId]: assignedStaffBackend.map((s) => {
      const status: "Active" | "Pending" =
        s.isActive ? "Active" : "Pending";

      return {
        identity: s.identity,
        staffIdentity: s.staffIdentity,
        staffName: s.staffName,
        branchIdentity: s.branchIdentity,
        branchName: s.branchName,
        isActive: s.isActive,
        status,
      };
    }),
  };
}, [assignedStaffBackend, selectedBranchId]);

  const combinedAssignments = useMemo(() => {
    const keys = new Set([
      ...Object.keys(backendAssignments),
      ...Object.keys(branchAssignments),
    ]);

    const map: Record<string, AssignedStaff[]> = {};

    keys.forEach((key) => {
      map[key] = [
        ...(backendAssignments[key] || []),
        ...(branchAssignments[key] || []),
      ];
    });

    return map;
  }, [backendAssignments, branchAssignments]);

  const assignedStaff = useMemo(
    () => combinedAssignments[selectedBranchId] || [],
    [combinedAssignments, selectedBranchId]
  );

  const pendingCount = assignedStaff.filter(
    (s) => s.status === "Pending"
  ).length;

  const availableStaff = useMemo(() => {
    const assignedIds = new Set(assignedStaff.map((s) => s.staffIdentity));
    const lower = staffSearchQuery.toLowerCase().trim();

    return allStaff
      .filter(
        (s) =>
          !assignedIds.has(s.id) &&
          (s.staffName.toLowerCase().includes(lower) ||
            s.staffCode.toLowerCase().includes(lower))
      )
      .map((s) => ({ ...s }));
  }, [allStaff, assignedStaff, staffSearchQuery]);

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranchId(branchId);
    setStaffSearchQuery("");
  };

  const moveStaffToPending = (staff: AvailableStaff) => {
    if (!selectedBranchId) return;

    const newStaff: AssignedStaff = {
      identity: staff.id,
      staffIdentity: staff.id,
      staffName: staff.staffName,
      branchIdentity: selectedBranchId,
      branchName: selectedBranch?.branchName || "",
      isActive: false,
      status: "Pending",
    };

    setBranchAssignments((prev) => ({
      ...prev,
      [selectedBranchId]: [newStaff, ...(prev[selectedBranchId] || [])],
    }));
  };

  const removeStaff = (staff: AssignedStaff) => {
    if (!selectedBranchId) return;
    setStaffToRemove(staff);
  };

  const confirmRemoveStaff = async () => {
    if (!staffToRemove || !selectedBranchId) return;

    try {
      if (staffToRemove.status === "Pending") {
        setBranchAssignments((prev) => ({
          ...prev,
          [selectedBranchId]: (prev[selectedBranchId] || []).filter(
            (s) => s.staffIdentity !== staffToRemove.staffIdentity
          ),
        }));
      } else {
        await deleteBranchStaffMapping(staffToRemove.identity).unwrap();

        logger.info(`Staff ${staffToRemove.staffName} removed successfully!`, {
          toast: true,
        });
      }

      setStaffToRemove(null);
    } catch (err) {
      logger.error(`Failed to remove staff ${staffToRemove.staffName}`, {
        toast: true,
      });
      console.log(err);
    }
  };

  const clearAssignedStaff = () => {
    if (!selectedBranchId) return;

    setBranchAssignments((prev) => ({
      ...prev,
      [selectedBranchId]: [],
    }));
  };

  const confirmAssignment = async () => {
    if (!selectedBranchId) return;

    const pendingStaff =
      branchAssignments[selectedBranchId]?.filter(
        (s) => s.status === "Pending"
      ) || [];

    if (!pendingStaff.length) return;

    try {
      for (const staff of pendingStaff) {
        await saveBranchStaffMapping({
          branchIdentity: selectedBranchId,
          staffIdentity: staff.staffIdentity,
        }).unwrap();
      }

      clearAssignedStaff();
      logger.info("Staff assigned successfully!", { toast: true });
    } catch (err) {
      logger.error("Failed to assign staff", { toast: true });
      console.log(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  return {
    branches,
    branchAssignments,
    selectedBranch,
    selectedBranchId,
    branchSearchQuery,
    staffSearchQuery,
    assignedStaff,
    availableStaff,
    allStaffLoading,
    pendingCount,
    isModalOpen,
    staffToRemove,
    setStaffToRemove,
    setBranchSearchQuery,
    setStaffSearchQuery,
    handleBranchSelect,
    moveStaffToPending,
    removeStaff,
    confirmRemoveStaff,
    clearAssignedStaff,
    setIsModalOpen,
    confirmAssignment,
  };
};