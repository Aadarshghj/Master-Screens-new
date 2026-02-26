export type PurposeResponseDto = {
  name: string;
  code: string;
  identity: string;
};

export type PurposeRequestDto = {
  name: string;
  code: string;
};

export type Purpose = {
  id: string;
  purposeType: string;
  purposeCode: string;
};
