// Import types from centralized type files
import type {
  InterestSlabFormData,
  InterestSlabTableData,
  InterestSlabsProps,
} from "@/types/loan-product-and schema Stepper/interest-slabs.types";

export const interestSlabDefaultFormValues: InterestSlabFormData = {
  loanScheme: "",
  startPeriod: "",
  endPeriod: "",
  fromAmount: "",
  toAmount: "",
  slabInterestRate: "",
  annualROI: "30",
  rebateAnnualROI: "",
  recomputationRequired: false,
  expired: false,
};

export type { InterestSlabFormData, InterestSlabTableData, InterestSlabsProps };
