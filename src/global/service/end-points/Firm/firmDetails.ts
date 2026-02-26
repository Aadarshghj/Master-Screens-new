import type { FirmProfile } from "@/types/firm/firm-details.types";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";
import type {
  FirmTypeResponse,
  FirmBankAccountResponse,
  FirmBankAccountRequest,
  BankVerificationResponse,
  BankVerificationRequest,
  // UpiVerificationResponse,
  // UpiVerificationRequest,
  FirmAccountTypeResponse,
  FirmAccountStatusResponse,
} from "../master/firm-master";
import { objectToQuery } from "@/utils";

export interface FirmSearchRequest {
  typeOfFirm?: string;
  firmName?: string;
  registrationNo?: string;
  contactNumber?: string;
  documentType?: string;
  idNumber?: string;
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

export const firmApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    // Search firms
    searchFirm: build.query<FirmProfile[], FirmSearchRequest>({
      query: searchData => {
        const queryParams = new URLSearchParams();

        // Add only non-empty search parameters
        if (searchData.typeOfFirm) {
          queryParams.append("firmTypeIdentity", searchData.typeOfFirm);
        }
        if (searchData.firmName) {
          queryParams.append("firmName", searchData.firmName);
        }
        if (searchData.registrationNo) {
          queryParams.append("registrationNo", searchData.registrationNo);
        }
        if (searchData.contactNumber) {
          queryParams.append("contactNumber", searchData.contactNumber);
        }
        if (searchData.documentType) {
          queryParams.append("documentTypeIdentity", searchData.documentType);
        }
        if (searchData.idNumber) {
          queryParams.append("idNumber", searchData.idNumber);
        }

        return {
          url: `${api.firm.searchFirm()}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response: unknown): FirmProfile[] => {
        // Transform the response to include readable names instead of IDs
        if (Array.isArray(response)) {
          return response.map((firm: Record<string, unknown>) => ({
            ...firm,
            // Keep the original ID fields for reference
            firmTypeIdentityId: firm.firmTypeIdentity,
            documentTypeIdentityId: firm.documentTypeIdentity,
          })) as unknown as FirmProfile[];
        }
        return response as FirmProfile[];
      },
    }),

    // Create firm
    createFirm: build.mutation<FirmProfile, Partial<FirmProfile>>({
      query: firmData => {
        // Transform form data to backend payload structure
        const canvassedTypeId = firmData.canvassedType;

        // Validate required fields
        const requiredFields = {
          firmName: firmData.firmName?.trim(),
          registrationNo: firmData.registrationNo?.trim(),
          registrationDate: firmData.registrationDate,
          typeOfFirm: firmData.typeOfFirm,
          productIndustryCategory: firmData.productIndustryCategory,
        };

        const missingFields = Object.entries(requiredFields)
          .filter(([, value]) => !value)
          .map(([key]) => key);

        if (missingFields.length > 0) {
          throw new Error(
            `Missing required fields: ${missingFields.join(", ")}`
          );
        }

        const DURATION_LABEL_TO_CODE: Record<string, number> = {
          "< 1 Year": 0,
          "1-3 Years": 2,
          "3-5 Years": 3,
          "5-10 Years": 6,
          "> 10 Years": 11,
        };

        const mapDurationToCode = (input: unknown): number => {
          if (input === null || input === undefined) return 0;
          if (typeof input === "number" && !isNaN(input)) return input;
          const s = String(input).trim();
          if (DURATION_LABEL_TO_CODE[s] !== undefined)
            return DURATION_LABEL_TO_CODE[s];
          const n = Number(s);
          if (!isNaN(n)) return n;
          return 0;
        };

        const payload = {
          firmTypeIdentity:
            requiredFields.typeOfFirm || "6a308a25-2cfe-4024-be28-49fbb5cb4ee6",
          branchIdentity: "5a97dec0-c7e8-4fc2-8ec9-11c9a680479a",
          firmName: requiredFields.firmName,
          industryCategoryIdentity: requiredFields.productIndustryCategory,
          registrationNo: requiredFields.registrationNo,
          registrationDate: requiredFields.registrationDate,
          canvassedTypeIdentity:
            canvassedTypeId || "f79ed553-edf5-4b65-8550-b67306406b4b",
          canvasserIdentity: firmData.canvasserIdentity || null,
          firmCode: `FIRM-${Date.now().toString().slice(-7)}`,
          status: "DRAFT",
          associatedPersons: (firmData.associatedPersons || [])
            .filter(
              person =>
                person.customerCode && person.customerName && person.roleInFirm
            )
            .map(person => {
              const durationValue = mapDurationToCode(
                person.durationWithCompany
              );

              return {
                customerIdentity: person.customerIdentity,
                customerCode: person.customerCode,
                customerName: person.customerName,
                roleInFirmIdentity: person.roleInFirm,
                authorizedSignatory: person.authorizedSignatory || false,
                durationWithCompany: durationValue,
              };
            }),
        };

        return {
          url: api.firm.createFirm(),
          method: "POST",
          data: payload,
        };
      },
      invalidatesTags: ["FirmDetails", "BankAccounts"],
    }),

    // Get firm details by ID
    getFirmById: build.query<FirmProfile, string>({
      query: firmId => ({
        url: api.firm.getFirmDetails({ firmId }),
        method: "GET",
      }),
      providesTags: (_result, _error, firmId) => [
        { type: "FirmDetails", id: firmId },
      ],
      keepUnusedDataFor: 300, // Keep cached data for 5 minutes
    }),

    // Update firm
    updateFirm: build.mutation<
      FirmProfile,
      {
        firmId: string;
        data: Partial<FirmProfile>;
        existingData?: Partial<FirmProfile>;
      }
    >({
      query: ({ firmId, data, existingData }) => {
        // Use create firm structure for updates
        const existingDataRecord = existingData as Record<string, unknown>;
        const payload = {
          firmTypeIdentity:
            data.typeOfFirm || existingDataRecord?.firmTypeIdentity,
          branchIdentity:
            existingDataRecord?.branchIdentity ||
            "5a97dec0-c7e8-4fc2-8ec9-11c9a680479a",
          firmName: data.firmName || existingDataRecord?.firmName,
          industryCategoryIdentity:
            data.productIndustryCategory ||
            existingDataRecord?.industryCategoryIdentity,
          registrationNo:
            data.registrationNo || existingDataRecord?.registrationNo,
          registrationDate:
            data.registrationDate || existingDataRecord?.registrationDate,
          canvassedTypeIdentity:
            data.canvassedType || existingDataRecord?.canvassedTypeIdentity,
          canvasserIdentity:
            data.canvasserIdentity ||
            existingDataRecord?.canvasserIdentity ||
            null,
          firmCode: existingDataRecord?.firmCode,
          status: existingDataRecord?.status || "DRAFT",
          associatedPersons: (
            data.associatedPersons ||
            (existingDataRecord?.associatedPersons as Record<
              string,
              unknown
            >[]) ||
            []
          ).map(person => {
            const personRecord = person as Record<string, unknown>;

            const DURATION_LABEL_TO_CODE: Record<string, number> = {
              "< 1 Year": 0,
              "1-3 Years": 2,
              "3-5 Years": 3,
              "5-10 Years": 6,
              "> 10 Years": 11,
            };

            const mapDurationToCode = (input: unknown): number => {
              if (input === null || input === undefined) return 0;
              if (typeof input === "number" && !isNaN(input)) return input;
              const s = String(input).trim();
              if (DURATION_LABEL_TO_CODE[s] !== undefined)
                return DURATION_LABEL_TO_CODE[s];
              const n = Number(s);
              if (!isNaN(n)) return n;
              return 0;
            };

            const durationValue = mapDurationToCode(
              personRecord.durationWithCompany
            );

            // Only use customerIdentity if it's a valid UUID format
            const isValidUUID = (str: string) => {
              const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
              return uuidRegex.test(str);
            };

            const customerIdentity =
              personRecord.customerIdentity &&
              personRecord.customerIdentity.toString().trim() !== "" &&
              isValidUUID(personRecord.customerIdentity.toString())
                ? personRecord.customerIdentity
                : null;

            const payload: Record<string, unknown> = {
              customerCode: personRecord.customerCode,
              customerName: personRecord.customerName,
              roleInFirmIdentity:
                personRecord.roleInFirmIdentity || personRecord.roleInFirm,
              authorizedSignatory: personRecord.authorizedSignatory || false,
              durationWithCompany: durationValue,
            };

            // Only include customerIdentity if it's a valid UUID
            if (customerIdentity) {
              payload.customerIdentity = customerIdentity;
            }

            return payload;
          }),
        };

        return {
          url: api.firm.updateFirmDetails({ firmId }),
          method: "PUT" as const,
          data: payload,
        };
      },
      invalidatesTags: (_result, _error, { firmId }) => [
        { type: "FirmDetails", id: firmId },
      ],
    }),

    // Delete firm
    deleteFirm: build.mutation<void, string>({
      query: firmId => ({
        url: api.firm.deleteFirm({ firmId }),
        method: "DELETE",
      }),
    }),

    // Bank Accounts - Using Firm Master API
    getFirmBankAccounts: build.query<
      {
        identity: string;
        customerCode: string;
        status: string;
        bankAccounts: FirmBankAccountResponse[];
      },
      string
    >({
      query: customerId => {
        if (!customerId) {
          throw new Error("customerId is required for getFirmBankAccounts");
        }
        return {
          url: api.customer.getBankAccounts({ customerId }),
          method: "GET",
        };
      },
      transformResponse: (response: {
        identity: string;
        customerCode: string;
        status: string;
        bankAccounts: FirmBankAccountResponse[];
      }) => {
        return response;
      },
      providesTags: (_result, _error, customerId) => [
        { type: "FirmBankAccounts", id: customerId },
      ],
      keepUnusedDataFor: 300,
    }),

    createFirmBankAccount: build.mutation<
      { message: string; data: FirmBankAccountResponse },
      { customerId: string; bankData: FirmBankAccountRequest }
    >({
      query: ({ customerId, bankData }) => {
        // Create payload with EXACT backend structure - no extra fields
        const payload = {
          bankName: bankData.bankName,
          ifscCode: bankData.ifscCode,
          accountNumber: bankData.accountNumber,
          accountType: bankData.accountType,
          accountStatus: bankData.accountStatus,
          accountHolderName: bankData.accountHolderName,
          branchName: bankData.branchName,
          bankProofDocumentRefId: bankData.bankProofDocumentRefId || Date.now(),
          bankProofFilePath: bankData.bankProofFilePath,
          isActive: true,
          isPrimary: bankData.isPrimary,
          upiVerified: bankData.upiVerified || false,
          pdStatus: bankData.pdStatus || "COMPLETED",
          pdTxnId: bankData.pdTxnId || "PD-TXN-" + Date.now(),
          ...(bankData.upiId && { upiId: bankData.upiId }),
        };

        return {
          url: api.customer.createBankAccount({ customerId }),
          method: "POST",
          data: payload,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: "FirmBankAccounts", id: customerId },
      ],
    }),

    // Bank Verification
    verifyFirmBankAccount: build.mutation<
      BankVerificationResponse,
      BankVerificationRequest
    >({
      query: bankData => ({
        url: api.firm.verifyBankAccount(),
        method: "POST",
        data: bankData as unknown as Record<string, unknown>,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // verifyFirmUpiId: build.mutation<
    //   UpiVerificationResponse,
    //   UpiVerificationRequest
    // >({
    //   query: upiData => ({
    //     url: api.firm.verifyUpiId(),
    //     method: "POST",
    //     body: upiData,
    //   }),
    // }),

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

    // IFSC Data
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
        url: api.firm.getIfscData({ ifsc }),
        method: "GET",
      }),
    }),

    // Account Types and Statuses
    getFirmAccountTypes: build.query<FirmAccountTypeResponse[], void>({
      query: () => ({
        url: api.firm.getAccountTypes(),
        method: "GET",
      }),
    }),

    getFirmAccountStatuses: build.query<FirmAccountStatusResponse[], void>({
      query: () => ({
        url: api.firm.getAccountStatuses(),
        method: "GET",
      }),
    }),

    // Master data for search modal
    getFirmTypesForSearch: build.query<FirmTypeResponse[], void>({
      query: () => ({
        url: api.firmMaster.getFirmTypes(),
        method: "GET",
      }),
    }),

    getKycTypesForSearch: build.query<
      { identity: string; name: string; code?: string }[],
      void
    >({
      query: () => {
        return {
          url: api.master.getKycTypes(),
          method: "GET",
        };
      },
      transformResponse: (
        response: { identity: string; name: string; code?: string }[]
      ) => {
        return response;
      },
    }),

    // Update firm status
    updateFirmStatus: build.mutation<
      { message?: string; status?: string },
      { firmIdentity: string; status: string }
    >({
      query: ({ firmIdentity, status }) => ({
        url: api.firm.updateFirmStatus({ firmIdentity }),
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { firmIdentity }) => [
        { type: "FirmDetails", id: firmIdentity },
      ],
    }),

    // DMS File View
    getDMSFileView: build.query<
      { preSignedUrl: string },
      { filePath: string; accessType: string }
    >({
      query: ({ filePath, accessType }) => ({
        url: `${api.firm.getDMSFileView()}?filePath=${encodeURIComponent(filePath)}&accessType=${accessType}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSearchFirmQuery,
  useCreateFirmMutation,
  useGetFirmByIdQuery,
  useUpdateFirmStatusMutation,
  useUpdateFirmMutation,
  useDeleteFirmMutation,
  useCreateFirmBankAccountMutation,
  useGetFirmBankAccountsQuery,
  useVerifyFirmBankAccountMutation,
  useVerifyFirmUpiIdMutation,
  useLazyGetFirmIfscDataQuery,
  useGetFirmAccountTypesQuery,
  useGetFirmAccountStatusesQuery,
  useGetFirmTypesForSearchQuery,
  useGetKycTypesForSearchQuery,
  useLazyGetDMSFileViewQuery,
} = firmApiService;
