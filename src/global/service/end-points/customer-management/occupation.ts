import type {
  OccupationRequestDto,
  OccupationResponseDto,
  OccupationTableRow,
} from "@/types/customer-management/occupation";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const occupationApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveOccupation: build.mutation<OccupationResponseDto, OccupationRequestDto>(
      {
        query: payload => ({
          url: api.occupation.save(),
          method: "POST",
          data: payload,
        }),
        invalidatesTags: ["Occupation"],
      }
    ),

    getOccupations: build.query<OccupationTableRow[], void>({
      query: () => ({
        url: api.occupation.get(),
        method: "GET",
      }),
      providesTags: ["Occupation"],

      transformResponse: (
        response: OccupationResponseDto[]
      ): OccupationTableRow[] =>
        response.map(item => ({
          value: item.identity,
          label: item.occupationName,
        })),
    }),

    deleteOccupation: build.mutation<void, string>({
      query: occupationId => ({
        url: api.occupation.delete(occupationId),
        method: "DELETE",
      }),
      invalidatesTags: ["Occupation"],
    }),
  }),
});

export const {
  useSaveOccupationMutation,
  useGetOccupationsQuery,
  useLazyGetOccupationsQuery,
  useDeleteOccupationMutation,
} = occupationApiService;
