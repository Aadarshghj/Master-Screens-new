import { api } from "@/api";
import { apiInstance } from "../../api-instance";

export interface DocumentVerificationRequest {
  idNumber: string;
  kycId: number;
  dob?: string;
}

export interface DocumentVerificationResponse {
  isValid: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export const documentVerificationApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    verifyDocument: build.mutation<
      DocumentVerificationResponse,
      DocumentVerificationRequest
    >({
      query: ({ idNumber, kycId, dob }) => ({
        url: api.customer.validateKyc({ idNumber, kycId, dob }),
        method: "GET",
      }),
      transformResponse: (response: Record<string, unknown>) => {
        return {
          isValid: (response?.isValid as boolean) || false,
          message: (response?.message as string) || "Verification completed",
          data: response,
        };
      },
    }),
  }),
});

export const { useVerifyDocumentMutation } = documentVerificationApiService;
