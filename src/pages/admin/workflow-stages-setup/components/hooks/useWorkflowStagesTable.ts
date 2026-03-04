import { useMemo, useState } from "react";
import {
  useGetAssignedRolesQuery,
  useGetWorkflowDefinitionsQuery,
} from "@/global/service/end-points/workflow/workflow-master-api";
import type { WorkflowStageRow } from "@/types/admin/workflow-stages";

export const useStagesSetupTable = (data: WorkflowStageRow[]) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>("All");

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

  const filteredData = useMemo(() => {
    if (selectedWorkflow === "All") return data;
    return data.filter(item => item.workflowIdentity === selectedWorkflow);
  }, [data, selectedWorkflow]);

  const getWorkflowName = (workflowId: string) => {
    const wf = workflowData.find(w => w.identity === workflowId);
    return wf?.workflowName ?? "-";
  };

  const getRoleName = (roleId: string) => {
    const role = rolesData.find(r => r.identity === roleId);
    return role?.roleName ?? "-";
  };

  return {
    filteredData,

    selectedWorkflow,
    setSelectedWorkflow,
    workflowOptions,
    getWorkflowName,
    getRoleName,
  };
};
