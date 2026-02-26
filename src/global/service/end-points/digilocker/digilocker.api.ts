import { apiInstance } from "@/global/service";
import { digilocker } from "@/api/digilocker/digilocker.api";

export interface DigilockerSessionResponse {
  decentroTxnId: string;
  status: string;
  responseCode: string;
  message: string;
  data: {
    url: string;
  };
  ttl: number;
}

export interface DigilockerVerifyResponse {
  status: "SUCCESS" | "FAILED";
  aadhaarResponse?: {
    data?: {
      pdf?: string;
    };
  };
}

export interface DigilockerVerifyRequest {
  decentroTxnId: string;
  kycType: string;
}

export const digilockerApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    getDigilockerSessionUrl: build.query<DigilockerSessionResponse, void>({
      query: () => ({
        url: digilocker.getSessionUrl(),
        method: "GET",
      }),
    }),

    verifyDigilockerStatus: build.query<
      DigilockerVerifyResponse,
      DigilockerVerifyRequest
    >({
      query: params => ({
        url: digilocker.verifyStatus(params),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyGetDigilockerSessionUrlQuery,
  useLazyVerifyDigilockerStatusQuery,
} = digilockerApiService;
