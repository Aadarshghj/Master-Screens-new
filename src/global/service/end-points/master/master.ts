import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export interface ConfigOption {
  value: string;
  label: string;
}
const transformToSelectOptions = <T extends { identity?: string; id: number }>(
  data: T[],
  labelKey: keyof T
): ConfigOption[] => {
  return data.map(item => ({
    value: item.identity || String(item.id),
    label: String(item[labelKey]),
  }));
};

interface MasterDataOption {
  id: number;
  code: string;
  name: string;
  displayName?: string;
  relationship?: string;
  identity?: string;
  MasterDataOption: string;
}

interface PostOfficeResponse {
  id: number;
  name: string;
  pincode: string;
}

interface LocationResponse {
  country: string;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
}

interface PincodeDetailsResponse {
  pincode: string;
  country: string;
  state: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  postOffices: PostOfficeResponse[];
}
export interface IFSCCodeResponse {
  ifscCode: string;
  bankName: string;
  branchName: string;
  branchPlace: string;
  pincodes: number;
  rbiFlag: boolean;
  isActive: boolean;
  identity: string;
}

interface NationalityResponse {
  isActive: boolean;
  identity: string;
  nationality: string;
  id: number;
}

interface OccupationResponse {
  occupationName: string;
  isActive: boolean;
  identity: string;
  id: number;
}

interface LanguageResponse {
  isActive: boolean;
  identity: string;
  languageName: string;
  id: number;
}
interface DocumentTypeUsageItem {
  identity: string;
  code: string;
  name?: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  allowedContexts?: {
    contextCode: string;
    isMandatory: boolean;
    usageCreatedAt?: string;
  }[];
  isMandatoryInThisContext?: boolean;
}

interface DocumentTypesUsageResponse {
  context: string;
  documentTypes: DocumentTypeUsageItem[];
  total?: number;
}
interface CustomerGroupResponse {
  isActive: boolean;
  identity: string;
  customerGroup: string;
  id: number;
}

interface CustomerCategoryResponse {
  isActive: boolean;
  identity: string;
  categoryName: string;
  id: number;
}

