import { useState, useMemo } from "react";
import { useGetMasterDesignationsQuery } from "@/global/service/end-points/customer-management/designation";
import {
  useGetAllDesignationRoleMappingsQuery,
  useGetAllRolesQuery,
  useSaveDesignationRoleMappingMutation,
  useDeleteDesignationRoleMappingMutation,
} from "@/global/service/end-points/customer-management/designation-master.api";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import type { AssignedRole, AvailableRole, AccessType } from "../../constants";
import { logger } from "@/global/service";

export const useDesignationRoleMapping = () => {
  const [selectedDesignationId, setSelectedDesignationId] =
    useState<string>("");

  const [designationSearchQuery, setDesignationSearchQuery] =
    useState<string>("");

  const [roleSearchQuery, setRoleSearchQuery] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [designationAssignments, setDesignationAssignments] = useState<
    Record<string, AssignedRole[]>
  >({});

  const [tempAccessTypes, setTempAccessTypes] = useState<
    Record<string, AccessType>
  >({});

  const { data: rolesData = [] } = useGetAllRolesQuery();
  const { data: designationData = [] } = useGetMasterDesignationsQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );
  const { data: mappingData = [] } = useGetAllDesignationRoleMappingsQuery();

  const [saveDesignationRoleMapping] = useSaveDesignationRoleMappingMutation();
  const [deleteDesignationRoleMapping] =
    useDeleteDesignationRoleMappingMutation();

  const extractErrorMessage = (
    error: FetchBaseQueryError | SerializedError
  ): string => {
    if ("status" in error) {
      if (
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data
      ) {
        return (
          (error.data as { message?: string }).message ??
          "Something went wrong."
        );
      }
      return "Something went wrong.";
    }

    return error.message ?? "Something went wrong.";
  };

  const designations = useMemo(() => {
    return designationData.map(d => ({
      id: d.id,
      name: d.designationName,
      empId: d.designationCode,
      department: d.description ?? "No description",
      initial: d.designationName?.charAt(0) ?? "",
      color: "bg-blue-600",
      assignedCount:
        mappingData.filter(m => m.designationId === d.id && m.isActive)
          .length ?? 0,
    }));
  }, [designationData, mappingData]);

  const selectedDesignation = useMemo(() => {
    return designations.find(d => d.id === selectedDesignationId) ?? null;
  }, [designations, selectedDesignationId]);

  const filteredDesignations = useMemo(() => {
    if (!designationSearchQuery) return designations;

    const lower = designationSearchQuery.toLowerCase();

    return designations.filter(
      d =>
        d.name.toLowerCase().includes(lower) ||
        d.empId.toLowerCase().includes(lower)
    );
  }, [designations, designationSearchQuery]);

  const backendAssignments: Record<string, AssignedRole[]> = useMemo(() => {
    const map: Record<string, AssignedRole[]> = {};

    mappingData.forEach(item => {
      if (!map[item.designationId]) {
        map[item.designationId] = [];
      }

      map[item.designationId].push({
        id: item.roleId,
        mappingId: item.id,
        title: item.roleName,
        subtitle: "",
        accessLevel: "Read",
        status: item.isActive ? "Active" : "Pending",
        description: item.isActive ? "Assigned as Read" : "Pending activation",
      });
    });

    return map;
  }, [mappingData]);

  const combinedAssignments = useMemo(() => {
    const allKeys = new Set([
      ...Object.keys(backendAssignments),
      ...Object.keys(designationAssignments),
    ]);

    const result: Record<string, AssignedRole[]> = {};

    allKeys.forEach(key => {
      result[key] = [
        ...(backendAssignments[key] || []),
        ...(designationAssignments[key] || []),
      ];
    });

    return result;
  }, [backendAssignments, designationAssignments]);

  const currentAssignedRoles: AssignedRole[] = useMemo(() => {
    if (!selectedDesignationId) return [];
    return combinedAssignments[selectedDesignationId] ?? [];
  }, [selectedDesignationId, combinedAssignments]);

  const pendingCount = currentAssignedRoles.filter(
    r => r.status === "Pending"
  ).length;

  const dynamicAvailableRoles: AvailableRole[] = useMemo(() => {
    if (!selectedDesignationId) {
      const allActive = rolesData
        .filter(role => role.isActive)
        .map(role => ({
          id: role.identity,
          title: role.roleName,
          subtitle: role.roleShortDesc ?? role.roleCode ?? "",
        }));

      if (!roleSearchQuery) return allActive;

      const lower = roleSearchQuery.toLowerCase();

      return allActive.filter(role => role.title.toLowerCase().includes(lower));
    }

    const backendRoleIds = mappingData
      .filter(m => m.designationId === selectedDesignationId)
      .map(m => m.roleId);

    const localPendingRoleIds =
      designationAssignments[selectedDesignationId]?.map(r => r.id) ?? [];

    const excludedRoleIds = new Set([
      ...backendRoleIds,
      ...localPendingRoleIds,
    ]);

    const mapped = rolesData
      .filter(role => role.isActive && !excludedRoleIds.has(role.identity))
      .map(role => ({
        id: role.identity,
        title: role.roleName,
        subtitle: role.roleShortDesc ?? role.roleCode ?? "",
      }));

    if (!roleSearchQuery) return mapped;

    const lower = roleSearchQuery.toLowerCase();

    return mapped.filter(role => role.title.toLowerCase().includes(lower));
  }, [
    rolesData,
    roleSearchQuery,
    mappingData,
    selectedDesignationId,
    designationAssignments,
  ]);

  const handleDesignationSelect = (id: string) => {
    setSelectedDesignationId(id);
    setRoleSearchQuery("");
    setTempAccessTypes({});
  };

  const setAccessTypeForAvailable = (roleId: string, type: AccessType) => {
    setTempAccessTypes(prev => ({
      ...prev,
      [roleId]: type,
    }));
  };

  const moveRoleToPending = (role: AvailableRole) => {
    if (!selectedDesignationId) return;

    const accessLevel = tempAccessTypes[role.id] ?? "Read";

    const newRole: AssignedRole = {
      id: role.id,
      title: role.title,
      subtitle: role.subtitle,
      accessLevel,
      status: "Pending",
      description: `Pending assignment (${accessLevel})`,
    };

    setDesignationAssignments(prev => ({
      ...prev,
      [selectedDesignationId]: [
        newRole,
        ...(prev[selectedDesignationId] ?? []),
      ],
    }));

    setTempAccessTypes(prev => {
      const copy = { ...prev };
      delete copy[role.id];
      return copy;
    });
  };

  const clearAssignedRoles = async () => {
    if (!selectedDesignationId) return;

    try {
      const pendingRoles = currentAssignedRoles.filter(
        r => r.status === "Pending"
      );

      const backendPendingRoles = pendingRoles.filter(r => r.mappingId);

      await Promise.all(
        backendPendingRoles.map(role =>
          deleteDesignationRoleMapping(role.mappingId as string).unwrap()
        )
      );

      setDesignationAssignments(prev => ({
        ...prev,
        [selectedDesignationId]: [],
      }));

      logger.info("Pending roles cleared successfully", {
        toast: true,
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        ("status" in error || "message" in error)
      ) {
        logger.error(
          extractErrorMessage(error as FetchBaseQueryError | SerializedError),
          { toast: true }
        );
      } else {
        logger.error("Something went wrong.", { toast: true });
      }
    }
  };

  const removeRole = async (roleId: string) => {
    if (!selectedDesignationId) return;

    try {
      const roleToDelete = currentAssignedRoles.find(r => r.id === roleId);

      if (roleToDelete?.mappingId) {
        await deleteDesignationRoleMapping(roleToDelete.mappingId).unwrap();
      }

      setDesignationAssignments(prev => ({
        ...prev,
        [selectedDesignationId]: (prev[selectedDesignationId] ?? []).filter(
          r => r.id !== roleId
        ),
      }));

      logger.info("Deleted successfully", { toast: true });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        ("status" in error || "message" in error)
      ) {
        logger.error(
          extractErrorMessage(error as FetchBaseQueryError | SerializedError),
          { toast: true }
        );
      } else {
        logger.error("Something went wrong.", { toast: true });
      }
    }
  };

  const confirmAssignment = async () => {
    if (!selectedDesignationId) return;

    const pendingRoles = currentAssignedRoles.filter(
      r => r.status === "Pending"
    );

    if (!pendingRoles.length) return;

    try {
      await Promise.all(
        pendingRoles.map(role =>
          saveDesignationRoleMapping({
            designationIdentity: selectedDesignationId,
            roleIdentity: role.id,
            isActive: false,
          }).unwrap()
        )
      );

      setDesignationAssignments(prev => ({
        ...prev,
        [selectedDesignationId]: [],
      }));

      setIsModalOpen(false);

      logger.info("Roles assigned successfully", { toast: true });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        ("status" in error || "message" in error)
      ) {
        logger.error(
          extractErrorMessage(error as FetchBaseQueryError | SerializedError),
          { toast: true }
        );
      } else {
        logger.error("Something went wrong.", { toast: true });
      }
    }
  };

  return {
    designations: filteredDesignations,
    designationAssignments,
    assignedRoles: currentAssignedRoles,
    availableRoles: dynamicAvailableRoles,
    selectedDesignation,
    selectedDesignationId,
    designationSearchQuery,
    roleSearchQuery,
    tempAccessTypes,
    pendingCount,
    isModalOpen,
    backendAssignments,
    combinedAssignments,
    setDesignationSearchQuery,
    setRoleSearchQuery,
    handleDesignationSelect,
    setAccessTypeForAvailable,
    moveRoleToPending,
    removeRole,
    setIsModalOpen,
    confirmAssignment,
    clearAssignedRoles,
  };
};
