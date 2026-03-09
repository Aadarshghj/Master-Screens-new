export type PurchaseReqHeader = {
    requestedId: string;
    requestedDate: string;
    requestedOfficeId: string;
    requestedById: string;
}

export type PurchaseReqItemForm ={
    requestedItemId?: number;
    itemId: string;
    assetGroupId: string;
    assetTypeId: string;
    quantity: number;
    unit: string;
    modelManufacturer: string;
    estimatedAmount: number;
    desc: string;
    justification: string;
    specification: string;
    highPriority: boolean;
    supportingDocument?: File|null;
}

export type PurchaseReqItemRow ={
    id: number;
    itemName: string;
    requestedOffice: string;
    desc: string;
    priority: "High"|"Normal";
    modelManufacturer: string;
    quantity: number;
    unit: string;
    estimatedAmount: number;
    requestDate: string;
    requestedBy: string;
}

export type PurchaseRequestForm =
  PurchaseReqHeader &
  PurchaseReqItemForm