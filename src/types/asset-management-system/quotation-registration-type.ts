export interface QuotationFilter {
    reqId: string;
    status: string;
}

export interface Options {
    value: string;
    label: string;
}

export interface QuotationReqData {
    id?: string;
    quotReqId: string;
    quotReqDesc: string;
    quotReqItem: string;
    quotReqDate: string;
    status: string;
}

export interface QuotReqDetails {
    quotReqDate: string;
    quotReqId: string;
    reqBy: string;
    description: string;
}

export interface SupplierDetails {
    supplierName: string;
    quotationNumber: number;
    quotationDate: string;
    quotationAmount: number;
}

export interface QuotationDetailsData {
    itemName: string;
    itemSpec: string;
    model: string;
    qtyReq: number | undefined;
    qtyAvailable: string;
    uom: string;
    unitPrice: string;
    amount: string;
    sgstPercent: string;
    sgst: string;
    cgstPercent: string;
    cgst: string;
    igstPercent: string;
    igst: string;
}

export interface OtherChargesData {
  chargeName: string;
  chargeAmount: number | string;
}

export interface Terms {
    termsAndC: string;
    totQuot: string;
}

export interface UploadQuot {
    uploadQuot: File | null;
}