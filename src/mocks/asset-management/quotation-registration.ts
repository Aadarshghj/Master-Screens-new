import type { QuotationReqData, QuotationDetailsData } from "@/types/asset-management/quotation-registration-type";

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

export const SUPPLIER_MOCK_DATA: QuotationDetailsData[] = [
  {
   itemName: "A",
   itemSpec: "A",
   model:"A",
   qtyAvailable: 5,
   qtyReq: 4,
   uom: "A",
   unitPrice: 100,
   amount: 7,
   sgstPercent: 5,
   sgst: "5",
   cgstPercent: 6,
   cgst: "6",
   igstPercent: 9,
   igst: "9"
  },

];