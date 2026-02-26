export interface LeadSource {
  id: string;
  leadSourceName: string;
  description: string;
}

export type LeadSourceResponseDto = {
  name: string;
  description: string;
  identity: string;
  isActive: boolean;
};

export type LeadSourceRequestDto = {
  name: string;
  description: string;
};
