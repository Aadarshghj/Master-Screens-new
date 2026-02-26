import type {
  LoanProductItem,
  SchemeTypeItem,
  MaxPeriodTypeItem,
  MinPeriodTypeItem,
  InterestTypeFlagItem,
  RebateOnOptionItem,
  PenalOnOptionItem,
} from "@/types/loan-product-and schema Stepper/create-loan-and-product.types";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const MasterloanProductSchemeApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getLoanProducts: build.query<Array<{ value: string; label: string }>, void>(
      {
        query: () => ({
          url: api.loanMaster.getLoanProducts(),
          method: "GET",
        }),
        transformResponse: (response: LoanProductItem[]) =>
          response.map(item => ({
            value: item.identity || "",
            label: item.loanProductName || "",
          })),
      }
    ),

    getSchemeTypes: build.query<Array<{ value: string; label: string }>, void>({
      query: () => ({
        url: api.loanMaster.getSchemeTypes(),
        method: "GET",
      }),
      transformResponse: (response: SchemeTypeItem[]) =>
        response.map(item => ({
          value: item.identity || "",
          label: item.schemeTypeName || "",
        })),
    }),

    getMaxPeriodTypes: build.query<
      Array<{ value: string; label: string }>,
      void
    >({
      query: () => ({
        url: api.loanMaster.getPeriodTypes(),
        method: "GET",
      }),
      transformResponse: (response: MaxPeriodTypeItem[]) =>
        response.map(item => ({
          value: item.id || item.identity || "",
          label: item.name || item.periodTypeName || "",
        })),
    }),
    getMinPeriodTypes: build.query<
      Array<{ value: string; label: string }>,
      void
    >({
      query: () => ({
        url: api.loanMaster.getPeriodTypes(),
        method: "GET",
      }),
      transformResponse: (response: MinPeriodTypeItem[]) =>
        response.map(item => ({
          value: item.id || item.identity || "",
          label: item.name || item.periodTypeName || "",
        })),
    }),
    getInterestTypes: build.query<
      Array<{ value: string; label: string }>,
      void
    >({
      query: () => ({
        url: api.loanMaster.getInterestTypes(),
        method: "GET",
      }),
      transformResponse: (response: InterestTypeFlagItem[]) =>
        response.map(item => ({
          value: item.id || item.identity || "",
          label: item.name || item.interestTypeName || "",
        })),
    }),

    getPenalInterestBases: build.query<
      Array<{ value: string; label: string }>,
      void
    >({
      query: () => ({
        url: api.loanMaster.getPenalInterestBases(),
        method: "GET",
      }),
      transformResponse: (response: PenalOnOptionItem[]) =>
        response.map(item => ({
          value: item.id || item.identity || "",
          label: item.name || item.penalInterestBaseName || "",
        })),
    }),

    getRebateBases: build.query<Array<{ value: string; label: string }>, void>({
      query: () => ({
        url: api.loanMaster.getRebateBases(),
        method: "GET",
      }),
      transformResponse: (response: RebateOnOptionItem[]) =>
        response.map(item => ({
          value: item.id || item.identity || "",
          label: item.name || item.rebateBaseName || "",
        })),
    }),
  }),
});

export const {
  useGetLoanProductsQuery,
  useGetSchemeTypesQuery,
  useGetMinPeriodTypesQuery,
  useGetMaxPeriodTypesQuery,
  useGetInterestTypesQuery,
  useGetPenalInterestBasesQuery,
  useGetRebateBasesQuery,
} = MasterloanProductSchemeApiService;
