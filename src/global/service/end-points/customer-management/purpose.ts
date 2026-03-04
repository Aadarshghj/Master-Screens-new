import type {
  PurposeResponseDto,
  Purpose,
  PurposeRequestDto,
} from "@/types/customer-management/purpose";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const purposeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    savePurpose: build.mutation<PurposeResponseDto, PurposeRequestDto>({
      query: payload => ({
        url: api.purposes.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Purpose"],
    }),

    getPurposes: build.query<Purpose[], void>({
      query: () => ({
        url: api.purposes.get(),
        method: "GET",
      }),
      providesTags: ["Purpose"],

      transformResponse: (response: PurposeResponseDto[]): Purpose[] =>
        response.map(item => ({
          id: item.identity,
          purposeType: item.name,
          purposeCode: item.code,
        })),
    }),

    deletePurpose: build.mutation<void, string>({
      query: purposeId => ({
        url: api.purposes.delete(purposeId),
        method: "DELETE",
      }),
      invalidatesTags: ["Purpose"],
    }),
  }),
});

export const {
  useSavePurposeMutation,
  useGetPurposesQuery,
  useLazyGetPurposesQuery,
  useDeletePurposeMutation,
} = purposeApiService;
