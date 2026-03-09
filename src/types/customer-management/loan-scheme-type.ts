export interface LoanSchemeTypeType {
    id:string;
    schemeTypeName: string;
    schemeTypeDescription: string;
    isActive:boolean;

}
export interface LoanSchemeTypeRequestDto {
     schemeTypeName?: string;
    schemeTypeDescription?: string;
    isActive:boolean;
}
export interface LoanSchemeTypeResponseDto {
     schemeTypeName?: string;
    schemeTypeDescription?: string;
    isActive:boolean;
}