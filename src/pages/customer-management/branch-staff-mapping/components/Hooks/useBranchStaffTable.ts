import { useMemo } from "react";
import type {
  AssignedStaff,
  Branch,
  staffApiResponse,
  assignedStaffApiResponse,
} from "@/types/customer-management/branch-staff";
import {
  useGetAllBranchStaffMappingsQuery,
  useGetAllStaffQuery,
} from "@/global/service/end-points/customer-management/branch-staff-mapping";

export const useBranchStaffMappingTable = () => {

  const { data: allStaff = [] } = useGetAllStaffQuery();
  const { data: mappingData = [] } = useGetAllBranchStaffMappingsQuery();


  const staffCodeMap = useMemo(() => {
    const map: Record<string, string> = {};
    (allStaff as staffApiResponse[]).forEach((staff) => {
      map[staff.identity] = staff.staffCode;
    });
    return map;
  }, [allStaff]);

  const groupedData = useMemo(() => {
    const map: Record<
      string,
      { id: string; name: string; staff: AssignedStaff[] }
    > = {};

    (mappingData as assignedStaffApiResponse[]).forEach((item) => {
      if (!map[item.branchIdentity]) {
        map[item.branchIdentity] = {
          id: item.branchIdentity,
          name: item.branchName,
          staff: [],
        };
      }

      const staffCode =
        staffCodeMap[item.staffIdentity] ||
        allStaff.find((s) => s.staffName === item.staffName)?.staffCode ||
        "";

      map[item.branchIdentity].staff.push({
        identity: item.identity,
        staffIdentity: item.staffIdentity,
        staffName: item.staffName,
        staffCode,
        branchName: item.branchName,
        branchIdentity: item.branchIdentity,
        status: item.isActive ? "Active" : "Pending",
        isActive: item.isActive,
      });
    });

    return Object.values(map);
  }, [mappingData, staffCodeMap, allStaff]);


  const branches: Branch[] = useMemo(
    () =>
      groupedData.map((b) => ({
        id: b.id,
        branchName: b.name,
        branchCode: "",
        adminUnitTypeIdentity: "",
      })),
    [groupedData]
  );


  const branchAssignments: Record<string, AssignedStaff[]> = useMemo(() => {
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