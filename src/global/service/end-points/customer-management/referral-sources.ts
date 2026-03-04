import type {
  ReferralSource,
  ReferralSourceRequestDto,
  ReferralSourceResponseDto,
} from "@/types/customer-management/referral-sources";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const referralSourceApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveReferralSource: build.mutation<
      ReferralSourceResponseDto,
      ReferralSourceRequestDto
    >({
      query: payload => ({
        url: api.referralSources.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["ReferralSource"],
    }),

    getReferralSources: build.query<ReferralSource[], void>({
      query: () => ({
        url: api.referralSources.get(),
        method: "GET",
      }),
      providesTags: ["ReferralSource"],

      transformResponse: (
        response: ReferralSourceResponseDto[]
      ): ReferralSource[] =>
        response.map(item => ({
          id: item.identity,
          referralCode: item.code,
          referralName: item.name,
        })),
    }),

    deleteReferralSource: build.mutation<void, string>({
      query: referralSourceId => ({
        url: api.referralSources.delete(referralSourceId),
        method: "DELETE",
      }),
      invalidatesTags: ["ReferralSource"],
    }),
  }),
});

export const {
  useSaveReferralSourceMutation,
  useGetReferralSourcesQuery,
  useLazyGetReferralSourcesQuery,
  useDeleteReferralSourceMutation,
} = referralSourceApiService;
