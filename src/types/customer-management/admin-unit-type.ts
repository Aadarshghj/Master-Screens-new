export interface AdminUnitType {
  identity: string,
  adminUnitCode: string,
  description: string,
  adminUnitType: string,
  isActive: boolean,
  hierarchyLevel: number | undefined
}

export interface AdminUnitData {
  adminUnitCode: string,
  isActive: boolean,
  description: string | null;
  adminUnitType: string,
  hierarchyLevel: number
}

export interface AdminUnitRequestDto 
extends Record<string, unknown> {
  adminUnitTypeName : string,
  description : string,
  isActive : boolean,
  adminUnitTypeCode : string,
  hierarchyLevel: number
}

export interface AdminUnitResponseDto {
  identity: string,
  name : string,
  description : string,
  isActive : boolean,
  code : string,
  hierarchyLevel: number
}
