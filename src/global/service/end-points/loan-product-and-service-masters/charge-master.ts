import type {
  ChargeDetailsData,
  SaveChargeDetailsPayload,
  UpdateChargeDetailsPayload,
  ChargeMasterApiResponse,
  ChargeSearchFormData,
  ConfigOption,
  GLAccount,
  ZoneOption,
  StateZoneConfig,
  PaginatedChargeSearchResponse,
  SaveChargeMasterPayload,
  SaveChargeMasterResponse,
  // ModuleConfigOption,
} from "@/types/loan-product-and-scheme-masters/charge-master.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";

interface CalculationCriteriaItem {
  criteriaName: string;
  identity: string;
  isActive: boolean;
}
// interface ModuleItem {
//   moduleName: string;
//   identity: string;
//   isActive: boolean;
//   subModules: SubModuleItem[];
// }
// interface SubModuleItem {
//   subModuleName: string;
//   identity: string;
//   isActive: boolean;
//   subModuleCode: string;
// }

export const chargeMasterApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getChargeDetails: build.query<ChargeDetailsData[], void>({
      query: () => ({
        url: api.loan.getChargeDetails(),
        method: "GET",
      }),
      transformResponse: (
        response: ChargeMasterApiResponse[]
      ): ChargeDetailsData[] => {
        return response.map(item => ({
          chargeId: item.identity,
          chargeCode: item.chargeCode,
          chargeName: item.chargeName,
          module: item.module,
          subModule: item.subModule,
          calculationOn: item.calculationOn,
          chargeCalculation: item.chargeCalculation,
          chargeIncomeGLAccount: item.chargeIncomeGLAccount,
          monthAmount: item.monthAmount,
          calculationCriteria: item.calculationCriteria,
          chargesPostingRequired: item.chargesPostingRequired,
          isActive: item.active,
        }));
      },
    }),

    saveChargeDetails: build.mutation<
      ChargeMasterApiResponse,
      SaveChargeDetailsPayload
    >({
      query: payload => ({
        url: api.loan.saveChargeDetails(),
        method: "POST",
        data: payload,
      }),
    }),

    updateChargeDetails: build.mutation<
      ChargeMasterApiResponse,
      { chargeId: string; payload: UpdateChargeDetailsPayload }
    >({
      query: ({ chargeId, payload }) => ({
        url: api.loan.updateChargeDetails({ chargeId }),
        method: "PUT",
        data: payload,
      }),
    }),

    deleteChargeDetails: build.mutation<void, string>({
      query: chargeId => ({
        url: api.loan.deleteChargeDetails({ chargeId }),
        method: "DELETE",
      }),
    }),

    getChargeDetailsById: build.query<ChargeMasterApiResponse, string>({
      query: chargeId => ({
        url: api.loan.getChargeDetailsById({ chargeId }),
        method: "GET",
      }),
    }),

    saveChargeMasterConfiguration: build.mutation<
      SaveChargeMasterResponse,
      SaveChargeMasterPayload
    >({
      query: payload => ({
        url: api.loan.saveChargeMaster(),
        method: "POST",
        data: payload,
      }),
      transformResponse: (response: SaveChargeMasterResponse) => {
        return response;
      },
    }),

    getCalculationBase: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getCalculationBase(),
        method: "GET",
      }),
      transformResponse: (
        response: Array<{ identity: string; name: string }>
      ) => {
        return response.map(item => ({
          value: item.identity,
          label: item.name,
          identity: item.identity,
        }));
      },
    }),

    getCalculationType: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getCalculationType(),
        method: "GET",
      }),
      transformResponse: (
        response: Array<{ identity: string; name: string }>
      ) => {
        return response.map(item => ({
          value: item.identity,
          label: item.name,
          identity: item.identity,
        }));
      },
    }),

    getChargeSlabGLAccount: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getChargeSlabGLAccount(),
        method: "GET",
      }),
      transformResponse: (
        response: Array<{ identity: string; name: string }>
      ) => {
        return response.map(item => ({
          value: item.identity,
          label: item.name,
          identity: item.identity,
        }));
      },
    }),

    getCalculationCriteria: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getCalculationCriteria(),
        method: "GET",
      }),

      transformResponse: (response: CalculationCriteriaItem[]) => {
        return response.map(item => ({
          value: item.identity,
          label: item.criteriaName,
          identity: item.identity,
        }));
      },
    }),

    getMonthAmountTypes: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getMonthAmountTypes(),
        method: "GET",
      }),
      transformResponse: (
        response: Array<{ identity: string; name: string }>
      ) => {
        return response.map(item => ({
          value: item.identity,
          label: item.name,
          identity: item.identity,
        }));
      },
    }),

    // getModules: build.query<ModuleConfigOption[], void>({
    //   query: () => ({
    //     url: api.loan.getModules(),
    //     method: "GET",
    //   }),
    //   transformResponse: (response: ModuleItem[]): ModuleConfigOption[] => {
    //     return response.map(item => ({
    //       value: item.identity,
    //       label: item.moduleName,
    //       identity: item.identity,
    //       subModules: item.subModules.map(sub => ({
    //         identity: sub.identity,
    //         subModuleName: sub.subModuleName,
    //         subModuleCode: sub.subModuleCode,
    //         isActive: sub.isActive,
    //       })),
    //     }));
    //   },
    // }),

    searchGLAccountsFour: build.query<GLAccount[], string | undefined>({
      query: search => ({
        url: api.loan.searchGLAccountsLevelFour({ search }),
        method: "GET" as const,
      }),
    }),

    getZones: build.query<ZoneOption[], void>({
      query: () => ({
        url: api.loan.getZones(),
        method: "GET",
      }),
    }),

    getStateZoneConfig: build.query<StateZoneConfig[], void>({
      query: () => ({
        url: api.loan.getStateZoneConfig(),
        method: "GET",
      }),
    }),

    getTaxTreatments: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getTaxTreatments(),
        method: "GET",
      }),
      transformResponse: (
        response: Array<{ identity: string; name: string }>
      ) => {
        return response.map(item => ({
          value: item.identity,
          label: item.name,
          identity: item.identity,
        }));
      },
    }),

    getSingleTaxMethods: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.loan.getSingleTaxMethods(),
        method: "GET",
      }),
      transformResponse: (
        response: Array<{ identity: string; name: string }>
      ) => {
        return response.map(item => ({
          value: item.identity,
          label: item.name,
          identity: item.identity,
        }));
      },
    }),

    searchChargeDetails: build.query<
      PaginatedChargeSearchResponse,
      ChargeSearchFormData & { page: number; size: number }
    >({
      query: params => {
        const queryParams: Record<string, string> = {};

        if (params.chargeCode && params.chargeCode.trim() !== "") {
          queryParams.chargeCode = params.chargeCode.trim();
        }
        if (params.chargeName && params.chargeName.trim() !== "") {
          queryParams.chargeName = params.chargeName.trim();
        }
        if (params.module && params.module.trim() !== "") {
          queryParams.module = params.module.trim();
        }

        queryParams.page = String(params.page ?? 0);
        queryParams.size = String(params.size ?? 10);

        const queryString = new URLSearchParams(queryParams).toString();

        return {
          url: `${api.loan.searchChargeDetails()}?${queryString}`,
          method: "GET",
        };
      },

      transformResponse: (response: {
        content: Array<{
          identity: string;
          chargeCode: string;
          chargeName: string;
          moduleIdentity: string;
          subModuleIdentity: string;
          calculationBasisIdentity: string;
          calculationTypeIdentity: string;
          incomeGlAccountIdentity: string;
          monthAmountTypeIdentity: string;
          calculationCriteriaIdentity: string;
          chargesPostingRequired: boolean;
          isActive?: boolean;
        }>;
        totalPages: number;
        totalElements: number;
        number: number;
        size: number;
      }): PaginatedChargeSearchResponse => {
        return {
          content: response.content.map(item => ({
            chargeId: item.identity,
            chargeCode: item.chargeCode,
            chargeName: item.chargeName,
            module: item.moduleIdentity,
            subModule: item.subModuleIdentity,
            calculationOn: item.calculationBasisIdentity,
            chargeCalculation: item.calculationTypeIdentity,
            chargeIncomeGLAccount: item.incomeGlAccountIdentity,
            monthAmount: item.monthAmountTypeIdentity,
            calculationCriteria: item.calculationCriteriaIdentity,
            chargesPostingRequired: item.chargesPostingRequired ? "Yes" : "No",
            isActive: item.isActive ?? true,
            originalData: {
              module: item.moduleIdentity,
              subModule: item.subModuleIdentity,
              calculationOn: item.calculationBasisIdentity,
              chargeCalculation: item.calculationTypeIdentity,
              chargeIncomeGLAccount: item.incomeGlAccountIdentity,
              monthAmount: item.monthAmountTypeIdentity,
              calculationCriteria: item.calculationCriteriaIdentity,
            },
          })),
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          page: response.number,
          size: response.size,
        };
      },
    }),
  }),
});

export const {
  useGetChargeDetailsQuery,
  useSaveChargeDetailsMutation,
  useUpdateChargeDetailsMutation,
  useDeleteChargeDetailsMutation,
  useLazySearchChargeDetailsQuery,
  useLazyGetChargeDetailsByIdQuery,
  useSaveChargeMasterConfigurationMutation,
  useGetCalculationBaseQuery,
  useGetCalculationTypeQuery,
  useGetChargeSlabGLAccountQuery,
  useGetCalculationCriteriaQuery,
  useGetMonthAmountTypesQuery,
  // useGetModulesQuery,
  useLazySearchGLAccountsFourQuery,
  useGetZonesQuery,
  useGetStateZoneConfigQuery,
  useGetTaxTreatmentsQuery,
  useGetSingleTaxMethodsQuery,
} = chargeMasterApiService;
