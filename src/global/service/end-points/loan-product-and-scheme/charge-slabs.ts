import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export const chargeSlabsApiService = apiInstance.injectEndpoints({
  endpoints: builder => ({
    createChargeSlab: builder.mutation({
      query: ({ schemeId, payload }) => ({
        url: api.loanStepper.createChargeSlab({ schemeId }),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["ChargeSlabs"],
    }),
    getChargeSlabs: builder.query({
      query: ({ schemeId, active }) => ({
        url: api.loanStepper.getChargeSlabs({ schemeId, active }),
        method: "GET",
      }),
      providesTags: ["ChargeSlabs"],
    }),
    getSchemeChargeSlabs: builder.query({
      query: ({ schemeId, page = 0, size = 20 }) => ({
        url: api.loanStepper.getSchemeChargeSlabs({ schemeId, page, size }),
        method: "GET",
      }),
      providesTags: ["ChargeSlabs"],
    }),
    updateChargeSlab: builder.mutation({
      query: ({ schemeId, slabId, payload }) => ({
        url: api.loanStepper.updateChargeSlab({ schemeId, slabId }),
        method: "PUT",
        data: payload,
      }),
      invalidatesTags: ["ChargeSlabs"],
    }),
    deleteChargeSlab: builder.mutation({
      query: ({ schemeId, slabId }) => ({
        url: api.loanStepper.deleteChargeSlab({ schemeId, slabId }),
        method: "DELETE",
      }),
      invalidatesTags: ["ChargeSlabs"],
    }),
    getCharges: builder.query({
      query: () => ({
        url: "/api/v1/master/charges",
        method: "GET",
      }),
    }),
    getRateTypes: builder.query({
      query: () => ({
        url: "/api/v1/master/rate-type",
        method: "GET",
      }),
    }),
    getChargeOnOptions: builder.query({
      query: () => ({
        url: "/api/v1/master/calculation-bases",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateChargeSlabMutation,
  useGetChargeSlabsQuery,
  useGetSchemeChargeSlabsQuery,
  useUpdateChargeSlabMutation,
  useDeleteChargeSlabMutation,
  useGetChargesQuery,
  useGetRateTypesQuery,
  useGetChargeOnOptionsQuery,
} = chargeSlabsApiService;