interface RiskCategoryResponse {
  isActive: boolean;
  identity: string;
  category: string;
  id: number;
}
interface AccountTypeResponse {
  isActive: boolean;
  identity: string;
  accountType: string;
  id: number;
}
export type PincodeErrorResponse = {
  status: number;
  error: string;
  message: string;
  errorCode: string;
  path: string;
  timestamp: string;
  correlationId: string;
};
type DocType = {
  identity: string;
  code: string;
  displayName: string;
  description: string;
  isActive: boolean;
  allowedContexts: null | string;
  isMandatoryInThisContext: boolean;
};
type KYCResponse = {
  context: string;
  documentTypes: DocType[];
  total: number;
};
export const masterApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getSalutationTypes: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getSalutationTypes(),
        method: "GET",
      }),
      transformResponse: (
        response: { identity: string; salutation: string; isActive: boolean }[]
      ) =>
        response
          .filter(item => item.isActive)
          .map(item => ({
            value: item.identity,
            label: item.salutation,
          })),
    }),

    getGenders: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getGenders(),
        method: "GET",
      }),
    }),

    getMaritalStatus: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getMaritalStatus(),
        method: "GET",
      }),
    }),

    getTaxCategories: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getTaxCategories(),
        method: "GET",
      }),
    }),

    getCustomerStatuses: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getCustomerStatuses(),
        method: "GET",
      }),
    }),

    getNationalities: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getNationalities(),
        method: "GET",
      }),
      transformResponse: (response: NationalityResponse[]) =>
        transformToSelectOptions(response, "nationality"),
    }),

    getOccupations: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getOccupations(),
        method: "GET",
      }),
      transformResponse: (response: OccupationResponse[]) =>
        transformToSelectOptions(response, "occupationName"),
    }),

    getBranches: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getBranches(),
        method: "GET",
      }),
    }),

    getLanguages: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getLanguages(),
        method: "GET",
      }),
      transformResponse: (response: LanguageResponse[]) =>
        transformToSelectOptions(response, "languageName"),
    }),

    getContactTypes: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getContactTypes(),
        method: "GET",
      }),
    }),

    getAddressTypes: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getAddressTypes(),
        method: "GET",
      }),
    }),

    getAddressProofTypes: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getAddressProofTypes(),
        method: "GET",
      }),
    }),

    getRelationships: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getRelationships(),
        method: "GET",
      }),
    }),

    getDesignations: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getDesignations(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getSourceOfIncome: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getSourceOfIncome(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getResidentialStatuses: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getResidentialStatuses(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getAssetTypes: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getAssetTypes(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getBanks: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getBanks(),
        method: "GET",
      }),
    }),

    getCanvassedTypes: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getCanvassedTypes(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getPepCategories: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getPepCategories(),
        method: "GET",
      }),
    }),

    getPepRelationships: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getPepRelationships(),
        method: "GET",
      }),
    }),

    getPepVerificationSource: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getPepVerificationSource(),
        method: "GET",
      }),
    }),

    // getDocumentMaster: build.query<
    //   { code: string; displayName: string }[],
    //   void
    // >({
    //   query: () => ({
    //     url: api.master.getDocumentMaster(),
    //     method: "GET",
    //   }),
    //   transformResponse: (response: { docCode: string; docname: string }[]) =>
    //     response.map(item => ({
    //       code: item.docCode,
    //       displayName: item.docname,
    //     })),
    // }),

    getDocumentMaster: build.query<
      {
        identity: string;
        code: string;
        displayName: string;
        isIdentityProof: boolean;
        isAddressProof: boolean;
      }[],
      void
    >({
      query: () => ({
        url: api.master.getDocumentMaster(),
        method: "GET",
      }),
      transformResponse: (
        response: {
          identity: string;
          docCode: string;
          docname: string;
          isIdentityProof: boolean;
          isAddressProof: boolean;
        }[]
      ) =>
        response.map(item => ({
          identity: item.identity,
          code: item.docCode,
          displayName: item.docname,
          isIdentityProof: item.isIdentityProof,
          isAddressProof: item.isAddressProof,
        })),
    }),

    getDocumentTypes: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getDocumentTypes(),
        method: "GET",
      }),
    }),

    getKycTypes: build.query<KYCResponse, { context: string }>({
      query: ({ context }) => ({
        url: api.master.getKycTypes(),
        params: { context },
        method: "GET",
      }),
    }),

    getDocumentTypesUsageForFirm: build.query<DocumentTypeUsageItem[], void>({
      query: () => ({
        url: api.master.getDocumentTypesUsage({ context: "FIRM_REGISTRATION" }),
        method: "GET",
      }),
      transformResponse: (response: DocumentTypesUsageResponse) =>
        (response?.documentTypes || []).filter(item => item.isActive),
    }),

    getAccountStatuses: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getAccountStatuses(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getAccountTypes: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getAccountTypes(),
        method: "GET",
      }),
      transformResponse: (response: AccountTypeResponse[]) =>
        transformToSelectOptions(response, "accountType"),
    }),

    getPurpose: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getPurpose(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getBranchContact: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getBranchContact(),
        method: "GET",
      }),
    }),

    getBranchWeekSchedule: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getBranchWeekSchedule(),
        method: "GET",
      }),
    }),

    getNomineeRelationships: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getNomineeRelationships(),
        method: "GET",
      }),
    }),

    getGuardianRelationships: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getGuardianRelationships(),
        method: "GET",
      }),
    }),

    getPostOffices: build.query<PostOfficeResponse[], string>({
      query: pincode => ({
        url: api.master.getPostOffices({ pincode }),
        method: "GET",
      }),
    }),

    getLocationByPincode: build.query<LocationResponse, string>({
      query: pincode => ({
        url: api.master.getLocationByPincode({ pincode }),
        method: "GET",
      }),
    }),

    getPincodeDetails: build.query<
      PincodeDetailsResponse,
      string,
      PincodeErrorResponse
    >({
      query: pincode => ({
        url: api.master.getPincodeDetails({ pincode }),
        method: "GET",
      }),
    }),

    getReferralSource: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getReferralSource(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getEducationLevels: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getEducationLevels(),
        method: "GET",
      }),
      transformResponse: (response: MasterDataOption[]) =>
        transformToSelectOptions(response, "name"),
    }),

    getCustomerGroups: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getCustomerGroup(),
        method: "GET",
      }),
      transformResponse: (response: CustomerGroupResponse[]) =>
        transformToSelectOptions(response, "customerGroup"),
    }),

    getCustomerCategories: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getCustomerCategory(),
        method: "GET",
      }),
      transformResponse: (response: CustomerCategoryResponse[]) =>
        transformToSelectOptions(response, "categoryName"),
    }),

    getRiskCategories: build.query<ConfigOption[], void>({
      query: () => ({
        url: api.master.getRiskCategory(),
        method: "GET",
      }),
      transformResponse: (response: RiskCategoryResponse[]) =>
        transformToSelectOptions(response, "category"),
    }),

    getIfscDetails: build.query<IFSCCodeResponse, string>({
      query: ifsc => ({
        url: api.master.getIfscData({ ifsc }),
        method: "GET",
      }),
    }),

    getSeasonality: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getSeasonality(),
        method: "GET",
      }),
    }),

    getSitePremise: build.query<MasterDataOption[], void>({
      query: () => ({
        url: api.master.getSitePremise(),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetSalutationTypesQuery,
  useGetGendersQuery,
  useGetMaritalStatusQuery,
  useGetTaxCategoriesQuery,
  useGetCustomerStatusesQuery,
  useGetNationalitiesQuery,
  useGetOccupationsQuery,
  useGetBranchesQuery,
  useGetLanguagesQuery,
  useGetContactTypesQuery,
  useGetAddressTypesQuery,
  useGetAddressProofTypesQuery,
  useGetRelationshipsQuery,
  useGetDesignationsQuery,
  useGetSourceOfIncomeQuery,
  useGetResidentialStatusesQuery,
  useGetAssetTypesQuery,
  useGetBanksQuery,
  useGetCanvassedTypesQuery,
  useGetPepCategoriesQuery,
  useGetPepRelationshipsQuery,
  useGetPepVerificationSourceQuery,
  useGetDocumentMasterQuery,
  useGetDocumentTypesQuery,
  useGetKycTypesQuery,
  useGetDocumentTypesUsageForFirmQuery,
  useGetAccountStatusesQuery,
  useGetAccountTypesQuery,
  useGetPurposeQuery,
  useGetBranchContactQuery,
  useGetBranchWeekScheduleQuery,
  useGetNomineeRelationshipsQuery,
  useGetGuardianRelationshipsQuery,
  useGetPostOfficesQuery,
  useGetLocationByPincodeQuery,
  useGetPincodeDetailsQuery,
  useGetReferralSourceQuery,
  useGetEducationLevelsQuery,
  useGetCustomerGroupsQuery,
  useGetCustomerCategoriesQuery,
  useGetRiskCategoriesQuery,
  useLazyGetIfscDetailsQuery,
  useGetSeasonalityQuery,
  useGetSitePremiseQuery,
} = masterApiService;
