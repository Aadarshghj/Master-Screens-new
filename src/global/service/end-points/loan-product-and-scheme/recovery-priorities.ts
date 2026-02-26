import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  RecoveryPriorityPayload,
  RecoveryPriorityApiResponse,
} from "@/types/loan-product-and schema Stepper/recovery-priority";

export const recoveryPrioritiesApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getRecoveryPriorities: build.query<
      RecoveryPriorityApiResponse,
      { schemeId: string }
    >({
      query: ({ schemeId }) => ({
        url: api.loanStepper.getRecoveryPriorities({ schemeId }),
        method: "GET",
      }),
      transformResponse: (response: RecoveryPriorityApiResponse) => {
        return response;
      },
      providesTags: ["RecoveryPriority"],
    }),

    createRecoveryPriorities: build.mutation<
      RecoveryPriorityApiResponse,
      { schemeId: string; payload: RecoveryPriorityPayload }
    >({
      query: ({ schemeId, payload }) => ({
        url: api.loanStepper.createRecoveryPriorities({ schemeId }),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["RecoveryPriority"],
    }),

    updateRecoveryPriorities: build.mutation<
      RecoveryPriorityApiResponse,
      { schemeId: string; payload: RecoveryPriorityPayload }
    >({
      query: ({ schemeId, payload }) => ({
        url: api.loanStepper.updateRecoveryPriorities({ schemeId }),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["RecoveryPriority"],
    }),

    deleteRecoveryPriority: build.mutation<
      void,
      { schemeId: string; priorityId: string }
    >({
      query: ({ schemeId, priorityId }) => ({
        url: api.loanStepper.deleteRecoveryPriority({ schemeId, priorityId }),
        method: "DELETE",
      }),
      invalidatesTags: ["RecoveryPriority"],
    }),
  }),
});

export const {
  useGetRecoveryPrioritiesQuery,
  useCreateRecoveryPrioritiesMutation,
  useUpdateRecoveryPrioritiesMutation,
  useDeleteRecoveryPriorityMutation,
} = recoveryPrioritiesApiService;
