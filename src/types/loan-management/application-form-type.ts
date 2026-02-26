// import type { CollateralDetailRow } from "./collateral-detail-table";

export interface Option {
  label: string;
  value: string;
}

export interface ApplicationInformationFormValues {
  applicationDate: string;
  applicationBranch: Option | null;
  lendingRate: number;
  collateralType: Option | null;
  applicationNumber: string;
  customerCode: string;
  customerName: string;
  contactNo: string;
  loanPurpose: Option | null;
  overallLoanExpense: number;
  nomineeName: string;
  nomineeDob: string;
  nomineeRelation: Option | null;
  customerPhotoUrl: string;
  canvassedType: string;
  canvasserId: string;
  inventoryNumber: number;
  totalGoldWeight: string;
  eligibleAmount: number;
  requestedAmount: number;
  approxInterest: number;
  approvedAmount: number;
  appraiserOneId: string;
  appraiserOneName: string;
  appraiserOneType: Option | null;
  appraiserTwoId: string;
  appraiserTwoName: string;
  appraiserTwoType: Option | null;
  // collateralDetails: CollateralDetailRow[];
}
