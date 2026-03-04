import type {
  Bank,
  BankRequestDto,
  BankResponseDto,
  Country,
  CountryResponseDto,
} from "@/types/customer-management/bank";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export const bankApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    saveBank: build.mutation<BankResponseDto, BankRequestDto>({
      query: payload => ({
        url: api.bank.save(),
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Bank"],
    }),

    getMasterBanks: build.query<Bank[], void>({
      query: () => ({
        url: api.bank.get(),
        method: "GET",
      }),
      providesTags: ["Bank"],
      transformResponse: (response: BankResponseDto[]): Bank[] =>
        response.map(item => ({
          id: item.identity,
          bankCode: item.code,
          bankName: item.name,
          swiftBicCode: item.swiftBic,
          country: item.countryIdentity,
          psu: item.isPsu ?? false,
        })),
    }),

    getCountries: build.query<Country[], void>({
      query: () => ({
        url: api.bank.getCountries(),
        method: "GET",
      }),
      providesTags: ["Country"],
      transformResponse: (response: CountryResponseDto[]): Country[] =>
        response.map(item => ({
          id: item.identity,
          countryId: item.countryId,
          countryName: item.country,
          isActive: item.isActive,
        })),
    }),

    deleteBank: build.mutation<void, string>({
      query: bankId => ({
        url: api.bank.delete(bankId),
        method: "DELETE",
      }),
      invalidatesTags: ["Bank"],
    }),
  }),
});

export const {
  useSaveBankMutation,
  useGetMasterBanksQuery,
  useLazyGetMasterBanksQuery,
  useDeleteBankMutation,
  useGetCountriesQuery,
  useLazyGetCountriesQuery,
} = bankApiService;
