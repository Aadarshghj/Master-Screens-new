
export type PurchaseStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export const PRODUCT_REQ_STATUS_OPTIONS: SelectOption<
  PurchaseStatus | "ALL"
>[] = [
  { label: "All", value: "ALL" },
  { label: "Draft", value: "DRAFT" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export const PRODUCT_REQ_PRODUCT_OPTIONS: SelectOption<string>[] = [
  { label: "All", value: "ALL" },
  { label: "Weighing Machine", value: "WEIGHING MACHINE" },
  { label: "Laptop", value: "LAPTOP" },
  { label: "Printer", value: "PRINTER" },
];

export const PRODUCT_REQ_DEFAULT_FILTER = {
  status: "ALL" as PurchaseStatus | "ALL",
  product: "ALL",
};