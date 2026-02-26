export interface Option {
  label: string;
  value: string;
}

export interface CustomerInformationFormValues {
  customerCode: string;
  customerName: string;
  contactNo: string;
  loanPurpose: Option | null;
  overallLoanExpense: number;
  nomineeName: string;
  nomineeDob: string;
  nomineeRelation: Option | null;
  customerPhotoUrl: string;
}
