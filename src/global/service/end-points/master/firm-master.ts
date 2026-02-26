import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import { objectToQuery } from "@/utils";

export interface FirmTypeResponse {
  identity: string;
  firmType: string;
  description: string | null;
}

export interface FirmRoleResponse {
  identity: string;
  roleName: string;
  isActive: boolean;
  id: number;
}

export interface IndustryCategoryResponse {
  identity: string;
  industryCategoryName: string;
  description: string | null;
}

export interface CanvassedTypeResponse {
  identity: string;
  name: string;
  code: string;
}

export interface CustomerSearchParams {
  branchCode?: string;
  branchId?: number;
  mobileNumber?: string;
  emailId?: string;
  panCard?: string;
  aadhaarNumber?: string;
  voterId?: string;
  passportNumber?: string;
  customerName?: string;
}

export interface CustomerSearchResponse {
  customerCode?: string;
  branchCode?: string;
  branchId?: number;
  mobileNumber?: string;
  emailId?: string;
  panCard?: string;
  aadhaarNumber?: string;
  voterId?: string;
  passportNumber?: string;
  customerName?: string;
  displayName?: string;
  fatherName?: string;
  houseName?: string;
  mobile?: string;
  city?: string;
  dob?: string;
  firstname?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  identity?: string;
  customerIdentity?: string;
  isCustomerExist?: boolean;
}

export interface CustomerSearchApiResponse {
  content: CustomerSearchResponse[];
  totalElements: number;
  totalPages: number;
}

export interface SectoralPerformanceResponse {
  identity: string;
  name: string;
  code?: string;
  isActive?: boolean;
}

export interface SeasonalityResponse {
  identity: string;
  name: string;
  code?: string;
  isActive?: boolean;
}

export interface FirmSourceOfIncomeResponse {
  identity: string;
  name: string;
  code?: string;
  isActive?: boolean;
}

export interface FirmAccountTypeResponse {
  identity: string;
  accountType: string;
  code?: string;
  isActive?: boolean;
}

export interface FirmAccountStatusResponse {
  identity: string;
  status: string;
  code?: string;
  isActive?: boolean;
}

export interface BankVerificationRequest {
  accountNumber: string;
  ifsc: string;
  accountHolderName?: string;
}

export interface BankVerificationResponse {
  status: string;
  accountStatus?: string;
  beneficiaryName?: string;
  message?: string;
}

export interface UpiVerificationRequest {
  upiId: string;
}

export interface UpiVerificationResponse {
  isValid: boolean;
  upiHolderName?: string;
  message?: string;
}

export interface FirmBankAccountResponse {
  identity: string;
  accountNumber: string;
  accountType: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  isActive: boolean;
}

export interface FirmBankAccountRequest {
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  upiId?: string;
  accountType: string;
  accountStatus: string;
  accountHolderName: string;
  branchName: string;
  bankProofDocumentRefId?: number;
  bankProofFilePath?: string;
  isActive: boolean;
  isPrimary: boolean;
  upiVerified?: boolean;
  pdStatus?: string;
  pdTxnId?: string;
  customerCode: string;
  firmId?: string;
}

export interface KycDocumentResponse {
  identity: string;
  idType: string;
  idNumber: string;
  maskedId?: string;
  isVerified: boolean;
  isActive: boolean;
  kycUploads: Array<{
    identity: string;
    fileName: string;
    filePath: string;
    uploadDate: string;
    uploadStatus: string;
  }>;
}

export interface KycDocumentRequest {
  maskedId: string;
  idType: string;
  idNumber: string;
  placeOfIssue: string;
  issuingAuthority: string;
  validFrom: string;
  validTo: string;
  isVerified: boolean;
  isActive: boolean;
  branchId: string;
  tenantId: string;
  branchCode: string;
  documentRefId: string;
  filePath: string;
  fileName: string;
  fileType: string;
}

