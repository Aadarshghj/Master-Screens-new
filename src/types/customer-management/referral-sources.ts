export type ReferralSourceRequestDto = {
  name: string;
  code: string;
  description?: string;
};

export type ReferralSourceResponseDto = {
  identity: string;
  name: string;
  code: string;
};

export interface ReferralSource {
  id: string;
  referralCode: string;
  referralName: string;
}
