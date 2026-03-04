import { useMemo } from "react";
import { useGetAllDesignationRoleMappingsQuery } from "@/global/service/end-points/customer-management/designation-master.api";

import type { AssignedRole, DesignationProfile } from "../../constants";

export const useDesignationRoleMappingTable = () => {
  const { data: mappingData = [] } = useGetAllDesignationRoleMappingsQuery();

  const groupedData = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        name: string;
        roles: AssignedRole[];
      }
    > = {};

    mappingData.forEach(item => {
      if (!item.isActive) return;

      if (!map[item.designationId]) {
        map[item.designationId] = {
          id: item.designationId,
          name: item.designationName,
          roles: [],
        };
      }

      map[item.designationId].roles.push({
        id: item.roleId,
        title: item.roleName,
        subtitle: "",
        accessLevel: "Read" as const,
        status: "Active" as const,
        description: "Assigned as Read",
      });
    });

    return Object.values(map);
  }, [mappingData]);

  const designations: DesignationProfile[] = useMemo(() => {
    return groupedData.map(d => ({
      id: d.id,
      name: d.name,
      empId: "",
      department: "",
      initial: d.name?.charAt(0) || "",
      color: "bg-blue-600",
      assignedCount: d.roles.length,
    }));
  }, [groupedData]);

  const designationAssignments: Record<string, AssignedRole[]> = useMemo(() => {
    const record: Record<string, AssignedRole[]> = {};

    groupedData.forEach(d => {
      record[d.id] = d.roles;
    });

    return record;
  }, [groupedData]);

  return {
    designations,
    designationAssignments,
  };
};
