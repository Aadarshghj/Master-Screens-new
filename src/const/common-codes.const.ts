const draftCode = "DRAFT";
const pendingApproval = "PENDING_APPROVAL";
const customerAddressTypeEntityTypeId = 1;
const documentCode = {
  drivingLicence: "DL",
  panCard: "PAN",
  aadharCard: "AADHAAR",
  passport: "PASSPORT",
  voterId: "VOTER ID",
  unknown: "UNKNOWN",
};
const marriedCode = "be4aeb3d-fadf-48e9-978f-6d83db99c538";
const mimeTypes: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export {
  draftCode,
  customerAddressTypeEntityTypeId,
  documentCode,
  pendingApproval,
  mimeTypes,
  marriedCode,
};
