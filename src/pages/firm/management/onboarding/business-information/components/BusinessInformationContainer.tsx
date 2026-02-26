import React from "react";
import { BusinessInformationForm } from "./Form/BusinessInformation";

import type { BusinessInformation } from "@/types/firm/firm-businessInfo";
import {
  useSendFirmOtpMutation,
  useVerifyFirmOtpMutation,
  useGetSectoralPerformancesQuery,
  useGetSeasonalityQuery,
  useGetFirmSourceOfIncomeQuery,
} from "@/global/service/end-points/master/firm-master";
import { useSaveBusinessInfoMutation } from "@/global/service/end-points/Firm/BusinessDetails";

interface BusinessInformationContainerProps {
  readonly?: boolean;
  onFormSubmit?: () => void;
  onSaveSuccess?: () => void;
  firmId?: string;
}
interface Seasonality {
  identity: string;
  season?: string;
  name?: string;
}

interface SectorPerformance {
  identity: string;
  sectorName?: string;
  name?: string;
}

export const BusinessInformationContainer: React.FC<
  BusinessInformationContainerProps
> = props => {
  const [sendOtp] = useSendFirmOtpMutation();
  const [verifyOtp] = useVerifyFirmOtpMutation();
  const [saveBusinessInfo] = useSaveBusinessInfoMutation();

  // Fetch master data
  const { data: seasonalityData = [] } = useGetSeasonalityQuery();
  const { data: sectorPerformanceData = [] } =
    useGetSectoralPerformancesQuery();
  const { data: sourceOfIncomeData = [] } = useGetFirmSourceOfIncomeQuery();

  // Transform data to options
  // Transform data to options
  const seasonalityOptions = seasonalityData.map((item: Seasonality) => ({
    value: item.identity,
    label: item.season || item.name || "",
    identity: item.identity,
  }));

  const sectorPerformanceOptions = sectorPerformanceData.map(
    (item: SectorPerformance) => ({
      value: item.identity,
      label: item.sectorName || item.name || "",
      identity: item.identity,
    })
  );

  const otherSourceIncomeOptions = sourceOfIncomeData.map(item => ({
    value: item.identity,
    label: item.name,
    identity: item.identity,
  }));

  const handleSendOtp = async (mobileNumber: string): Promise<void> => {
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

    await sendOtp(otpPayload).unwrap();
  };

  const handleVerifyOtp = async (otp: string): Promise<void> => {
    // This needs the requestId from sendOtp response
    // For now, using a placeholder - you'll need to store requestId from sendOtp
    await verifyOtp({ requestId: "placeholder", code: otp }).unwrap();
  };

  const handleVerifyEmail = async (): Promise<void> => {
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    const isVerified = Math.random() > 0.3;
    if (!isVerified) {
      throw new Error("Email verification failed");
    }
  };

  const handleSaveBusinessInfo = async (
    data: BusinessInformation
  ): Promise<void> => {
    if (!props.firmId) {
      throw new Error("Firm ID is required");
    }

    await saveBusinessInfo({
      firmId: props.firmId,
      businessData: data,
    }).unwrap();
  };

  return (
    <BusinessInformationForm
      {...props}
      onSendOtp={handleSendOtp}
      onVerifyOtp={handleVerifyOtp}
      onVerifyEmail={handleVerifyEmail}
      onSaveBusinessInfo={handleSaveBusinessInfo}
      seasonalityOptions={seasonalityOptions}
      sectorPerformanceOptions={sectorPerformanceOptions}
      otherSourceIncomeOptions={otherSourceIncomeOptions}
    />
  );
};
