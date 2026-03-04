import type {
  DesignationType,
  DesignationRequestDto,
  DesignationResponseDto,
} from "@/types/customer-management/designation";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const designationApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveDesignation: build.mutation<
      DesignationResponseDto,
      DesignationRequestDto
    >({
      query: payload => ({
        url: api.designation.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Designation"],
    }),

    getMasterDesignations: build.query<DesignationType[], void>({
      query: () => ({
        url: api.designation.get(),
        method: "GET",
      }),
      providesTags: ["Designation"],

      transformResponse: (
        response: DesignationResponseDto[]
      ): DesignationType[] =>
        response.map(item => ({
          id: item.identity,
          designationName: item.name,
          designationCode: item.code,
          level: item.level,
          occupation: item.occupationIdentity,
          description: item.description ?? "",
          managerial: item.isManagerial,
        })),
    }),

    deleteDesignation: build.mutation<void, string>({
      query: designationId => ({
        url: api.designation.delete(designationId),
        method: "DELETE",
      }),
      invalidatesTags: ["Designation"],
    }),
  }),
});

export const {
  useSaveDesignationMutation,
  useGetMasterDesignationsQuery,
  useLazyGetMasterDesignationsQuery,
  useDeleteDesignationMutation,
} = designationApiService;
