export interface DesignationType {
  id: string;
  designationName: string;
  designationCode: string;
  level: number;
  occupation: string;
  description: string;
  managerial: boolean;
}

export type DesignationRequestDto = {
  name: string;
  code: string;
  description?: string;
  level: number;
  isManagerial: boolean;
  occupationIdentity: string;
};

export type DesignationResponseDto = {
  identity: string;
  name: string;
  code: string;
  description?: string;
  level: number;
  isManagerial: boolean;
  occupationIdentity: string;
};

export interface Option {
  value: string;
  label: string;
}
