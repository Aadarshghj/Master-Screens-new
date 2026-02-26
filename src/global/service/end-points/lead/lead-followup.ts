import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import type {
  LeadFollowupHistorySearchParams,
  LeadFollowupHistoryResponse,
  SaveLeadFollowupPayload,
  BulkSaveLeadFollowupPayload,
  LeadFollowupSearchResponse,
  LeadFollowupSearchRequest,
  UpdateLeadFollowupPayload,
} from "@/types/lead/lead-followup.types";

export const leadFollowupApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    searchLeadFollowup: build.query<
      LeadFollowupSearchResponse,
      LeadFollowupSearchRequest
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        if (params.leadName) {
          queryParams.append("leadName", params.leadName);
        }
        queryParams.append("staffIdentity", params.staffId || "");
        queryParams.append(
          "followUpTypeIdentity",
          params.followUpTypeIdentity || ""
        );
        queryParams.append("leadStageIdentity", params.leadStageIdentity || "");
        queryParams.append("leadDate", params.leadDateFrom || "");
        queryParams.append("nextFollowupDate", params.leadDateTo || "");
        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        return {
          url: `${api.lead.searchLeadFollowups()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    saveLeadFollowup: build.mutation<
      { message: string },
      { leadId: string; payload: SaveLeadFollowupPayload }
    >({
      query: ({ leadId, payload }) => ({
        url: api.lead.saveLeadFollowup({ leadId }),
        method: "POST",
        data: payload,
      }),
    }),

    bulkSaveLeadFollowup: build.mutation<
      { message: string },
      BulkSaveLeadFollowupPayload
    >({
      query: payload => ({
        url: api.lead.bulkSaveLeadFollowup(),
        method: "POST",
        data: payload,
      }),
    }),

    searchFollowupHistories: build.query<
      LeadFollowupHistoryResponse,
      LeadFollowupHistorySearchParams
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        if (params.leadIdentity) {
          queryParams.append("leadName", params.leadIdentity);
        }
        if (params.staffId !== undefined) {
          queryParams.append("staffId", params.staffId.toString());
        }
        if (params.followUpTypeIdentity) {
          queryParams.append(
            "followUpTypeIdentity",
            params.followUpTypeIdentity
          );
        }
        if (params.leadStageIdentity) {
          queryParams.append("leadStageIdentity", params.leadStageIdentity);
        }
        if (params.leadDateFrom) {
          queryParams.append("leadDateFrom", params.leadDateFrom);
        }
        if (params.leadDateTo) {
          queryParams.append("leadDateTo", params.leadDateTo);
        }

        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        return {
          url: `${api.lead.searchFollowupHistory()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
    }),

    searchFollowupHistory: build.query<
      LeadFollowupHistoryResponse,
      LeadFollowupHistorySearchParams
    >({
      query: params => {
        const queryParams = new URLSearchParams();
        queryParams.append("leadName", params.leadIdentity || "");
        queryParams.append("staffIdentity", params.staffId?.toString() || "");
        queryParams.append(
          "followUpTypeIdentity",
          params.followUpTypeIdentity || ""
        );
        queryParams.append("leadStageIdentity", params.leadStageIdentity || "");
        queryParams.append("leadDate", params.leadDateFrom || "");
        queryParams.append("nextFollowupDate", params.leadDateTo || "");
        queryParams.append("page", params.page.toString());
        queryParams.append("size", params.size.toString());

        return {
          url: `${api.lead.searchFollowupHistory()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformErrorResponse: response => {
        if (response.status === 404) {
          return {
            data: {
              histories: [],
              totalPages: 0,
              totalElements: 0,
            },
            error: response,
          };
        }
        return response;
      },
    }),

    getLeadFollowupHistory: build.query<
      LeadFollowupHistoryResponse,
      { leadIdentity: string; page?: number; size?: number }
    >({
      query: ({ leadIdentity, page = 0, size = 10 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append("page", page.toString());
        queryParams.append("size", size.toString());

        return {
          url: `${api.lead.getLeadFollowupHistory({ leadIdentity })}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformErrorResponse: response => {
        if (response.status === 404) {
          return {
            data: {
              history: [],
              totalPages: 0,
              totalElements: 0,
              message: "No history found",
            },
            error: response,
          };
        }
        return response;
      },
    }),

    updateLeadFollowup: build.mutation<
      { message: string },
      {
        leadIdentity: string;
        payload: UpdateLeadFollowupPayload;
      }
    >({
      query: ({ leadIdentity, payload }) => ({
        url: api.lead.updateLeadFollowup({ leadIdentity }),
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const {
  useSearchLeadFollowupQuery,
  useSaveLeadFollowupMutation,
  useBulkSaveLeadFollowupMutation,
  useSearchFollowupHistoryQuery,
  useGetLeadFollowupHistoryQuery,
  useLazyGetLeadFollowupHistoryQuery,
  useUpdateLeadFollowupMutation,
} = leadFollowupApiService;
