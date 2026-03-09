import type { QuotationReqData } from "@/types/asset-management/quotation-registration-type";

export const QUOTATION_MOCK_DATA: QuotationReqData[] = [
  {
   quotReqId: "QR/1034",
    quotReqDesc: "Items for HO",
    quotReqItem: "Laptop, Desktop, ...",
    quotReqDate: "12-02-2026",
    status: "Pending",
  },
  {
    quotReqId: "QR/1033",
    quotReqDesc: "Purchase for Kalamassery Branch",
    quotReqItem: "Router, Printer, ...",
    quotReqDate: "11-01-2026",
    status: "Quotation Received",
  },
  {
    quotReqId: "QR/1032",
    quotReqDesc: "Items for IT Department",
    quotReqItem: "Laptop, Desktop, ...",
    quotReqDate: "10-02-2026",
    status: "Quotation Received",
  },
];