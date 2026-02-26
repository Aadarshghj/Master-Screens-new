export interface ProductServiceType {
  productServiceName: string;
  description?: string;
}

export interface ProductServiceRequestDto {
  name: string;
  description?: string;
}

export interface ProductServiceResponseDto {
  productServiceId: string;
  name: string;
  description?: string;
  identity: string;
}
