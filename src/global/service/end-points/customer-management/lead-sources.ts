import type {
  LeadSource,
  LeadSourceRequestDto,
  LeadSourceResponseDto,
} from "@/types/customer-management/lead-source";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const leadSourceApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveLeadSource: build.mutation<LeadSourceResponseDto, LeadSourceRequestDto>(
      {
        query: payload => ({
          url: api.leadSources.save(),
          method: "POST",
          data: payload,
        }),
        invalidatesTags: ["LeadSources"],
      }
    ),

    getMasterLeadSources: build.query<LeadSource[], void>({
      query: () => ({
        url: api.leadSources.get(),
        method: "GET",
      }),
      providesTags: ["LeadSources"],

      transformResponse: (response: LeadSourceResponseDto[]): LeadSource[] =>
        response.map(item => ({
          id: item.identity,
          leadSourceName: item.name,
          description: item.description,
        })),
    }),

    deleteLeadSource: build.mutation<void, string>({
      query: leadSourceId => ({
        url: api.leadSources.delete(leadSourceId),
        method: "DELETE",
      }),
      invalidatesTags: ["LeadSources"],
    }),
  }),
});

export const {
  useSaveLeadSourceMutation,
  useGetMasterLeadSourcesQuery,
  useLazyGetMasterLeadSourcesQuery,
  useDeleteLeadSourceMutation,
} = leadSourceApiService;
