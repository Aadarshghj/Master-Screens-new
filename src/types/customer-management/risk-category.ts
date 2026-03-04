export interface RiskCategoryType {
  id: string;
  riskCategoryCode: string;
  riskCategoryName: string;
}

export type RiskCategoryResponseDto = {
  category: string;
  code: string;
  identity: string;
};

export type RiskCategoryRequestDto = {
  category: string;
  code: string;
};
