import  { useState, useMemo } from "react";
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
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

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
  
const adminUnitTypeMap = useMemo(() => {
  const map: Record<string, { name: string; hierarchyLevel: number }> = {}

  adminUnitTypes?.forEach((type) => {
    if (type?.value) {
      map[String(type.value)] = {
        name: type.label,
        hierarchyLevel: type.hierarchyLevel
      }
    }
  })

  return map
}, [adminUnitTypes])

  const { data: allBranchStaffMappings = [] } = useGetAllBranchStaffMappingsQuery();
  const [saveBranchStaffMapping] = useSaveBranchStaffMappingMutation();
  const [deleteBranchStaffMapping] = useDeleteBranchStaffMappingMutation();


 const branches = useMemo(() => {
  const enhancedBranches = branchesData.map((b) => {
    const unit = adminUnitTypeMap[String(b.adminUnitTypeIdentity)]

    return {
      ...b,
      adminUnitTypeName: unit?.name || "",
      hierarchyLevel: unit?.hierarchyLevel || 0
    }
  })

  const sortedBranches = enhancedBranches.sort(
    (a, b) => b.hierarchyLevel - a.hierarchyLevel
  )

  if (!branchSearchQuery) return sortedBranches

  const lower = branchSearchQuery.toLowerCase()

  return sortedBranches.filter(
    (b) =>
      b.branchName?.toLowerCase().includes(lower) ||
      b.branchCode?.toLowerCase().includes(lower) ||
      b.adminUnitTypeName?.toLowerCase().includes(lower)
  )
}, [branchesData, branchSearchQuery, adminUnitTypeMap])

  const selectedBranch = useMemo(
    () =>
      branchesData.find((b) => b.identity === selectedBranchId) || null,
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

  const branchStaffMap = useMemo(() => {
  const map: Record<string, AssignedStaff[]> = {}

  allBranchStaffMappings.forEach((m) => {
    if (!map[m.branchIdentity]) {
      map[m.branchIdentity] = []
    }

    map[m.branchIdentity].push({
      identity: m.identity,
      staffIdentity: m.staffIdentity,
      staffName: m.staffName,
      staffCode: "",
      branchIdentity: m.branchIdentity,
      branchName: m.branchName,
      isActive: m.isActive,
      status: m.isActive ? "Active" : "Pending"
    })
  })

  return map
}, [allBranchStaffMappings])

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
    } catch (error) {
      const err = error as FetchBaseQueryError;

      const message =
        typeof err?.data === "object" && err?.data !== null
          ? (err.data as { message?: string }).message
          : undefined;

      toast.error(message ?? `Failed to save ${name}`);
    } finally {
      setIsModalOpen(false);
    }
  };
console.log(branchesData)
console.log(adminUnitTypes)
console.log(adminUnitTypeMap)

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
    branchStaffMap,
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