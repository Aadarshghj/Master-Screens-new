export interface Occupation {
  occupationType: string;
}

export interface OccupationRequestDto {
  occupationName: string;
}

export interface OccupationResponseDto {
  identity: string;
  occupationName: string;
  isActive: boolean;
}

export interface OccupationTableRow {
  value: string;
  label: string;
}
