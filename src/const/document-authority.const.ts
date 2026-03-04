export interface DocumentAuthority {
  documentCode: string;
  documentName: string;
  issuingAuthorityName: string;
  issuingAuthorityAddress: string;
}

export const DOCUMENT_AUTHORITY_DATA: DocumentAuthority[] = [
  {
    documentCode: "ADH",
    documentName: "Aadhaar Card",
    issuingAuthorityName: "UIDAI",
    issuingAuthorityAddress: "Government of India, New Delhi",
  },
  {
    documentCode: "EID",
    documentName: "Voter ID",
    issuingAuthorityName: "ECI",
    issuingAuthorityAddress: "Nirvachan Sadan, Ashoka Road, New Delhi - 110001",
  },
  {
    documentCode: "DL",
    documentName: "Driving License",
    issuingAuthorityName: "RTO",
    issuingAuthorityAddress: "RTO Office",
  },
  {
    documentCode: "PAN",
    documentName: "PAN Card",
    issuingAuthorityName: "ITD",
    issuingAuthorityAddress: "Central Board of Direct Taxes, New Delhi",
  },
  {
    documentCode: "RID",
    documentName: "Ration Card",
    issuingAuthorityName: "FCSD",
    issuingAuthorityAddress: "Food & Civil Supplies Dept",
  },
  {
    documentCode: "PGP",
    documentName: "Customer Photo",
    issuingAuthorityName: "Photograph of the customer",
    issuingAuthorityAddress: "Customer provided photograph",
  },
];

// Helper function to get authority data by document code
export const getDocumentAuthorityByCode = (
  documentCode: string
): DocumentAuthority | undefined => {
  return DOCUMENT_AUTHORITY_DATA.find(doc => doc.documentCode === documentCode);
};

// Helper function to get all document codes for dropdown options
export const getDocumentOptions = () => {
  return DOCUMENT_AUTHORITY_DATA.map(doc => ({
    value: doc.documentCode,
    label: doc.documentName,
  }));
};
