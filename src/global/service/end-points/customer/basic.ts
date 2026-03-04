import type {
  BasicInfoFormData,
  BasicInfoData,
  GenderType,
  MaritalStatusType,
  TaxCategoryType,
  CustomerStatusType,
  GuardianSearchResult,
  SelectOption,
  OtpSendPayload,
  OtpSendResponse,
  OtpVerifyPayload,
  OtpVerifyResponse,
  ServiceSubmissionPayload,
  BasicInfoApiResponse,
  BasicInfoApiBasicData,
} from "@/types";
import type { RootState } from "@/global/store";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import { createSelector } from "@reduxjs/toolkit";

// Optimized data transformation functions
const transformSelectOptions = <
  T extends { identity: string; isActive: boolean },
>(
  data: T[],
  labelKey: keyof T
): SelectOption[] => {
  if (!data?.length) return [];

  return data
    .filter(item => item?.identity && item[labelKey] && item.isActive)
    .map(item => ({
      value: item.identity,
      label: String(item[labelKey]),
      disabled: false,
    }));
};

// Transform basic info response to form data
const transformBasicInfoResponse = (
  response: BasicInfoApiResponse
): BasicInfoData => {
  if (!response) {
    throw new Error("No data received from API");
  }

  // Handle different response structures
  const basicData: BasicInfoApiBasicData =
    response.basic || response.data || response;

  return {
    identity: response.identity || response.id || "",
    customerCode: response.customerCode || response.customer_code || "",
    status: response.status || "active",
    basic: {
      customerCode: basicData.customerCode || "",
      crmReferenceId:
        basicData.crmReferenceId || basicData.crm_reference_id || "",
      salutation: basicData.salutation || "",
      firstName: basicData.firstName || basicData.first_name || "",
      middleName: basicData.middleName || basicData.middle_name || "",
      lastName: basicData.lastName || basicData.last_name || "",
      aadharName: basicData.aadharName || basicData.aadhar_name || "",
      gender: basicData.gender || "",
      dob: basicData.dob || basicData.date_of_birth || "",
      guardian: basicData.guardian || basicData.guardian_customer_id || "",
      maritalStatus: basicData.maritalStatus || basicData.marital_status || "",
      spouseName: basicData.spouseName || basicData.spouse_name || "",
      fatherName: basicData.fatherName || basicData.father_name || "",
      motherName: basicData.motherName || basicData.mother_name || "",
      taxCategory: basicData.taxCategory || basicData.tax_category || "",
      customerStatus:
        basicData.customerStatus || basicData.customer_status || "",
      customerListType:
        basicData.customerListType || basicData.customer_list_type || "",
      loyaltyPoints: basicData.loyaltyPoints || basicData.loyalty_points || "0",
      valueScore: basicData.valueScore || basicData.value_score || "",
      mobileNumber: basicData.mobileNumber || basicData.mobile_number || "",
      mobileOtp: "",
      otpVerified: Boolean(basicData.otpVerified || basicData.otp_verified),
      isBusiness: Boolean(basicData.isBusiness || basicData.is_business),
      isFirm: Boolean(basicData.isFirm || basicData.is_firm),
      documentVerified: Boolean(
        basicData.documentVerified || basicData.document_verified
      ),
      activeStatus: Boolean(basicData.activeStatus || basicData.active_status),
      customerId: response.identity || response.id || "",
      age: basicData.age || 0,
      isMinor: Boolean(basicData.isMinor || basicData.is_minor),
      branchId: basicData.branchId || basicData.branch_id || "",
    },
  };
};

const transformFormDataForSubmission = (
  data: BasicInfoFormData
): ServiceSubmissionPayload => {
  return {
    tenantId: "1563455e-fb89-4049-9cbe-02148017e1e6",
    branchId: "5a97dec0-c7e8-4fc2-8ec9-11c9a680479a",
    salutation: data.salutation,
    firstName: data.firstName.trim().toUpperCase(),
    middleName: data.middleName?.trim()?.toUpperCase() || "",
    aadharName: data.aadharName?.trim()?.toUpperCase() || "",
    lastName: data.lastName?.trim()?.toUpperCase() || "",
    gender: data.gender,
    dob: data.dob,
    maritalStatus: data.maritalStatus,
    taxCategory: data.taxCategory,
    aadharVault: null,
    crmReferenceId: data.crmReferenceId.trim().toUpperCase(),
    isBusiness: data.isBusiness,
    isFirm: data.isFirm,
    isVerified: data.otpVerified || false,
    spouseName: data.spouseName?.trim().toUpperCase() || "",
    fatherName: data.fatherName.trim().toUpperCase(),
    motherName: data.motherName.trim().toUpperCase(),
    isMinor: data.isMinor,
    customerStatus: data.customerStatus || "",
    mobileNumber: data.mobileNumber.trim(),
    otpVerified: data.otpVerified || false,
    guardianCustomerId:
      data.isMinor && data.guardian ? data.guardian.trim() : "",
  };
};

