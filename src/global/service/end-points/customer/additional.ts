import type {
  AdditionalOptionalResponse,
  AdditionalOptionalConfig,
  MoreDetailsConfig,
  SaveAdditionalOptionalPayload,
} from "@/types/customer/additional.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const additionalApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getAdditionalOptional: build.query<AdditionalOptionalResponse, string>({
      query: customerId => ({
        url: api.customer.getAdditionalOptional({ customerId }),
        method: "GET",
      }),
    }),

    saveAdditionalOptional: build.mutation<
      { message: string; data: AdditionalOptionalResponse },
      { customerId: string; payload: SaveAdditionalOptionalPayload }
    >({
      query: ({ customerId, payload }) => ({
        url: api.customer.saveAdditionalOptional({ customerId }),
        method: "PUT" as const,
        data: payload as unknown as Record<string, unknown>,
      }),
    }),

    getAdditionalOptionalConfig: build.query<AdditionalOptionalConfig, void>({
      query: () => ({
        url: api.customer.getAdditionalOptionalConfig(),
        method: "GET",
      }),
    }),

    getMoreDetailsConfig: build.query<MoreDetailsConfig[], string>({
      query: customerId => ({
        url: api.customer.getMoreDetailsConfig({ customerId }),
        method: "GET",
      }),
    }),
    getAdditionalReferenceNames: build.query<MoreDetailsConfig[], string>({
      query: (tenantIdentity: string) => ({
        url: api.customer.getAdditionalReferenceNames({ tenantIdentity }),
        method: "GET",
      }),
      transformResponse: (
        response: MoreDetailsConfig[] | { data: MoreDetailsConfig[] }
      ) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === "object" && "data" in response) {
          return response.data;
        }
        return [];
      },
    }),
  }),
});

export const {
  useGetAdditionalOptionalQuery,
  useSaveAdditionalOptionalMutation,
  useGetAdditionalOptionalConfigQuery,
  useGetMoreDetailsConfigQuery,
  useGetAdditionalReferenceNamesQuery,
} = additionalApiService;
