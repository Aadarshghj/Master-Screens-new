import type {
  CKYCData,
  CustomerData,
  DocumentTypeOption,
  CKYCSearchForm,
  CustomerSearchForm,
  KycDataResponse,
  MaskAadharRequest,
  MaskAadharResponse,
  AadharOtpResponse,
  AadharOtpVerifyRequest,
  AadharOtpVerifyResponse,
  UpiMatchingRequest,
  UpiMatchingResponse,
  NameMatchingRequest,
  NameMatchingResponse,
  ValidateKycRequest,
  ValidateKycResponse,
  VaultMaskRequest,
  VaultMaskResponse,
  KycDataResponseDto,
} from "@/types";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type { CustomerOnboardingSerarchResponse } from "@/types/customer/common.types";

export const kycService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getKycData: build.query<KycDataResponse, void>({
      query: () => ({
        url: api.customer.getKycData(),
        method: "GET",
      }),
    }),

    getKyc: build.query<KycDataResponseDto, string>({
      query: customerId => ({
        url: api.customer.getKyc({ customerId }),
        method: "GET",
      }),
      providesTags: ["KycDocuments"],
    }),

    getCkycData: build.query<CKYCData[], void>({
      query: () => ({
        url: api.customer.getCkycData(),
        method: "GET",
      }),
    }),

    getCustomerData: build.query<CustomerData[], void>({
      query: () => ({
        url: api.customer.getCustomerData(),
        method: "GET",
      }),
    }),

    getKycDocumentTypes: build.query<DocumentTypeOption[], void>({
      query: () => ({
        url: api.master.getDocumentTypes(),
        method: "GET",
      }),
    }),

    submitKycForm: build.mutation<
      { message: string; data: { identity: string } },
      Record<string, unknown>
    >({
      query: payload => {
        const token = localStorage.getItem("access_token");

        return {
          url: api.customer.submitKyc(),
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };
      },
      invalidatesTags: ["KycDocuments"],
    }),

    updateKycForm: build.mutation<
      { message: string; data: { identity: string } },
      { payload: Record<string, unknown>; customerId: string }
    >({
      query: ({ payload, customerId }) => {
        const token = localStorage.getItem("access_token");

        return {
          url: api.customer.updateKyc({ customerId }),
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        };
      },
      invalidatesTags: ["KycDocuments"],
    }),

    searchCkyc: build.mutation<CKYCData[], CKYCSearchForm>({
      query: searchParams => ({
        url: api.customer.searchCkyc(),
        method: "POST",
        data: searchParams as unknown as Record<string, unknown>,
      }),
    }),

    searchCustomer: build.mutation<
      CustomerOnboardingSerarchResponse,
      CustomerSearchForm
    >({
      query: searchParams => {
        const params = new URLSearchParams();

        if (searchParams.branchCode)
          params.append("branchCode", searchParams.branchCode);
        if (searchParams.branchId)
          params.append("branchId", searchParams.branchId.toString());
        if (searchParams.mobile)
          params.append("mobileNumber", searchParams.mobile);
        if (searchParams.email) params.append("emailId", searchParams.email);
        if (searchParams.panCard)
          params.append("panCard", searchParams.panCard);
        if (searchParams.aadharNumber)
          params.append("aadhaarNumber", searchParams.aadharNumber);
        if (searchParams.voterId)
          params.append("voterId", searchParams.voterId);
        if (searchParams.passport)
          params.append("passportNumber", searchParams.passport);
        if (searchParams.customerName)
          params.append("customerName", searchParams.customerName);

        const queryString = params.toString();
        const url = queryString
          ? `${api.customer.searchCustomer()}?${queryString}`
          : api.customer.searchCustomer();

        return {
          url,
          method: "GET",
        };
      },
    }),

    maskAadhar: build.mutation<MaskAadharResponse, MaskAadharRequest>({
      query: payload => ({
        url: api.customer.maskAadhar(),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    vaultMask: build.mutation<VaultMaskResponse, VaultMaskRequest>({
      query: payload => ({
        url: api.customer.vaultMask({ maskuid: payload.maskuid }),
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    sendAadharOtp: build.mutation<AadharOtpResponse, { aadhaarNumber: string }>(
      {
        query: ({ aadhaarNumber }) => {
          return {
            url: api.customer.aadharOtpSend({ aadhaarNumber }),
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
          };
        },
      }
    ),
    verifyAadharOtp: build.mutation<
      AadharOtpVerifyResponse,
      AadharOtpVerifyRequest
    >({
      query: ({ initiationTransactionId, otp }) => ({
        url: api.customer.aadharOtpVerify({ initiationTransactionId, otp }),
        method: "POST",
        data: { code: parseInt(otp) },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    upiMatching: build.mutation<UpiMatchingResponse, UpiMatchingRequest>({
      query: payload => ({
        url: api.customer.upiMatching(),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    nameMatching: build.mutation<NameMatchingResponse, NameMatchingRequest>({
      query: payload => ({
        url: api.customer.nameMatching(),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    validateKyc: build.mutation<ValidateKycResponse, ValidateKycRequest>({
      query: ({ idNumber, kycId, dob }) => ({
        url: api.customer.validateKyc({ idNumber, kycId, dob }),
        method: "GET",
      }),
    }),

    deleteKyc: build.mutation<
      { message: string },
      { customerId: string; kycId: string }
    >({
      query: ({ customerId, kycId }) => ({
        url: api.customer.deleteKyc({ customerId, kycId }),
        method: "DELETE",
        // params: { updatedBy },
      }),
    }),
  }),
});

export const {
  useGetKycDataQuery,
  useGetKycQuery,
  useGetCkycDataQuery,
  useGetCustomerDataQuery,
  useGetKycDocumentTypesQuery,
  useSubmitKycFormMutation,
  useUpdateKycFormMutation,
  useSearchCkycMutation,
  useSearchCustomerMutation,
  useMaskAadharMutation,
  useVaultMaskMutation,
  useSendAadharOtpMutation,
  useVerifyAadharOtpMutation,
  useUpiMatchingMutation,
  useNameMatchingMutation,
  useValidateKycMutation,
  useDeleteKycMutation,
} = kycService;
