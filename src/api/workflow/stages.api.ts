export const workflowStages = {
  save: () => "/api/v1/workflows/stages",
  update: (stageId: string) => `/api/v1/workflows/stages/${stageId}`,
  getByWorkflow: (workflowId: string) =>
    `/api/v1/workflows/stages?workflow=${workflowId}`,
  getById: (stageId: string) => `/api/v1/workflows/stages/${stageId}`,
  getWorkflowDefinition: () => "/api/v1/workflows/get-definition",
  getAssignedRoles: () => "/api/v1/users/role",
};
