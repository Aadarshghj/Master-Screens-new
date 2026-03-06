export interface UnitOfMeasureType {
    id:string;
    unitCode: string;
    description: string;

}
export interface UnitOfMeasureRequestDto {
     unitCode?: string;
    description?: string;
}
export interface UnitOfMeasureResponseDto {
     unitCode?: string;
    description?: string;
}