import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export interface WorkflowDefinitionResponse {
  identity: string;
  workflowName: string;
}

export interface RoleResponse {
  identity: string;
  roleName: string;
  roleCode: string;
}

export const workflowMasterApi = apiInstance.injectEndpoints({
  endpoints: build => ({
    getWorkflowDefinitions: build.query<WorkflowDefinitionResponse[], void>({
      query: () => ({
        url: api.workflowStages.getWorkflowDefinition(),
        method: "GET",
      }),
    }),

    getAssignedRoles: build.query<RoleResponse[], void>({
      query: () => ({
        url: api.workflowStages.getAssignedRoles(),
        method: "GET",
      }),
    }),
  }),
});

export const { useGetWorkflowDefinitionsQuery, useGetAssignedRolesQuery } =
  workflowMasterApi;
