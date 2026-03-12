export interface OrnamentNameData {
  ornamentTypeIdentity: string,
  ornamentCode: string,
  ornamentName: string,
  description: string,
  isActive: boolean,
  identity: string,
}

export interface OrnamentNameTable {
  ornamentType: string,
  ornamentCode: string,
  ornamentName: string,
  description: string,
  isActive: boolean,
  identity: string,
}

export interface OrnamentNameRequestDto 
extends Record<string, unknown> {
  // ornamentType: string,
  ornamentTypeIdentity: string,
  code: string,
  name: string,
  description: string,
  isActive: boolean,
}

export interface OrnamentNameResponseDto {
  ornamentType: string,
  code: string,
  name: string,
  description: string,
  isActive: boolean,
  identity: string,
}

export interface Option {
  value: string,
  label: string
}

export interface OrnamentTypeResponseDto{
  ornamentType: any;
  code?:string;
  identity:string;
  name: string,
  isActive?: boolean,
  description?: string 
}

export interface OrnamentType {
  name: string,
  code?: string,
  description?: string,
  isActive?: boolean,
  identity: string
}