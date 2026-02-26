export interface RiskAssessmentTypeHistory{
    identity:string
    riskAssessmentType:string;
    description:string;
    isActive:boolean;
}
export interface RiskAssessTypeRequestDto
  extends Record<string, unknown> {
  riskAssessmentType: string;
  description: string;
  isActive: boolean;
}

export interface RiskAssessTypeResponseDto{
    riskAssessmentType:string;
    description:string;
    isActive:boolean;
    identity:string
}

export interface Option {
  value: string;
  label: string;
}
export interface RiskAssessTypeTableRow {
  value: string;
  label: string;
}
