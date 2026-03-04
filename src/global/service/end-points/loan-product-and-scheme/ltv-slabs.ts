import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  LTVOnOption,
  LTVSlabPayload,
  LTVOnApiResponse,
  LTVSlabResponse,
  LTVSlabsApiResponse,
} from "@/types/loan-product-and schema Stepper/ltv-slabs.types";

export const ltvSlabsApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLTVOnOptions: build.query<LTVOnOption[], void>({
      query: () => ({
        url: api.loanStepper.getLTVOnOptions(),
        method: "GET" as const,
      }),
      transformResponse: (response: LTVOnApiResponse[]) => {
        return response
          .filter(item => item.isActive)
          .map(item => ({
            value: item.ltvOnIdentity,
            label: item.ltvOnTypeName || "",
          }));
      },
    }),

    getLTVSlabs: build.query<LTVSlabsApiResponse, { schemeId: string }>({
      query: ({ schemeId }) => ({
        url: api.loanStepper.getLTVSlabs({ schemeId }),
        method: "GET",
      }),
      providesTags: ["LTVSlab"],
    }),

    createLTVSlabs: build.mutation<
      LTVSlabResponse,
      { schemeId: string; payload: LTVSlabPayload }
    >({
      query: ({ schemeId, payload }) => ({
        url: api.loanStepper.createLTVSlabs({ schemeId }),
        method: "POST" as const,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["LTVSlab"],
    }),

    updateLTVSlab: build.mutation<
      LTVSlabResponse,
      { schemeId: string; slabId: string; payload: LTVSlabPayload }
    >({
      query: ({ schemeId, slabId, payload }) => ({
        url: api.loanStepper.updateLTVSlab({ schemeId, slabId }),
        method: "PUT" as const,
        data: payload,
      }),
      invalidatesTags: ["LTVSlab"],
    }),

    deleteLTVSlab: build.mutation<void, { schemeId: string; slabId: string }>({
      query: ({ schemeId, slabId }) => ({
        url: api.loanStepper.deleteLTVSlab({ schemeId, slabId }),
        method: "DELETE",
      }),
      invalidatesTags: ["LTVSlab"],
    }),
  }),
});

export const {
  useGetLTVOnOptionsQuery,
  useCreateLTVSlabsMutation,
  useGetLTVSlabsQuery,
  useUpdateLTVSlabMutation,
  useDeleteLTVSlabMutation,
} = ltvSlabsApiService;
