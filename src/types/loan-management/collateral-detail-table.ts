export interface CaratOption {
  label: string;
  value: string;
}

export interface CollateralDetailRow {
  ornamentName: string;
  ornamentType: string;

  caratType: string;
  carat: string;
  purityPercentage?: number;

  quantity?: number;
  grossWeight?: number;
  isBroken?: boolean;
  deductedWeight?: number;
  deductionReason?: string;
  netWeight?: number;

  ratePerGram?: number;
  marketValue?: number;
  collateralValue?: number;
  eligibleLoanAmount?: number;

  ownershipType?: "PURCHASED" | "INHERITED" | "GIFTED";
  yearOfPurchase?: number;
  purchasedFrom?: string;

  giftedPersonName?: string;
  giftedPersonRelation?: string;

  remarks?: string;
  ornamentLivePhoto: string;
  accuracy: number;
}

export interface Props {
  isOpen: boolean;
  close: () => void;
  onSubmit: (data: CollateralDetailRow) => void;
}

export interface CollateralDetailsTableProps {
  data: CollateralDetailRow[];
  onDelete: (rowIndex: number) => void;
}
