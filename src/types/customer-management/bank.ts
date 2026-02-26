export interface Bank {
  id: string;
  bankCode: string;
  bankName: string;
  swiftBicCode: string;
  country: string;
  psu: boolean;
}

export type BankRequestDto = {
  bankName: string;
  bankCode: string;
  swiftBic: string;
  countryIdentity: string;
  isPsu?: boolean | null;
};

export type BankResponseDto = {
  identity: string;
  name: string;
  code: string;
  swiftBic: string;
  countryIdentity: string;
  isPsu?: boolean | null;
};

export interface Country {
  id: string;
  countryId: number;
  countryName: string;
  isActive: boolean;
}

export type CountryResponseDto = {
  identity: string;
  countryId: number;
  country: string;
  isActive: boolean;
};

export interface Option {
  value: string;
  label: string;
}
