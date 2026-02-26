export interface Form60FormData {
  // Form Details Section
  customerId?: number;
  branchId: string | number;
  customerName: string;
  dateOfBirth: string;
  fatherName: string;
  // Address Information Section
  flatRoomNo: string;
  roadStreetLane: string;
  areaLocality: string;
  townCity: string;
  district: string;
  state: string;
  pinCode: string;
  mobileNumber: string;
  identity?: string;
  // Income Details Section
  sourceOfIncome: string;
  agriculturalIncome: number | string;
  otherIncome: number | string;
  taxableIncome: number | string;
  nonTaxableIncome: number | string;

  // Additional Details Section
  modeOfTransaction: "CASH" | "BANK" | "ONLINE";
  transactionAmount: number | string;
  transactionDate: string;
  numberOfPersons: number | string;
  panCardApplicationDate: string;
  panCardApplicationAckNo: string;

  // Identity Support Document Section
  pidDocumentCode: string;
  pidDocumentId: string | number; // UUID for backend
  pidDocumentNo: string;
  pidIssuingAuthority: string;

  // Address Support Document Section
  addDocumentCode: string;
  addDocumentId: string | number; // UUID for backend
  addDocumentNo: string;
  addIssuingAuthority: string;

  // Additional fields from your payload
  maskedAdhar: string;
  telephoneNumber: string;
  floorNumber: string;
  nameOfPremises: string;

  // Backend/System Fields (auto-filled)
  submissionDate: string;
  formFileId: number | string;
  createdBy?: number;

  // DMS File Upload Fields
  docRefId?: string;
  fileName?: string;
  filePath?: string;
}
export interface Form60GetDto {
  transactionAmount: number;
  transactionDate: string;
  modeOfTransaction: string;
  numberOfPersons: number;
  agriculturalIncome: number;
  otherIncome: number;
  taxableIncome: number;
  nonTaxableIncome: number;
  panCardApplicationDate: string;
  panCardApplicationAckNo: string;
  pidDocumentId: number;
  pidDocumentNo: string;
  pidIssuingAuthority: string;
  addDocumentId: number;
  addDocumentNo: string;
  addIssuingAuthority: string;
  submissionDate: string;
  formFileId: number;
  filePath: string;
  docRefId: string;
  telephoneNumber: string;
  floorNumber: string;
  nameOfPremises: string;
  maskedAdhar: string;
  branchId: number | null;
  identity: string;
}

export interface Form60Response
  extends Omit<Form60FormData, "customerId" | "createdBy"> {
  id?: number;
  identity?: string; // Add identity field for UUID
  createdAt?: string;
  updatedAt?: string;
}

export interface Form60HistoryRecord {
  id: number;
  date: string;
  customerId: string;
  transactionAmount: number;
  modeOfTransaction: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

// Backend payload structure (matches your actual payload)
export interface Form60BackendPayload {
  branchId: string; // UUID string
  transactionAmount: number;
  transactionDate: string;
  modeOfTransaction: "CASH" | "BANK" | "ONLINE";
  numberOfPersons: number;
  agriculturalIncome: number;
  otherIncome: number;
  taxableIncome: number;
  nonTaxableIncome: number;
  panCardApplicationDate?: string;
  panCardApplicationAckNo: string;
  pidDocumentId: string; // UUID string
  addDocumentId: string; // UUID string
  pidDocumentNo: string;
  pidIssuingAuthority: string;
  addDocumentNo: string;
  addIssuingAuthority: string;
  submissionDate: string;
  formFileId: number;
  maskedAdhar: string;
  telephoneNumber: string;
  floorNumber: string;
  nameOfPremises: string;
  createdBy: number;
}

export type CreateForm60Request = Form60BackendPayload;
export type UpdateForm60Request = Form60BackendPayload;

// Form 60 Page Types
export interface Form60FormProps {
  readonly?: boolean;
  editMode?: boolean;
  form60Id?: number;
  customerIdentity?: string | null;
  form60Identity?: string;
}

export interface Form60Document {
  id: string;
  documentName: string;
  documentType: string;
  createdOn: string;
  customerId: string;
  form60Id: string;
  status?: string;
  isActive?: boolean;
  filePath?: string;
}

export interface Form60TableProps {
  customerIdentity?: string | null;
  form60Data?: Form60Response; // Form60 data from the form component
  customerDetails?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
  }; // Customer details for name
  readOnly?: boolean;
}

export interface Form60PageProps {
  customerIdentity?: string | null;
  readOnly?: boolean;
}
