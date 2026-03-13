import type { QuotationReqData, QuotationDetailsData, OtherChargesData } from "@/types/asset-management-system/quotation-registration-type";

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
   itemName: "Laptop",
   itemSpec: "Ram-8Gb, Processor-i5, Display-14",
   model:"Dell - Inspiron",
   qtyAvailable: "2",
   qtyReq: 1,
   uom: "NOS",
   unitPrice: "",
   amount: "",
   sgstPercent: "",
   sgst: "",
   cgstPercent: "",
   cgst: "",
   igstPercent: "",
   igst: ""
  },
  {
   itemName: "Desktop",
   itemSpec: "Ram-4Gb, Processor-i3, Display-24",
   model:"Dell - Pro 24",
   qtyAvailable: "2",
   qtyReq: 1,
   uom: "NOS",
   unitPrice: "",
   amount: "",
   sgstPercent: "",
   sgst: "",
   cgstPercent: "",
   cgst: "",
   igstPercent: "",
   igst: ""
  },
];

export const CHARGE_MOCK_DATA: OtherChargesData[] = [
  {
    chargeName: "TRANSPORTATION CHARGES",
    chargeAmount: ""
  },
  {
    chargeName: "MOVING CHARGES",
    chargeAmount: ""
  },
  {
    chargeName: "DUTY CHARGES",
    chargeAmount: ""
  },
  {
    chargeName: "HANDLING CHARGES",
    chargeAmount: ""
  }
]