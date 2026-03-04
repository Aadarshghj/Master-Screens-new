import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  InterestSlabRequest,
  InterestSlabResponse,
} from "@/types/loan-product-and schema Stepper/interest-slabs.types";

export const interestSlabApi = apiInstance.injectEndpoints({
  endpoints: builder => ({
    createInterestSlab: builder.mutation<
      InterestSlabResponse,
      { schemeId: string; payload: InterestSlabRequest }
    >({
      query: ({ schemeId, payload }) => {
        const url = api.loanStepper.createInterestSlab({ schemeId });

        return {
          url,
          method: "POST",
          data: payload as unknown as Record<string, unknown>,
        };
      },
      invalidatesTags: ["InterestSlab"],
    }),

    getInterestSlab: builder.query<
      InterestSlabResponse,
      { schemeId: string; slabId: string }
    >({
      query: ({ schemeId, slabId }) => ({
        url: api.loanStepper.getInterestSlab({ schemeId, slabId }),
        method: "GET",
      }),
      providesTags: ["InterestSlab"],
    }),

    getInterestSlabs: builder.query<
      InterestSlabResponse[],
      { schemeId: string }
    >({
      query: ({ schemeId }) => ({
        url: api.loanStepper.getInterestSlabs({ schemeId }),
        method: "GET",
      }),
      providesTags: ["InterestSlab"],
    }),

    updateInterestSlab: builder.mutation<
      InterestSlabResponse,
      { schemeId: string; slabId: string; payload: InterestSlabRequest }
    >({
      query: ({ schemeId, slabId, payload }) => ({
        url: api.loanStepper.updateInterestSlab({ schemeId, slabId }),
        method: "PUT" as const,
        data: payload as unknown as Record<string, unknown>,
      }),
      invalidatesTags: ["InterestSlab"],
    }),

    deleteInterestSlab: builder.mutation<
      void,
      { schemeId: string; slabId: string }
    >({
      query: ({ schemeId, slabId }) => {
        const url = api.loanStepper
          .deleteInterestSlab()
          .replace("{schemeIdentity}", schemeId)
          .replace("{slabIdentity}", slabId);

        return {
          url,
          method: "DELETE",
        };
      },
      invalidatesTags: ["InterestSlab"],
    }),
  }),
});

export const {
  useCreateInterestSlabMutation,
  useGetInterestSlabQuery,
  useGetInterestSlabsQuery,
  useUpdateInterestSlabMutation,
  useDeleteInterestSlabMutation,
} = interestSlabApi;