export const basicApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    submitBasicInfo: build.mutation<BasicInfoData, BasicInfoFormData>({
      query: formData => {
        const payload = transformFormDataForSubmission(formData);
        return {
          url: api.customer.createBasic(),
          method: "POST",
          data: payload,
        };
      },
      transformResponse: (response: BasicInfoApiResponse) =>
        transformBasicInfoResponse(response),
      invalidatesTags: () => [{ type: "BasicInfo", id: "LIST" }],
    }),

    getBasicInfoById: build.query<BasicInfoData, { customerId: string }>({
      query: ({ customerId }) => ({
        url: api.customer.getBasicById({ customerId }),
        method: "GET",
      }),
      transformResponse: (response: BasicInfoApiResponse) =>
        transformBasicInfoResponse(response),
      providesTags: (_result, _error, { customerId }) => [
        { type: "BasicInfo", id: customerId },
        { type: "BasicInfo", id: "LIST" },
      ],
    }),

    updateBasicInfo: build.mutation<
      BasicInfoData,
      { id: string; data: BasicInfoFormData }
    >({
      query: ({ id, data }) => {
        const payload = transformFormDataForSubmission(data);
        return {
          url: api.customer.updateBasic({ customerId: id }),
          method: "PUT",
          data: payload,
        };
      },
      transformResponse: (response: BasicInfoApiResponse) =>
        transformBasicInfoResponse(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "BasicInfo", id },
        { type: "BasicInfo", id: "LIST" },
      ],
    }),

    getGenderTypes: build.query<SelectOption[], void>({
      query: () => ({
        url: api.master.getGenders(),
        method: "GET",
      }),
      transformResponse: (response: GenderType[]) =>
        transformSelectOptions(response, "gender"),
      providesTags: ["BasicInfo"],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    getMaritalStatusTypes: build.query<SelectOption[], void>({
      query: () => ({
        url: api.master.getMaritalStatus(),
        method: "GET",
      }),
      transformResponse: (response: MaritalStatusType[]) =>
        transformSelectOptions(response, "statusName"),
      providesTags: ["BasicInfo"],
      keepUnusedDataFor: 300,
    }),

    getTaxCategoryTypes: build.query<SelectOption[], void>({
      query: () => ({
        url: api.master.getTaxCategories(),
        method: "GET",
      }),
      transformResponse: (response: TaxCategoryType[]) =>
        transformSelectOptions(response, "taxCatName"),
      providesTags: ["BasicInfo"],
      keepUnusedDataFor: 300,
    }),

    getCustomerStatusTypes: build.query<SelectOption[], void>({
      query: () => ({
        url: api.master.getCustomerStatuses(),
        method: "GET",
      }),
      transformResponse: (response: CustomerStatusType[]) =>
        transformSelectOptions(response, "statusName"),
      providesTags: ["BasicInfo"],
      keepUnusedDataFor: 300,
    }),

    searchGuardian: build.query<
      GuardianSearchResult | GuardianSearchResult[],
      { customerId: string }
    >({
      query: ({ customerId }) => ({
        url: api.customer.searchGuardian({ customerId }),
        method: "GET",
      }),
    }),

    getGuardianById: build.query<GuardianSearchResult, { guardianId: string }>({
      query: ({ guardianId }) => ({
        url: api.customer.getGuardianById({ guardianId }),
        method: "GET",
      }),
    }),

    sendBasicOtp: build.mutation<OtpSendResponse, OtpSendPayload>({
      query: payload => {
        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return {
          url: api.customer.sendOtp(),
          method: "POST",
          data: payload,
          headers: {
            "Idempotency-Key": idempotencyKey,
            "Content-Type": "application/json",
          },
        };
      },
    }),

    verifyBasicOtp: build.mutation<
      OtpVerifyResponse,
      { requestId: string; payload: OtpVerifyPayload }
    >({
      query: ({ requestId, payload }) => ({
        url: api.customer.verifyOtp({ requestId }),
        method: "POST",
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const selectBasicInfoFormData = createSelector(
  [(state: RootState) => state.api.queries],
  queries => {
    const basicInfoQuery = Object.values(queries).find(
      query => query?.endpointName === "getBasicInfoById"
    );
    return (basicInfoQuery?.data as BasicInfoData)?.basic || null;
  }
);

export const selectCustomerIdentity = createSelector(
  [(state: RootState) => state.api.queries],
  queries => {
    const basicInfoQuery = Object.values(queries).find(
      query => query?.endpointName === "getBasicInfoById"
    );
    const queryData = basicInfoQuery?.data as BasicInfoData;
    return queryData
      ? {
          identity: queryData.identity,
          customerCode: queryData.customerCode,
          status: queryData.status,
        }
      : null;
  }
);

export const selectAllMasterData = createSelector(
  [(state: RootState) => state.api.queries],
  queries => {
    const getQueryData = (endpointName: string) => {
      const query = Object.values(queries).find(
        q => q?.endpointName === endpointName
      );
      return (query?.data as SelectOption[]) || [];
    };

    return {
      genders: getQueryData("getGenderTypes"),
      maritalStatuses: getQueryData("getMaritalStatusTypes"),
      taxCategories: getQueryData("getTaxCategoryTypes"),
      customerStatuses: getQueryData("getCustomerStatusTypes"),
    };
  }
);

export const {
  useSubmitBasicInfoMutation,
  useGetBasicInfoByIdQuery,
  useUpdateBasicInfoMutation,
  useGetGenderTypesQuery,
  useGetMaritalStatusTypesQuery,
  useGetTaxCategoryTypesQuery,
  useGetCustomerStatusTypesQuery,
  useSearchGuardianQuery,
  useGetGuardianByIdQuery,
  useSendBasicOtpMutation,
  useVerifyBasicOtpMutation,
} = basicApiService;
