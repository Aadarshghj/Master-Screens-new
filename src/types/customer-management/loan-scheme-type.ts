export interface LoanSchemeTypeType {
    id:string;
    schemeTypeName: string;
    description: string;
    isActive:boolean;

}
export interface LoanSchemeTypeRequestDto {
     schemeTypeName?: string;
    description?: string;
    isActive:boolean;
}
export interface LoanSchemeTypeResponseDto {
     identity: string;
     schemeTypeName: string;
    description: string;
    isActive:boolean;
}