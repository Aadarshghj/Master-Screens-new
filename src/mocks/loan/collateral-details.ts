import type { Option } from "@/types/loan-management/application-form-type";
import type { CaratOption } from "@/types/loan-management/collateral-detail-table";

export const ornamentOptions: Option[] = [
  { label: "Chain", value: "CHAIN" },
  { label: "Ring", value: "RING" },
  { label: "Bangle", value: "BANGLE" },
];

export const caratTypeOptions: Option[] = [
  { label: "22K", value: "22K" },
  { label: "24K", value: "24K" },
];

export const caratOptions: CaratOption[] = [
  { label: "22", value: "22" },
  { label: "24", value: "24" },
];

export const deductionReasonOptions: Option[] = [
  { label: "Stone Weight", value: "STONE_WEIGHT" },
  { label: "Impurity", value: "IMPURITY" },
];

export const ownershipTypeOptions: Option[] = [
  { label: "Purchased", value: "PURCHASED" },
  { label: "Inherited", value: "INHERITED" },
  { label: "Gifted", value: "GIFTED" },
];

export const relationshipOptions: Option[] = [
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Spouse", value: "SPOUSE" },
];
