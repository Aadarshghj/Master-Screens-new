export const workflow = {
  saveWorkflowDefinition: () => "/api/v1/workflows/definitions",
  updateWorkflowDefinition: ({ definitionId }: { definitionId: string }) =>
    `/api/v1/workflows/definitions/${definitionId}`,
  deleteWorkflowDefinition: ({ definitionId }: { definitionId: string }) =>
    `/api/v1/workflows/definitions/${definitionId}`,
  searchWorkflowDefinitions: () => "/api/v1/workflows/definitions",
  getWorkflowDefinitionById: ({ definitionId }: { definitionId: string }) =>
    `/api/v1/workflows/definitions/${definitionId}`,

  // Workflow Stages
  saveWorkflowStage: () => "/api/v1/workflows/stages",
  getWorkflowStage: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/stages/${identity}`,
  updateWorkflowStage: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/stages/${identity}`,
  deleteWorkflowStage: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/stages/${identity}`,
  filterWorkflowStages: ({
    workflowIdentity,
    page,
    size,
  }: {
    workflowIdentity?: string;
    page?: number;
    size?: number;
  }) => {
    const params = new URLSearchParams();
    if (workflowIdentity) params.append("workflowIdentity", workflowIdentity);
    if (page !== undefined) params.append("page", page.toString());
    if (size !== undefined) params.append("size", size.toString());
    return `/api/v1/workflows/stages?${params.toString()}`;
  },

  // User Roles
  getAssignedRoles: ({ roleCode = "" }: { roleCode?: string } = {}) =>
    `/api/v1/workflows/role/search?roleCode=${encodeURIComponent(roleCode)}`,
  getWorkflowDefinition: () => "/api/v1/workflows/get-definition",
  getLevelOrders: ({ workflow }: { workflow: string }) =>
    `/api/v1/workflows/stages?workflowIdentity=${workflow}`,

  // Workflow Amount Rules
  getWorkflowsForAmount: () => "/api/v1/workflows/get-definition",
  getApprovalFlows: ({ roleCode = "" }: { roleCode?: string } = {}) =>
    `/api/v1/workflows/role/search?roleCode=${encodeURIComponent(roleCode)}`,
  getAssignedRolesByWorkflow: ({
    workflowIdentity,
  }: {
    workflowIdentity: string;
  }) => `/api/v1/workflows/${workflowIdentity}/assigned-roles`,
  getAmountOnOptions: () => "/api/v1/master/amount-on",
  searchWorkflowAmountRules: ({
    workflow,
    page,
    size,
  }: {
    workflow?: string;
    page?: number;
    size?: number;
  }) => {
    const params = new URLSearchParams();
    if (workflow && workflow !== "all")
      params.append("workflowIdentity", workflow);
    if (page !== undefined) params.append("page", page.toString());
    if (size !== undefined) params.append("size", size.toString());
    return `/api/v1/workflows/amount-rules?${params.toString()}`;
  },
  createWorkflowAmountRule: () => "/api/v1/workflows/amount-rules",
  updateWorkflowAmountRule: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/amount-rules/${identity}`,
  deleteWorkflowAmountRule: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/amount-rules/${identity}`,
  toggleWorkflowAmountRuleStatus: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/amount-rules/${identity}/status`,

  // User Delegation
  getworkflowUsers: ({ user = "" }: { user?: string } = {}) =>
    `/api/v1/users/get-user?user=${encodeURIComponent(user)}`,
  getAllUsers: () => "/api/v1/users",
  getUserDelegations: () => "/api/v1/user/user-leave-status/search",
  searchUserDelegations: () => "/api/v1/workflows/delegation",
  createUserDelegation: () => "/api/v1/workflows/delegations",
  updateUserDelegation: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/delegations/${identity}`,
  deleteUserDelegation: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/delete-delegation/${identity}`,
  getModulesForDelegation: () => "/api/v1/master/workflow/get-module",

  // workflow actions
  getWorkflowActions: () => "/api/v1/workflows/actions",
  searchWorkflowActions: () => "/api/v1/workflows/actions",
  getWorkflowActionsInTable: () => "/api/v1/workflows/actions",
  saveWorkflowAction: () => "/api/v1/workflows/actions",
  updateWorkflowAction: ({ actionId }: { actionId: string }) =>
    `/api/v1/workflows/actions/${actionId}`,
  deleteWorkflowAction: ({ actionId }: { actionId: string }) =>
    `/api/v1/workflows/actions/${actionId}`,
  autoPopulateWorkflowActions: ({
    workflowIdentity,
  }: {
    workflowIdentity: string;
  }) => `/api/v1/workflows/actions/auto-populate/${workflowIdentity}`,
  getLinkedStagesByWorkflow: ({
    workflowIdentity,
  }: {
    workflowIdentity: string;
  }) => `/api/v1/workflows/stages/all?workflowIdentity=${workflowIdentity}`,

  // Approver Role Mapping endpoints
  getApproverRoleMappings: () => "/api/v1/workflows/role-mappings",
  saveApproverRoleMapping: () => "/api/v1/workflows/role-mappings",
  updateApproverRoleMapping: ({ mappingId }: { mappingId: string }) =>
    `/api/v1/workflows/role-mappings/${mappingId}`,
  deleteApproverRoleMapping: ({ mappingId }: { mappingId: string }) =>
    `/api/v1/workflows/role-mappings/${mappingId}`,
  searchApproverRoleMappings: () => "/api/v1/workflows/role-mappings/search",
  getApproverRoleMappingById: ({ mappingId }: { mappingId: string }) =>
    `/api/v1/workflows/role-mappings/${mappingId}`,

  // Workflow Masters endpoints
  getModules: () => "/api/v1/master/modules",
  getSubModulesByModule: ({ moduleId }: { moduleId: string }) =>
    `/api/v1/master/sub-module?moduleIdentity=${moduleId}`,

  // user leave status
  postUserLeaveStatus: () => "/api/v1/workflows/leave-status",
  filterUserLeaveStatus: () => "/api/v1/workflows/leave-status/search",
  gettUserLeaveStatusById: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/leave-status/${identity}`,
  deleteUserLeaveStatus: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/leave-status/${identity}`,
  updateUserLeaveStatus: ({ identity }: { identity: string }) =>
    `/api/v1/workflows/leave-status/${identity}`,
  getBranch: () => "/api/v1/master/branches/search",
  getUserDetails: () => "/api/v1/users/search",
  getUserStatus: () => "/api/v1/workflows/status",
  bulkImportLeaveStatus: () => "/api/v1/workflows/leave-status/bulk-import",
  bulkImportStatus: () => "/api/v1/workflows/leave-status/bulk-import",
  getHistoryLeaveStatusBatches: () =>
    "/api/v1/workflows/leave-status/import-batches/search",
  getSingleHistoryLeaveStatusDetails: ({ batchId }: { batchId: string }) =>
    `/api/v1/workflows/leave-status/import-batches/${batchId}`,
  getUsers: () => "/api/v1/users",
  // approval queue
  filterApprovalQueue: () => "/api/v1/workflows/queue",
  workflowDefnitions: () => "/api/v1/workflows/get-definition",
  getWorkflows: () => "/loan/masters/workflows",
  getLinkedStages: ({ workflowIdentity }: { workflowIdentity: string }) =>
    `/api/v1/workflows/stages/all?workflowIdentity=${workflowIdentity}`,
  getWorkflowAction: () => "/api/v1/master/actions",
  approveWorkflow: () => "/api/v1/workflows/action",
  searchRoleCodes: () => "/api/v1/workflows/role/search",
  searchUserCodes: () => "/api/v1/users/search",
  searchBranchCodes: () => "/api/v1/master/branches/search",
  searchRegionCodes: () => "/api/v1/workflows/region/search",
  searchClusterCodes: () => "/api/v1/workflows/cluster/search",
  searchStateCodes: () => "/api/v1/master/states/search",
};
