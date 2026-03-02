export interface DepreciationMethodsType {
    id:string;
    depreciationType: string;
    calculationLogic: string;
    isActive:boolean;

}
export interface DepreciationMethodsRequestDto {
     depreciationType: string;
    calculationLogic?: string;
    isActive:boolean;

}
export interface DepreciationMethodsResponseDto {
     depreciationType: string;
    calculationLogic?: string;
    isActive:boolean;

}