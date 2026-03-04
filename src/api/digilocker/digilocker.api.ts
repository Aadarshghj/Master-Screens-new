import type { DigilockerVerifyRequest } from "@/global/service/end-points/digilocker/digilocker.api";

export const digilocker = {
  getSessionUrl: () => "/ext/digilocker/get-sessionUrl",
  verifyStatus: ({ decentroTxnId, kycType }: DigilockerVerifyRequest) =>
    `/api/v1/digilocker-verifications/txn/${decentroTxnId}?kycType=${kycType}`,
};
