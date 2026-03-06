import React, { useState, useMemo } from "react";
import type {
  AssignedStaff,
  AvailableStaff,
} from "@/types/customer-management/branch-staff";
import {
  useGetAllStaffQuery,
  useGetAllBranchesQuery,
  useGetAssignedStaffQuery,
  useSaveBranchStaffMappingMutation,
  useDeleteBranchStaffMappingMutation,useGetAdminUnitTypesQuery,useGetAllBranchStaffMappingsQuery
} from "@/global/service/end-points/customer-management/branch-staff-mapping";

import { logger } from "@/global/service";

export const useBranchStaffMapping = () => {

  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [branchSearchQuery, setBranchSearchQuery] = useState<string>("");
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [branchAssignments, setBranchAssignments] = useState<Record<string, AssignedStaff[]>>({});
  const [staffToRemove, setStaffToRemove] = useState<AssignedStaff | null>(null);

  const { data: allStaff = [], isLoading: allStaffLoading } = useGetAllStaffQuery();
  const { data: branchesData = [] } = useGetAllBranchesQuery();
  const { data: assignedStaffBackend = [] } = useGetAssignedStaffQuery(selectedBranchId, { skip: !selectedBranchId });
  const { data: adminUnitTypes = [] } = useGetAdminUnitTypesQuery();
  
  const adminUnitTypeMap = React.useMemo<Record<string, string>>(() => {
  return adminUnitTypes.reduce((acc, type) => {
    if (type.isActive) {
      acc[type.identity] = type.name;
    }
    return acc;
  }, {} as Record<string, string>);
}, [adminUnitTypes]);

  const { data: allBranchStaffMappings = [] } = useGetAllBranchStaffMappingsQuery();
  const [saveBranchStaffMapping] = useSaveBranchStaffMappingMutation();
  const [deleteBranchStaffMapping] = useDeleteBranchStaffMappingMutation();


 const branches = useMemo(() => {
  const enhancedBranches = branchesData.map((b) => ({
    ...b,
    adminUnitTypeName:
      adminUnitTypeMap[b.adminUnitTypeIdentity] || "",
  }));

  if (!branchSearchQuery) return enhancedBranches;

  const lower = branchSearchQuery.toLowerCase();

  return enhancedBranches.filter(
    (b) =>
      b.branchName?.toLowerCase().includes(lower) ||
      b.branchCode?.toLowerCase().includes(lower) ||
      b.adminUnitTypeName?.toLowerCase().includes(lower)
  );
}, [branchesData, branchSearchQuery, adminUnitTypeMap]);

  const selectedBranch = useMemo(
    () =>
      branchesData.find((b) => b.id === selectedBranchId) || null,
    [branchesData, selectedBranchId]
  );

  const backendAssignments = useMemo<
    Record<string, AssignedStaff[]>
  >(() => {
    if (!selectedBranchId) return {};

    return {
      [selectedBranchId]: assignedStaffBackend.map(
        (s): AssignedStaff => ({
          identity: s.identity,
          staffIdentity: s.staffIdentity,
          staffName: s.staffName,
          staffCode: s.staffCode,
          branchIdentity: s.branchIdentity,
          branchName: s.branchName,
          isActive: s.isActive,
          status: s.isActive ? "Active" : "Pending",
        })
      ),
    };
  }, [assignedStaffBackend, selectedBranchId]);


  const combinedAssignments = useMemo<
    Record<string, AssignedStaff[]>
  >(() => {
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

  const availableStaff = useMemo<AvailableStaff[]>(() => {
  const assignedIds = new Set<string>();
 
  allBranchStaffMappings.forEach((mapping) => {
    if (mapping.isActive) {
      assignedIds.add(mapping.staffIdentity);
    }
  });

  Object.values(branchAssignments).forEach((staffList) => {
    staffList.forEach((staff) => {
      assignedIds.add(staff.staffIdentity);
    });
  });

  const lower = staffSearchQuery.toLowerCase().trim();

  return allStaff
    .filter(
      (staff) =>
        !assignedIds.has(staff.id) &&
        (staff.staffName.toLowerCase().includes(lower) ||
          staff.staffCode.toLowerCase().includes(lower))
    )
    .map((staff) => ({
      id: staff.id,
      staffName: staff.staffName,
      staffCode: staff.staffCode,
    }));
}, [
  allStaff,
  allBranchStaffMappings,
  branchAssignments,
  staffSearchQuery,
]);


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
      staffCode: staff.staffCode,
      branchIdentity: selectedBranchId,
      branchName: selectedBranch?.branchName || "",
      isActive: false,
      status: "Pending",
    };

    setBranchAssignments((prev) => ({
      ...prev,
      [selectedBranchId]: [
        newStaff,
        ...(prev[selectedBranchId] || []),
      ],
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
          [selectedBranchId]: (
            prev[selectedBranchId] || []
          ).filter(
            (s) =>
              s.staffIdentity !==
              staffToRemove.staffIdentity
          ),
        }));
      } else {
        await deleteBranchStaffMapping(
          staffToRemove.identity
        ).unwrap();

        logger.info(
          `Staff ${staffToRemove.staffName} removed successfully!`,
          { toast: true }
        );
      }

      setStaffToRemove(null);
    } catch (err) {
      logger.error(
        `Failed to remove staff ${staffToRemove.staffName}`,
        { toast: true }
      );
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

      logger.info("Staff assigned successfully!", {
        toast: true,
      });
    } catch (err) {
      logger.error("Failed to assign staff", {
        toast: true,
      });
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