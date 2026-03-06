export interface GstRegistrationType {
  gstRegType: string,
  description: string,
  isActive: boolean,
  identity?: string,
}

export interface GstRegistrationData {
  gstRegType: string,
  description: string | null;
  isActive: boolean,
}
