import { createAxiosInstance } from "@/global/service/axios-instance";
import { firm } from "@/api/firm/firm.api";
import type { BusinessInformation } from "@/types/firm/firm-businessInfo";
import { ENV } from "@/config";

const axiosInstance = createAxiosInstance(ENV.API_BASE_URL);

export const businessInformationService = {
  sendOtp: async (mobileNumber: string): Promise<void> => {
    const otpPayload = {
      tenantId: 1,
      branchCode: "ID-001",
      templateCatalogIdentity: "74829315-9ff1-4055-94c8-beeddf4de7af",
      templateContentIdentity: "fae09f0a-8470-4000-9969-586667b2366e",
      target: `+91${mobileNumber}`,
      customerIdentity: 12345,
      length: 6,
      ttlSeconds: 300,
    };

    await axiosInstance.post(firm.sendOtp(), otpPayload);
  },

  verifyOtp: async (): Promise<void> => {
    // Implementation depends on your OTP verification logic
    await new Promise(resolve => setTimeout(resolve, 1000));
  },

  verifyEmail: async (): Promise<void> => {
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    const isVerified = Math.random() > 0.3;
    if (!isVerified) {
      throw new Error("Email verification failed");
    }
  },

  saveBusinessInfo: async (
    firmId: string,
    data: BusinessInformation
  ): Promise<void> => {
    await axiosInstance.post(firm.saveBusinessInfo({ firmId }), data);
  },
};
