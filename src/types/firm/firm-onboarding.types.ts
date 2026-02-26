export interface AssociatedPerson {
  customerIdentity: string;
  customerName: string;
  roleInFirmIdentity: string;
  authorizedSignatory: boolean;
  durationWithCompany: number;
}

export interface FirmOnboardingData {
  firmTypeIdentity: string;
  branchIdentity: string;
  firmName: string;
  industryCategoryIdentity: string;
  registrationNo: string;
  registrationDate: string;
  canvassedTypeIdentity: string;
  canvasserIdentity: string;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
  associatedPersons: AssociatedPerson[];
}
