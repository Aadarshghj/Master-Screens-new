import type { ConfirmationModalData } from "@/layout/BasePageLayout";

export interface ContactCaptureResponse {
  contactId: string;
  customerId: string;
  contactType: ContactType;
  contactTypeId: string;
  contactDetails: string;
  isPrimary: boolean;
  isActive: boolean;
  isOptOutPromotionalNotification: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  contactIdentity?: string;
}

export interface NotificationPreferences {
  sms: boolean;
  email: boolean;
  whatsapp: boolean;
  consentSms?: boolean;
  consentEmail?: boolean;
  consentWhatsapp?: boolean;
  isOptOutPromotionalNotification?: boolean;
}

export interface ContactFormData {
  contactId?: string;
  contactType: ContactType;
  contactTypeId: string;
  contactDetails: string;
  isPrimary: boolean;
  isActive: boolean;
  isOptOutPromotionalNotification: boolean;
  isVerified: boolean;
  contactIdentity?: string;
}

export interface SaveContactRequest {
  // customerId: string;
  // contactId?: string; // Optional for create, required for update
  contactType: string; // This should be the UUID
  contactDetails: string;
  isPrimary: boolean;
  isActive: boolean;
  isOptOutPromotionalNotification: boolean;
  isVerified: boolean;
}

export interface ContactFormProps {
  onFormSubmit?: (data: ContactFormData) => void;
  initialData?: Partial<ContactFormData>;
  readonly?: boolean;
  customerIdentity?: string | null;
  editForm?: boolean;
  onCloseEdit: () => void;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export type ContactType = "mobile" | "email" | "whatsapp";

export interface ContactNotificationPageProps {
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface ContactTableProps {
  onEditContact?: (contact: ContactFormData) => void;
  customerIdentity?: string | null;
  isView?: boolean;
  readOnly?: boolean;
  handleSetConfirmationModalData?: (data: ConfirmationModalData) => void;
  confirmationModalData?: ConfirmationModalData;
}

export interface NotificationPreferencesProps {
  customerId: string;
  readOnly?: boolean;
}
