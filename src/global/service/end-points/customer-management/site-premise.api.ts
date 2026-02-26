import type {
  SitePremiseType,
  SitePremiseResponseDto,
} from "@/types/customer-management/site-premise";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const sitePremiseApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveSitePremise: build.mutation<SitePremiseResponseDto, SitePremiseType>({
      query: payload => ({
        url: api.sitePremise.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: [{ type: "SitePremise", id: "LIST" }],
    }),

    getSitePremises: build.query<SitePremiseResponseDto[], void>({
      query: () => ({
        url: api.sitePremise.get(),
        method: "GET",
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(item => ({
                type: "SitePremise" as const,
                id: item.identity,
              })),
              { type: "SitePremise", id: "LIST" },
            ]
          : [{ type: "SitePremise", id: "LIST" }],
    }),
    deleteSitePremise: build.mutation<void, string>({
      query: identity => ({
        url: `${api.sitePremise.get()}/${identity}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, identity) => [
        { type: "SitePremise", id: identity },
        { type: "SitePremise", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useSaveSitePremiseMutation,
  useGetSitePremisesQuery,
  useDeleteSitePremiseMutation,
} = sitePremiseApiService;
