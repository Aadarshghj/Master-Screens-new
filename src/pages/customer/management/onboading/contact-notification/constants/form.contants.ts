import type { ContactFormData } from "@/types/customer/contact.types";

export const DEFAULT_CONTACT_VALUES: ContactFormData = {
  contactType: "mobile",
  contactTypeId: "",
  contactDetails: "",
  isPrimary: false,
  isActive: true,
  isOptOutPromotionalNotification: false,
  isVerified: false,
};

export const REQUIRED_CONTACT_FIELDS: (keyof ContactFormData)[] = [
  "contactType",
  "contactDetails",
];

export const CONTACT_CONFIG = {
  OTP_LENGTH: 6,
  OTP_TTL_SECONDS: 60,
  OTP_FALLBACK_TIMER: 90,
  TENANT_ID: 1,
  BRANCH_CODE: "ID-001",
  TEMPLATE_CATALOG_IDENTITY: "74829315-9ff1-4055-94c8-beeddf4de7af",
  TEMPLATE_CONTENT_IDENTITY: "fae09f0a-8470-4000-9969-586667b2366e",
  CUSTOMER_IDENTITY: 12345,
  CREATED_BY: 101,
  UPDATED_BY: 101,
  MIN_RESEND_COUNT_FOR_ADMIN: 2,
} as const;

export const CONTACT_TYPE_OPTIONS = [
  { value: "mobile", label: "Mobile" },
  { value: "email", label: "Email" },
  { value: "landline", label: "Landline" },
] as const;

export const getContactInputType = (
  contactType: string
): "email" | "tel" | "text" => {
  switch (contactType.toLowerCase()) {
    case "email":
      return "email";
    case "mobile":
    case "landline":
      return "tel";
    default:
      return "text";
  }
};

export const getContactPlaceholder = (contactType: string): string => {
  switch (contactType.toLowerCase()) {
    case "email":
      return "Enter email address";
    case "mobile":
      return "Enter mobile number";
    case "landline":
      return "Enter landline number";
    default:
      return "Enter contact details";
  }
};

export const calculateTimerFromExpiry = (expiresAt: string): number => {
  const expiryTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();
  return Math.max(0, Math.floor((expiryTime - currentTime) / 1000));
};
