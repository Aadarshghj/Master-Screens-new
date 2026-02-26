import type {
  ApproverRoleMappingData,
  ApproverRoleMappingSearchForm,
  SaveApproverRoleMappingPayload,
  UpdateApproverRoleMappingPayload,
  ApproverRoleMappingApiResponse,
  ApproverRoleMappingSearchResponse,
  PaginatedApproverRoleMappingResponse,
  BranchOption,
  RoleOption,
  UserOption,
  RegionOption,
  ClusterOption,
  StateOption,
  ApproverRoleMappingByIdResponse,
} from "@/types/approval-workflow/approver-role-mapping.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const approverRoleMappingApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getApproverRoleMappings: build.query<ApproverRoleMappingData[], void>({
      query: () => ({
        url: api.workflow.getApproverRoleMappings(),
        method: "GET",
      }),
      transformResponse: (
        response: ApproverRoleMappingApiResponse[]
      ): ApproverRoleMappingData[] => {
        return response.map(item => ({
          mappingId: item.identity,
          roleCode: item.roleCode,
          userCode: item.userCode,
          branchCode: item.branchCode,
          regionCode: item.regionCode,
          clusterCode: item.clusterCode,
          stateCode: item.stateCode,
          effectiveFrom: item.effectiveFrom,
          effectiveTo: item.effectiveTo,
          isActive: item.active,
          active: item.active,
          status: item.active ? "ACTIVE" : "INACTIVE",
          statusName: item.active ? "ACTIVE" : "INACTIVE",
        }));
      },
    }),

    saveApproverRoleMapping: build.mutation<
      ApproverRoleMappingApiResponse,
      SaveApproverRoleMappingPayload
    >({
      query: payload => ({
        url: api.workflow.saveApproverRoleMapping(),
        method: "POST",
        data: payload,
      }),
    }),

    updateApproverRoleMapping: build.mutation<
      ApproverRoleMappingApiResponse,
      { mappingId: string; payload: UpdateApproverRoleMappingPayload }
    >({
      query: ({ mappingId, payload }) => ({
        url: api.workflow.updateApproverRoleMapping({ mappingId }),
        method: "PUT",
        data: payload,
      }),
    }),

    deleteApproverRoleMapping: build.mutation<void, string>({
      query: mappingId => ({
        url: api.workflow.deleteApproverRoleMapping({ mappingId }),
        method: "DELETE",
      }),
    }),

    searchApproverRoleMappings: build.query<
      ApproverRoleMappingSearchResponse,
      ApproverRoleMappingSearchForm
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        if (params.roleCode && params.roleCode.trim()) {
          queryParams.append("roleCode", params.roleCode.trim());
        }

        if (params.userCode && params.userCode.trim()) {
          queryParams.append("userCode", params.userCode.trim());
        }

        if (params.branchCode && params.branchCode.trim()) {
          queryParams.append("branchCode", params.branchCode.trim());
        }

        if (params.regionCode && params.regionCode.trim()) {
          queryParams.append("regionCode", params.regionCode.trim());
        }

        if (params.clusterCode && params.clusterCode.trim()) {
          queryParams.append("clusterCode", params.clusterCode.trim());
        }

        if (params.stateCode && params.stateCode.trim()) {
          queryParams.append("stateCode", params.stateCode.trim());
        }

        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        return {
          url: `${api.workflow.searchApproverRoleMappings()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: PaginatedApproverRoleMappingResponse) => {
        return {
          content: response.content.map(item => ({
            mappingId: item.identity,
            identity: item.identity,
            roleCode: item.roleCode,
            userCode: item.userCode,
            branchCode: item.branchCode,
            regionCode: item.regionCode,
            clusterCode: item.clusterCode,
            stateCode: item.stateCode,
            effectiveFrom: item.effectiveFrom,
            effectiveTo: item.effectiveTo,
            isActive: item.active,
            active: item.active,
            status: item.active ? "ACTIVE" : "INACTIVE",
            statusName: item.active ? "ACTIVE" : "INACTIVE",
          })),
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          page: response.number,
          size: response.size,
        };
      },
    }),

    getApproverRoleMappingById: build.query<
      ApproverRoleMappingByIdResponse,
      string
    >({
      query: mappingId => ({
        url: api.workflow.getApproverRoleMappingById({ mappingId }),
        method: "GET",
      }),
    }),

    searchRoleCodes: build.query<RoleOption[], string>({
      query: searchTerm => ({
        url: `${api.workflow.searchRoleCodes()}?roleCode=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (response: RoleOption[]): RoleOption[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (response as { content: RoleOption[] }).content || [];
        }
        return [];
      },
    }),

    searchUserCodes: build.query<UserOption[], string>({
      query: searchTerm => ({
        url: `${api.workflow.searchUserCodes()}?userCode=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (response: UserOption[]): UserOption[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (response as { content: UserOption[] }).content || [];
        }
        return [];
      },
    }),

    searchBranchCodes: build.query<BranchOption[], string>({
      query: searchTerm => ({
        url: `${api.workflow.searchBranchCodes()}?branchCode=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (response: BranchOption[]): BranchOption[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (response as { content: BranchOption[] }).content || [];
        }
        return [];
      },
    }),

    searchRegionCodes: build.query<RegionOption[], string>({
      query: searchTerm => ({
        url: `${api.workflow.searchRegionCodes()}?regionCode=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (response: RegionOption[]): RegionOption[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (response as { content: RegionOption[] }).content || [];
        }
        return [];
      },
    }),

    searchClusterCodes: build.query<ClusterOption[], string>({
      query: searchTerm => ({
        url: `${api.workflow.searchClusterCodes()}?clusterCode=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (response: ClusterOption[]): ClusterOption[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (response as { content: ClusterOption[] }).content || [];
        }
        return [];
      },
    }),

    searchStateCodes: build.query<StateOption[], string>({
      query: searchTerm => ({
        url: `${api.workflow.searchStateCodes()}?stateName=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
      transformResponse: (response: StateOption[]): StateOption[] => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "content" in response) {
          return (response as { content: StateOption[] }).content || [];
        }
        return [];
      },
    }),
  }),
});

export const {
  useGetApproverRoleMappingsQuery,
  useSaveApproverRoleMappingMutation,
  useUpdateApproverRoleMappingMutation,
  useDeleteApproverRoleMappingMutation,
  useLazySearchApproverRoleMappingsQuery,
  useLazyGetApproverRoleMappingByIdQuery,
  useLazySearchRoleCodesQuery,
  useLazySearchUserCodesQuery,
  useLazySearchBranchCodesQuery,
  useLazySearchRegionCodesQuery,
  useLazySearchClusterCodesQuery,
  useLazySearchStateCodesQuery,
} = approverRoleMappingApiService;
