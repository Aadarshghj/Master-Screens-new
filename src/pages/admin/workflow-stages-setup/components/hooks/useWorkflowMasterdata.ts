import { useMemo } from "react";
import {
  useGetAssignedRolesQuery,
  useGetWorkflowDefinitionsQuery,
} from "@/global/service/end-points/workflow/workflow-master-api";

export const useWorkflowMasterData = () => {
  const { data: workflowData = [] } = useGetWorkflowDefinitionsQuery();
  const { data: rolesData = [] } = useGetAssignedRolesQuery();

  const workflowOptions = useMemo(
    () =>
      workflowData.map(item => ({
        label: item.workflowName,
        value: item.identity,
      })),
    [workflowData]
  );

  const roleOptions = useMemo(
    () =>
      rolesData.map(item => ({
        label: item.roleName,
        value: item.identity,
      })),
    [rolesData]
  );

  return {
    workflowData,
    rolesData,
    workflowOptions,
    roleOptions,
  };
};
