export type SchemeDetailRow = {
  schemeCode: string;
  schemeName: string;
  ltv: number;
  interestRate: number;
  schemeExposure: number;
  totalEligibleLoanAmount: number;
  tenor: number;
};

export interface Scheme {
  id: string;

  schemeCode: string;
  schemeName: string;

  ltv: number;
  interestRate: number;

  schemeExposure: number;
  totalEligibleLoanAmount: number;
  approxInterest: number;
  eligibleSchemeAmount: number;
  tenor: number;
}

export interface SchemeSelectionModalProps {
  isOpen: boolean;
  close: () => void;
  onSelect: (scheme: Scheme) => void;
}

export interface OverallExplosureModalProps {
  isOpen: boolean;
  close: () => void;
}

export interface OverallExposureRow {
  id: string;

  accountNo: string;
  product: string;
  scheme: string;

  loanDate: string;
  disbursementAmnt: number;

  principalOs: number;
  interestOs: number;
  totalOs: number;

  lastPaymentDate: string;
  lastRepaymentDate: string;
}

export interface AuditIrregularityRow {
  branchCode: string;
  branchName: string;
  auditDate: string;
  loanAccountNo: string;
  irregularityType: string;
  irregularityDetails: string;
  irregularityWeight: number;
  irregularityAmount: number;
  recoveredAmount: number;
  pendingIrregularityAmount: number;
}

export interface AuditIrregularityModalProps {
  isOpen: boolean;
  close: () => void;
}