export interface UpiVerificationResult {
  decentroTxnId?: string;
  status?: string;
  responseCode?: string;
  message?: string;
  responseKey?: string;
  data?: {
    upiVpa?: string;
    nameAsPerBank?: string;
    accountNumber?: string;
    ifsc?: string;
    bankReferenceNumber?: string;
    npciTransactionId?: string;
  };
}

export interface SendOtpRequest {
  tenantId: number;
  branchCode: string;
  templateCatalogIdentity: string;
  templateContentIdentity: string;
  target: string;
  customerIdentity: number;
  length: number;
  ttlSeconds: number;
}

export interface SendOtpResponse {
  requestId: string;
  expiresAt: string;
  status: string;
}

export interface VerifyOtpRequest {
  requestId: string;
  code: string;
}

export interface VerifyOtpResponse {
  result: string;
  success: boolean;
  message?: string;
  attemptsRemaining?: number;
}

export const firmMasterApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getFirmTypes: build.query<FirmTypeResponse[], void>({
      query: () => ({
        url: api.firmMaster.getFirmTypes(),
        method: "GET",
      }),
    }),

    getFirmRoles: build.query<FirmRoleResponse[], void>({
      query: () => ({
        url: api.firmMaster.getFirmRoles(),
        method: "GET",
      }),
    }),

    getIndustryCategories: build.query<IndustryCategoryResponse[], void>({
      query: () => ({
        url: api.firmMaster.getIndustryCategories(),
        method: "GET",
      }),
    }),

    getFirmCanvassedTypes: build.query<CanvassedTypeResponse[], void>({
      query: () => {
        return {
          url: api.firmMaster.getCanvassedTypes(),
          method: "GET",
        };
      },
      transformResponse: (response: CanvassedTypeResponse[]) => {
        return response;
      },
    }),

    searchCustomerByCode: build.mutation<
      CustomerSearchResponse[],
      { customerCode: string }
    >({
      query: ({ customerCode }) => ({
        url: api.customer.getGuardian({ customerCode }),
        method: "GET",
      }),
    }),

    searchCustomers: build.query<
      CustomerSearchResponse[],
      CustomerSearchParams
    >({
      query: params => {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value) queryParams.append(key, value.toString());
        });

        return {
          url: `${api.customer.searchCustomer()}?${queryParams.toString()}`,
          method: "GET",
        };
      },

      transformResponse: (response: CustomerSearchApiResponse) => {
        return response?.content ?? [];
      },
    }),

    searchCustomerByAadhaar: build.query<
      CustomerSearchResponse[],
      { aadhaarNumber: string }
    >({
      query: ({ aadhaarNumber }) => ({
        url: `${api.customer.searchCustomer()}?aadhaarNumber=${aadhaarNumber}`,
        method: "GET",
      }),
    }),

    getSectoralPerformances: build.query<SectoralPerformanceResponse[], void>({
      query: () => ({
        url: api.firmMaster.getSectoralPerformances(),
        method: "GET",
      }),
    }),

    getSeasonality: build.query<SeasonalityResponse[], void>({
      query: () => ({
        url: api.firmMaster.getSeasonality(),
        method: "GET",
      }),
    }),

    getFirmSourceOfIncome: build.query<FirmSourceOfIncomeResponse[], void>({
      query: () => ({
        url: api.firmMaster.getSourceOfIncome(),
        method: "GET",
      }),
    }),

    getFirmAccountTypes: build.query<FirmAccountTypeResponse[], void>({
      query: () => ({
        url: api.firmMaster.getAccountTypes(),
        method: "GET",
      }),
    }),

    getFirmAccountStatuses: build.query<FirmAccountStatusResponse[], void>({
      query: () => ({
        url: api.firmMaster.getAccountStatuses(),
        method: "GET",
      }),
    }),

    verifyFirmBankAccount: build.mutation<
      BankVerificationResponse,
      BankVerificationRequest
    >({
      query: bankData => ({
        url: api.firmMaster.verifyBankAccount(),
        method: "POST",
        data: bankData as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    verifyFirmUpiId: build.mutation<
      { isVerified: boolean; message: string; name?: string },
      { upiId: string }
    >({
      query: params => {
        const searchParams = objectToQuery({
          upiId: params.upiId?.trim(),
        });

        return {
          url: api.firmMaster.verifyUpiId(searchParams),
          method: "GET",
        };
      },

      transformResponse: (response: UpiVerificationResult) => {
        const isVerified =
          response?.responseKey === "success_account_details_retrieved" &&
          Boolean(response?.data);

        return {
          isVerified,
          message: isVerified
            ? "UPI ID verified successfully"
            : response?.message || "UPI verification failed",
        };
      },
    }),
    getFirmIfscData: build.query<
      {
        ifscCode: string;
        bankName: string;
        branchName: string;
        branchPlace: string;
        isActive: boolean;
      },
      string
    >({
      query: ifsc => ({
        url: api.firmMaster.getIfscData({ ifsc }),
        method: "GET",
      }),
    }),

    getKycDocuments: build.query<KycDocumentResponse[], string>({
      query: customerId => ({
        url: api.firm.getKycDocuments({ customerId }),
        method: "GET",
      }),
      transformResponse: (response: {
        kycDocuments?: KycDocumentResponse[];
      }) => {
        // Extract kycDocuments array from the response
        return response?.kycDocuments || [];
      },
      providesTags: ["KycDocuments"],
    }),

    uploadKycDocument: build.mutation<
      { success: boolean; message?: string },
      { customerId: string; documentData: KycDocumentRequest }
    >({
      query: ({ customerId, documentData }) => ({
        url: api.firm.uploadKycDocument({ customerId }),
        method: "POST",
        data: documentData as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        "KycDocuments",
        { type: "KycDocuments", id: customerId },
      ],
    }),

    sendOtp: build.mutation<SendOtpResponse, SendOtpRequest>({
      query: payload => {
        const idempotencyKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const requestConfig = {
          url: api.customer.sendOtp(),
          method: "POST" as const,
          data: payload as unknown as Record<string, unknown>,
          headers: {
            "Idempotency-Key": idempotencyKey,
            "Content-Type": "application/json",
          },
        };

        return requestConfig;
      },
    }),

    verifyFirmOtp: build.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      query: ({ requestId, code }) => {
        // Ensure code is properly converted
        const codeValue = code ? code.toString() : "";
        const payload = {
          code: codeValue,
        };

        return {
          url: api.customer.verifyOtp({ requestId }),
          method: "POST",
          data: payload as unknown as Record<string, unknown>,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      transformResponse: (response: VerifyOtpResponse) => {
        if (response.result === "INVALID") {
          throw new Error(
            `Invalid OTP. ${response.attemptsRemaining || 0} attempts remaining.`
          );
        }

        if (response.result !== "VERIFIED") {
          throw new Error(response.message || "OTP verification failed");
        }

        return response;
      },
    }),
  }),
});

export const {
  useGetFirmTypesQuery,
  useGetFirmRolesQuery,
  useGetIndustryCategoriesQuery,
  useGetFirmCanvassedTypesQuery,
  useSearchCustomerByCodeMutation,
  useSearchCustomersQuery,
  useSearchCustomerByAadhaarQuery,
  useGetSectoralPerformancesQuery,
  useGetSeasonalityQuery,
  useGetFirmSourceOfIncomeQuery,
  useGetFirmAccountTypesQuery,
  useGetFirmAccountStatusesQuery,
  useVerifyFirmBankAccountMutation,
  useVerifyFirmUpiIdMutation,
  useLazyGetFirmIfscDataQuery,
  useGetKycDocumentsQuery,
  useUploadKycDocumentMutation,
  useSendOtpMutation: useSendFirmOtpMutation,
  useVerifyFirmOtpMutation,
} = firmMasterApiService;
