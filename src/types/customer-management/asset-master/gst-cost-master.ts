export interface GstCostMasterType {
    id:string;
    gstBreakup: string;
    gl:string;
    description: string;
    isActive:boolean;

}
export interface GstCostMasterRequestDto {
     gstBreakup: string;
    gl:string;
    description?: string;
    isActive:boolean;

}
export interface GstCostMasterResponseDto {
     gstBreakup: string;
    gl:string;
    description?: string;
    isActive:boolean;

}