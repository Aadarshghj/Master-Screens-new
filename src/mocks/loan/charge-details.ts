import type { ChargeRow } from "@/types/loan-management/charge-details";

export const INITIAL_DATA: ChargeRow[] = [
  {
    chargeName: "Processing Fee",
    amount: 100,
    cgst: 0.0,
    sgst: 0.0,
    igst: 0.0,
    cess: 0.0,
    incl: 0.0,
    total: 100,
  },
];
