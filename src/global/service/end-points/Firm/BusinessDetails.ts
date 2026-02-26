import type { BusinessInformation } from "@/types/firm/firm-businessInfo";
import { apiInstance } from "../../api-instance";
import { api } from "@/api";

export interface BusinessInfoResponse {
  identity?: string;
  customerIdentity: string;
  natureOfBusiness: string;
  yearsInOperation: number;
  annualTurnover: number;
  noOfEmployees: number;
  noOfBranchesOffices: number;
  dateOfIncorporation: string;
  authorizedCapital: number;
  issuedCapital: number;
  paidUpCapital: number;
  netWorth: number;
  website: string;
  businessEmail: string;
  isEmailVerified: boolean;
  contactNumber: string;
  customerConcentrationPercent: number;
  otherSourceIncome: number;
  seasonality: string;
  sectorPerformance: string;
  capacityUtilizationPercent: number;
  productDiversification: string;
  utilitiesAvailability: string;
  businessDescription: string;
  profitabilityLast5Years: Array<{ year: number; amount: number }>;
}

// Save payload builder (for POST - create)
const buildSavePayload = (data: BusinessInformation) => {
  return {
    // tenatIdentity: "1563455e-fb89-4049-9cbe-02148017e1e6",
    natureOfBusiness: data.natureOfBusiness || "",
    yearsInOperation: data.yearsInOperation
      ? parseInt(data.yearsInOperation, 10) || 0
      : 0,
    annualTurnover: data.annualTurnover
      ? parseFloat(data.annualTurnover) || 0.0
      : 0.0,
    noOfEmployees: data.noOfEmployees
      ? typeof data.noOfEmployees === "string"
        ? parseInt(data.noOfEmployees.split("-")[0], 10) || 0
        : data.noOfEmployees
      : 0,
    noOfBranchesOffices: data.noOfBranchesOffices
      ? typeof data.noOfBranchesOffices === "string"
        ? parseInt(data.noOfBranchesOffices.split("-")[0], 10) || 0
        : data.noOfBranchesOffices
      : 0,
    dateOfIncorporation: data.dateOfIncorporation || "",
    authorizedCapital: data.authorizedCapital
      ? parseFloat(data.authorizedCapital) || 0.0
      : 0.0,
    issuedCapital: data.issuedCapital
      ? parseFloat(data.issuedCapital) || 0.0
      : 0.0,
    paidUpCapital: data.paidUpCapital
      ? parseFloat(data.paidUpCapital) || 0.0
      : 0.0,
    netWorth: data.netWorth ? parseFloat(data.netWorth) || 0.0 : 0.0,
    website: data.website || "",
    businessEmail: data.businessEmail || "",
    isEmailVerified: true,
    contactNumber: data.mobileNumber || "",
    customerConcentrationPercent: data.customerConcentration
      ? parseFloat(data.customerConcentration) || 0.0
      : 0.0,
    otherSourceIncome: data.otherSourceIncome || "",
    seasonality: data.seasonality || "",
    sectorPerformance: data.sectorPerformance || "",
    capacityUtilizationPercent: data.capacityUtilization
      ? parseFloat(data.capacityUtilization) || 0.0
      : 0.0,
    productDiversification: data.productClassification || "",
    utilitiesAvailability: Array.isArray(data.utilitiesAvailability)
      ? data.utilitiesAvailability.join(", ")
      : data.utilitiesAvailability || "",
    businessDescription: data.businessDescription || "",
    // createdBy: 101,
    profitabilityLast5Years: (data.profitabilityData || []).map(item => ({
      year: parseInt(item.year || "0", 10) || 0,
      amount: parseFloat(item.amount || "0") || 0.0,
    })),
  };
};

