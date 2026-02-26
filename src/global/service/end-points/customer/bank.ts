import type {
  BankAccountResponse,
  CreateBankAccountRequest,
  AccountVerificationRequest,
  AccountVerificationResult,
  BankAccountConfig,
  UpiVerificationResult,
  GetBankAccountsResponse,
  DuplicateAccountSuccess,
  DuplicateAccountError,
} from "@/types/customer/bank.types";
import { api } from "@/api";
import { apiInstance } from "../../api-instance";
import { objectToQuery } from "@/utils/query.utils";

export const bankAccountApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getBankAccounts: build.query<BankAccountResponse[], string>({
      query: customerId => ({
        url: api.customer.getBankAccounts({ customerId }),
        method: "GET",
      }),
      transformResponse: (response: GetBankAccountsResponse) =>
        response.bankAccounts,
    }),

    createBankAccount: build.mutation<
      { message: string; data: BankAccountResponse },
      { customerId: string; payload: CreateBankAccountRequest }
    >({
      query: ({ customerId, payload }) => {
        return {
          url: api.customer.createBankAccount({ customerId }),
          method: "POST",
          data: payload as unknown as Record<string, unknown>,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),

    verifyBankAccount: build.mutation<
      {
        isVerified: boolean;
        accountHolderName: string | null;
        message: string;
      },
      AccountVerificationRequest
    >({
      query: (payload: AccountVerificationRequest) => ({
        url: api.customer.verifyBankAccount(),
        method: "POST",
        data: payload as unknown as Record<string, unknown>,
      }),
      transformResponse: (response: AccountVerificationResult) => {
        const isVerified =
          response.status === "success" && response.accountStatus === "valid";

        return {
          isVerified,
          accountHolderName: isVerified ? response.beneficiaryName : null,
          message: isVerified
            ? "Account verified successfully"
            : "Account verification failed",
        };
      },
    }),

    verifyUpiId: build.mutation<
      { isVerified: boolean; message: string },
      { upiId: string }
    >({
      query: params => {
        const searchParams = objectToQuery({
          upiId: params.upiId,
        });

        return {
          url: api.customer.verifyUpiId({ queryParams: searchParams }),
          method: "GET",
        };
      },
      transformResponse: (response: UpiVerificationResult) => {
        const isVerified =
          (response.status === "SUCCESS" || response.status === "Success") &&
          response.responseKey === "success_account_details_retrieved";
        return {
          isVerified,
          message: isVerified
            ? "UPI ID verified successfully"
            : response.message || "UPI verification failed",
        };
      },
    }),

    getBankAccountConfig: build.query<BankAccountConfig, void>({
      query: () => ({
        url: api.customer.getBankAccountConfig(),
        method: "GET",
      }),
    }),

    checkDuplicateBankAccount: build.query<
      DuplicateAccountSuccess,
      { accountNumber: string }
    >({
      query: ({ accountNumber }) => ({
        url: api.customer.checkDuplicateBankAccount({ accountNumber }),
        method: "GET",
      }),
      transformResponse: (): DuplicateAccountSuccess => ({
        isDuplicate: false,
      }),
      transformErrorResponse: (response: {
        status: number;
        data: DuplicateAccountError;
      }) => response,
    }),
  }),
});

export const {
  useGetBankAccountsQuery,
  useCreateBankAccountMutation,
  useVerifyBankAccountMutation,
  useVerifyUpiIdMutation,
  useGetBankAccountConfigQuery,
  useLazyCheckDuplicateBankAccountQuery,
} = bankAccountApiService;
