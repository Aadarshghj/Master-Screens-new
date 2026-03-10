export interface BankConfig {
  bankCode: string,
  bankName: string,
  isActive: boolean,
  interestRate: undefined | number,
  interestCalcOn: string,
  handoff: string,
  mode: boolean,
  clmId: boolean, 
}

export interface BankConfigData {
  bankCode: string;
  bankName: string;
  interestRate: number;
  mode: boolean;
  isActive: boolean;
}

export interface Options {
  value: string;
  label: string;
}