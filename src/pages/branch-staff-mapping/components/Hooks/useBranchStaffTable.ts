import { useMemo } from "react";
import type {
  AssignedStaff,
  Branch,
  assignedStaffApiResponse,
} from "@/types/branch-staff-mapping/branch-staff";
import {
  useGetAllBranchStaffMappingsQuery,
} from "@/global/service/end-points/branch-staff-mapping/branch-staff-mapping";

export const useBranchStaffMappingTable = () => {
  const { data: mappingData = [] } =
    useGetAllBranchStaffMappingsQuery();

  const groupedData = useMemo(() => {
    const map: Record<
      string,
      {
        id: string;
        name: string;
        staff: AssignedStaff[];
      }
    > = {};

    (mappingData as assignedStaffApiResponse[]).forEach((item) => {
      if (!map[item.branchIdentity]) {
        map[item.branchIdentity] = {
          id: item.branchIdentity,
          name: item.branchName,
          staff: [],
        };
      }

      map[item.branchIdentity].staff.push({
        identity: item.identity,
        staffName: item.staffName,
        staffIdentity: item.staffIdentity,
        branchName: item.branchName,
        branchIdentity: item.branchIdentity,
        status: item.isActive ? "Active" : "Pending",
        isActive: item.isActive,
      });
    });

    return Object.values(map);
  }, [mappingData]);

  const branches: Branch[] = useMemo(() => {
    return groupedData.map((b) => ({
      id: b.id,
      branchName: b.name,
      branchCode: "",
    }));
  }, [groupedData]);

  const branchAssignments: Record<string, AssignedStaff[]> =
    useMemo(() => {
      const record: Record<string, AssignedStaff[]> = {};
      groupedData.forEach((b) => {
        record[b.id] = b.staff;
      });
      return record;
    }, [groupedData]);

  return {
    branches,
    branchAssignments,
  };
};