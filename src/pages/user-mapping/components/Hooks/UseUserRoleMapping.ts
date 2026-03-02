import { useState, useMemo, useEffect } from "react";
import type {
  AssignedRole,
  AvailableRole,
  AccessType,
  ApiPermissionType,
  ApiRoleData,
  UserCardData,
  ApiUserRoleMapping,
  ApiMasterRole,
} from "@/types/user-role-mapping/user-mapping";
import { logger } from "@/global/service";
import { AVATAR_COLORS } from "../../constants/index";

import {
  useGetAssignedRolesQuery,
  useGetUserRolesQuery,
  useGetPermissionTypesQuery,
  useGetAvailableRolesQuery,
  useCreateUserRoleMutation,
  useDeleteUserRoleMutation,
  useLazyGetUserRoleMappingByIdQuery,
} from "@/global/service/end-points/customer-management/user-role.api.ts";

export const useUserRoleMapping = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [roleSearchQuery, setRoleSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const [roleToRemove, setRoleToRemove] = useState<AssignedRole | null>(null);

  const [assignments, setAssignments] = useState<
    Record<string, AssignedRole[]>
  >({});
  const [tempAccessTypes, setTempAccessTypes] = useState<
    Record<string, AccessType>
  >({});

  const [enrichedAssignedRoles, setEnrichedAssignedRoles] = useState<
    AssignedRole[]
  >([]);
  const [isEnriching, setIsEnriching] = useState(false);

  const { data: apiUsers = [], isLoading: isUsersLoading } =
    useGetUserRolesQuery();
  const { data: rawPermissions = [] } = useGetPermissionTypesQuery();
  const { data: rawAvailableRoles = [], isLoading: isRolesLoading } =
    useGetAvailableRolesQuery();
  const { data: serverData, isLoading: isAssignmentLoading } =
    useGetAssignedRolesQuery();

  const [saveRole] = useCreateUserRoleMutation();
  const [deleteRole] = useDeleteUserRoleMutation();

  const [fetchDeepRoleData] = useLazyGetUserRoleMappingByIdQuery();

  const masterRoles = useMemo(() => {
    const rawRoles = rawAvailableRoles as unknown as ApiMasterRole[];
    return rawRoles
      .filter((r: ApiMasterRole) => r.isActive)
      .map((r: ApiMasterRole) => ({
        id: r.identity,
        title: r.roleName,
        subtitle: r.roleShortDesc || r.roleCode,
      }));
  }, [rawAvailableRoles]);

  const accessOptions = useMemo(() => {
    const rawPerms = rawPermissions as unknown as ApiPermissionType[];
    return rawPerms
      .filter((p: ApiPermissionType) => p.isActive)
      .map((p: ApiPermissionType) => ({
        label: p.permissionName,
        value: p.identity,
        code: p.permissionCode,
      }));
  }, [rawPermissions]);

  const users = useMemo(() => {
    if (!apiUsers || !Array.isArray(apiUsers)) return [];
    const uniqueUsersMap = new Map<string, UserCardData>();
    const typedApiUsers = apiUsers as unknown as ApiRoleData[];

    typedApiUsers.forEach(u => {
      const userId = u.identity || u.userIdentity || u.value;
      if (!userId) return;

      if (!uniqueUsersMap.has(userId)) {
        const name =
          u.userName || (u.label ? u.label.split("(")[0].trim() : "Unknown");
        const code =
          u.userCode ||
          (u.label && u.label.includes("(")
            ? u.label.split("(")[1].replace(")", "")
            : "N/A");
        const firstLetterCode = name.charCodeAt(0) || 0;
        const userColor = AVATAR_COLORS[firstLetterCode % AVATAR_COLORS.length];
        uniqueUsersMap.set(userId, {
          id: userId,
          name,
          empId: code,
          department: u.roleName || "General",
          initial: name.charAt(0) || "U",
          color: userColor,
          assignedCount: 0,
        });
      }
      const existingUser = uniqueUsersMap.get(userId);
      if (existingUser) existingUser.assignedCount += 1;
    });

    return Array.from(uniqueUsersMap.values()).map(user => ({
      ...user,
      assignedCount: assignments[user.id]
        ? assignments[user.id].length
        : user.assignedCount,
    }));
  }, [apiUsers, assignments]);

  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    const lower = userSearchQuery.toLowerCase();
    return users.filter(
      u =>
        u.name.toLowerCase().includes(lower) ||
        u.empId.toLowerCase().includes(lower)
    );
  }, [users, userSearchQuery]);

  useEffect(() => {
    if (!serverData) return;
    const rawData = (Array.isArray(serverData)
      ? serverData
      : [serverData]) as unknown as ApiUserRoleMapping[];
    const allAssignments: Record<string, AssignedRole[]> = {};

    rawData.forEach(item => {
      const uid = item.userIdentity || item.userCode;
      if (!uid) return;
      if (!allAssignments[uid]) allAssignments[uid] = [];

      const roleDef = masterRoles.find(r => r.id === item.roleIdentity);
      allAssignments[uid].push({
        id: item.identity || `fallback-${Math.random()}`,
        roleId: item.roleIdentity,
        title: item.roleName || roleDef?.title || "Unknown Role",
        subtitle: item.roleCode || roleDef?.subtitle || "",
        accessLevel: item.permissionName || "Read",
        permissionId: item.permissionIdentity,
        status: "Active",
        effectiveFrom: item.effectiveFrom,
        effectiveTo: item.effectiveTo,
        isPrimary: item.isPrimary,
      } as AssignedRole);
    });

    setAssignments(prev => {
      const newState = { ...allAssignments };
      Object.keys(prev).forEach(userId => {
        if (prev[userId] && prev[userId].some(r => r.status === "Pending")) {
          newState[userId] = prev[userId];
        }
      });
      return newState;
    });
  }, [serverData, masterRoles]);

  const selectedUser = useMemo(
    () => filteredUsers.find(u => u.id === selectedUserId) || null,
    [selectedUserId, filteredUsers]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const basicAssignedRoles = selectedUserId
    ? assignments[selectedUserId] || []
    : [];
  const pendingCount = basicAssignedRoles.filter(
    r => r.status === "Pending"
  ).length;

  const triggerDependency = JSON.stringify(
    basicAssignedRoles.map(r => r.id + r.status)
  );

  useEffect(() => {
    let isMounted = true;

    const enrichRolesWithDeepData = async () => {
      if (!selectedUserId || basicAssignedRoles.length === 0) {
        setEnrichedAssignedRoles([]);
        return;
      }

      setIsEnriching(true);

      const activeRoles = basicAssignedRoles.filter(r => r.status === "Active");
      const pendingRoles = basicAssignedRoles.filter(
        r => r.status === "Pending"
      );

      try {
        const promises = activeRoles.map(async role => {
          try {
            const deepData = await fetchDeepRoleData(role.id).unwrap();
            const details = Array.isArray(deepData) ? deepData[0] : deepData;
            return {
              ...role,
              title: details?.roleName || role.title,
              accessLevel: details?.permissionName || role.accessLevel,
              effectiveFrom: details?.effectiveFrom,
            };
          } catch (e) {
            console.error(`Failed to fetch deep data for role`, e);
            return role;
          }
        });

        const deepActiveRoles = await Promise.all(promises);

        if (isMounted) {
          setEnrichedAssignedRoles([...deepActiveRoles, ...pendingRoles]);
        }
      } catch (error) {
        console.error("Critical error during role enrichment", error);
        if (isMounted) setEnrichedAssignedRoles(basicAssignedRoles);
      } finally {
        if (isMounted) setIsEnriching(false);
      }
    };

    enrichRolesWithDeepData();

    return () => {
      isMounted = false;
    };
  }, [triggerDependency, selectedUserId, fetchDeepRoleData]);

  const dynamicAvailableRoles = useMemo(() => {
    let available = masterRoles;
    if (selectedUserId) {
      const assignedRoleIds = new Set(
        basicAssignedRoles.map(r => r.roleId || r.id)
      );
      available = available.filter(r => !assignedRoleIds.has(r.id));
    }
    if (roleSearchQuery) {
      const lower = roleSearchQuery.toLowerCase();
      available = available.filter(r => r.title.toLowerCase().includes(lower));
    }
    return available;
  }, [selectedUserId, basicAssignedRoles, roleSearchQuery, masterRoles]);

  const handleUserSelect = (id: string) => {
    setSelectedUserId(id);
    setRoleSearchQuery("");
    setTempAccessTypes({});
  };

  const setAccessTypeForAvailable = (roleId: string, type: AccessType) => {
    setTempAccessTypes(prev => ({ ...prev, [roleId]: type }));
  };

  const moveRoleToPending = (role: AvailableRole) => {
    if (!selectedUserId) return;
    const fallbackValue =
      accessOptions.length > 0 ? accessOptions[0].value : "";
    const accessValueId = tempAccessTypes[role.id] || fallbackValue;
    const selectedOption = accessOptions.find(
      opt => opt.value === accessValueId
    );
    const displayLabel = selectedOption ? selectedOption.label : "Read";

    const newRole: AssignedRole = {
      ...role,
      roleId: role.id,
      accessLevel: displayLabel,
      permissionId: accessValueId,
      status: "Pending",
      description: `Pending assignment (${displayLabel})`,
    };

    setAssignments(prev => ({
      ...prev,
      [selectedUserId]: [newRole, ...(prev[selectedUserId] || [])],
    }));

    const newTemps = { ...tempAccessTypes };
    delete newTemps[role.id];
    setTempAccessTypes(newTemps);
  };

  const removeRole = (roleId: string) => {
    if (!selectedUserId) return;
    const roleToDelete = assignments[selectedUserId]?.find(
      r => r.id === roleId
    );

    if (roleToDelete?.status === "Pending") {
      setAssignments(prev => ({
        ...prev,
        [selectedUserId]: (prev[selectedUserId] || []).filter(
          r => r.id !== roleId
        ),
      }));
      return;
    }

    if (roleToDelete) {
      setRoleToRemove(roleToDelete);
    }
  };

  const confirmRemoveRole = async () => {
    if (!roleToRemove) return;
    try {
      await deleteRole(roleToRemove.id).unwrap();
      logger.info("Role removed successfully", { toast: true });
      setRoleToRemove(null); // Close the modal on success
    } catch (error) {
      logger.error("Failed to remove role", { toast: true });
      console.log(error);
    }
  };

  const clearAssignedRoles = () => {
    if (!selectedUserId) return;
    setAssignments(prev => {
      const userRoles = prev[selectedUserId] || [];
      const activeRolesOnly = userRoles.filter(r => r.status === "Active");
      return { ...prev, [selectedUserId]: activeRolesOnly };
    });
    setIsClearModalOpen(false);
    logger.info("Cleared pending roles", { toast: true });
  };

  const confirmAssignment = async () => {
    if (!selectedUserId) return;
    const pendingRoles = (assignments[selectedUserId] || []).filter(
      r => r.status === "Pending"
    );
    if (pendingRoles.length === 0) {
      setIsModalOpen(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      for (const role of pendingRoles) {
        await saveRole({
          userIdentity: selectedUserId,
          roleIdentity: role.roleId || "",
          permissionIdentity: role.permissionId || "",
          effectiveFrom: today,
          effectiveTo: "2026-12-31",
          isPrimary: true,
        }).unwrap();
      }

      logger.info("Roles saved successfully", { toast: true });
      setIsModalOpen(false);

      setAssignments(prev => {
        const userRoles = prev[selectedUserId] || [];
        const updatedRoles = userRoles.map(r => ({
          ...r,
          status: "Active" as const,
        }));
        return { ...prev, [selectedUserId]: updatedRoles };
      });
    } catch (error) {
      logger.error("Failed to save roles", { toast: true });
      console.log(error);
    }
  };

  return {
    users: filteredUsers,
    isLoading: isUsersLoading || isAssignmentLoading || isRolesLoading,
    isAssignmentLoading: isEnriching,
    assignments,
    assignedRoles: enrichedAssignedRoles,
    availableRoles: dynamicAvailableRoles,
    selectedUser,
    selectedUserId,
    userSearchQuery,
    roleSearchQuery,
    tempAccessTypes,
    pendingCount,

    roleToRemove,
    setRoleToRemove,
    confirmRemoveRole,

    isModalOpen,
    setIsModalOpen,
    confirmAssignment,
    isClearModalOpen,
    setIsClearModalOpen,
    clearAssignedRoles,
    setUserSearchQuery,
    setRoleSearchQuery,
    handleUserSelect,
    setAccessTypeForAvailable,
    moveRoleToPending,
    removeRole,
    accessOptions,
  };
};