// Update payload builder (for POST - update)
const buildUpdatePayload = (data: BusinessInformation) => {
  return {
    // tenatIdentity: "1563455e-fb89-4049-9cbe-02148017e1e6",
    natureOfBusiness: data.natureOfBusiness || "",
    yearsInOperation: data.yearsInOperation
      ? parseInt(data.yearsInOperation, 10) || 0
      : 0,
    annualTurnover: data.annualTurnover
      ? parseFloat(data.annualTurnover) || 0.0
      : 0.0,
    noOfEmployees: data.noOfEmployees
      ? typeof data.noOfEmployees === "string"
        ? parseInt(data.noOfEmployees.split("-")[0], 10) || 0
        : data.noOfEmployees
      : 0,
    noOfBranchesOffices: data.noOfBranchesOffices
      ? typeof data.noOfBranchesOffices === "string"
        ? parseInt(data.noOfBranchesOffices.split("-")[0], 10) || 0
        : data.noOfBranchesOffices
      : 0,
    dateOfIncorporation: data.dateOfIncorporation || "",
    authorizedCapital: data.authorizedCapital
      ? parseFloat(data.authorizedCapital) || 0.0
      : 0.0,
    issuedCapital: data.issuedCapital
      ? parseFloat(data.issuedCapital) || 0.0
      : 0.0,
    paidUpCapital: data.paidUpCapital
      ? parseFloat(data.paidUpCapital) || 0.0
      : 0.0,
    netWorth: data.netWorth ? parseFloat(data.netWorth) || 0.0 : 0.0,
    website: data.website || "",
    businessEmail: data.businessEmail || "",
    isEmailVerified: true,
    contactNumber: data.mobileNumber || "",
    customerConcentrationPercent: data.customerConcentration
      ? parseFloat(data.customerConcentration) || 0.0
      : 0.0,
    otherSourceIncome: data.otherSourceIncome || "",
    seasonality: data.seasonality || "",
    sectorPerformance: data.sectorPerformance || "",
    capacityUtilizationPercent: data.capacityUtilization
      ? parseFloat(data.capacityUtilization) || 0.0
      : 0.0,
    productDiversification: data.productClassification || "",
    utilitiesAvailability: Array.isArray(data.utilitiesAvailability)
      ? data.utilitiesAvailability.join(", ")
      : data.utilitiesAvailability || "",
    businessDescription: data.businessDescription || "",
    // createdBy: 101,
    profitabilityLast5Years: (data.profitabilityData || []).map(item => ({
      year: parseInt(item.year || "0", 10) || 0,
      amount: parseFloat(item.amount || "0") || 0.0,
    })),
  };
};

export const firmBusinessInfoApiService = apiInstance.injectEndpoints({
  endpoints: build => ({
    // Get customer UUID by customer code
    getCustomerByCode: build.query<
      { identity: string; customerCode: string },
      string
    >({
      query: customerCode => ({
        url: api.customer.getGuardian({ customerCode }),
        method: "GET",
      }),
      transformResponse: (response: unknown) => {
        if (Array.isArray(response) && response.length > 0) {
          return response[0] as { identity: string; customerCode: string };
        }
        return response as { identity: string; customerCode: string };
      },
    }),

    // Get business information by firm ID
    getBusinessInfoByFirmId: build.query<
      BusinessInfoResponse | null,
      { customerIdentity: string }
    >({
      query: ({ customerIdentity }) => {
        return {
          url: api.firm.getBusinessInfo({
            customerIdentity,
          }),
          method: "GET",
        };
      },
      providesTags: (_result, _error, { customerIdentity }) => [
        { type: "BusinessInfo", id: customerIdentity },
      ],
      keepUnusedDataFor: 300, // Keep cached data for 5 minutes
    }),

    // Create business information
    saveBusinessInfo: build.mutation<
      BusinessInfoResponse,
      { firmId: string; businessData: BusinessInformation }
    >({
      query: ({ firmId, businessData }) => {
        const payload = buildSavePayload(businessData);

        return {
          url: api.firm.saveBusinessInfo({ firmId }),
          method: "POST" as const,
          data: payload,
        };
      },
      invalidatesTags: (_result, _error, { firmId }) => [
        { type: "BusinessInfo", id: firmId },
      ],
    }),

    // Update business information
    updateBusinessInfo: build.mutation<
      BusinessInfoResponse,
      {
        firmId: string;
        data: BusinessInformation;
      }
    >({
      query: ({ firmId, data }) => {
        const payload = buildUpdatePayload(data);

        return {
          url: api.firm.updateBusinessInfo({ firmId }),
          method: "POST" as const,
          data: payload,
        };
      },
      invalidatesTags: (_result, _error, { firmId }) => [
        { type: "BusinessInfo", id: firmId },
      ],
    }),

    // Delete business information
    deleteBusinessInfo: build.mutation<void, string>({
      query: firmId => ({
        url: api.firm.deleteBusinessInfo({ firmId }),
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCustomerByCodeQuery,
  useLazyGetCustomerByCodeQuery,
  useGetBusinessInfoByFirmIdQuery,
  useLazyGetBusinessInfoByFirmIdQuery,
  useSaveBusinessInfoMutation,
  useUpdateBusinessInfoMutation,
  useDeleteBusinessInfoMutation,
} = firmBusinessInfoApiService;
