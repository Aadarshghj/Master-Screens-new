import type { KycFormData } from "@/types";

export interface KycDiagnosticResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  missingFields: string[];
  recommendations: string[];
}

export const diagnoseKycForm = (
  data: KycFormData,
  documentType: string
): KycDiagnosticResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingFields: string[] = [];
  const recommendations: string[] = [];

  // Check required fields
  if (!data.documentType) {
    errors.push("Document type is required");
    missingFields.push("documentType");
  }

  if (!data.idNumber || data.idNumber.trim() === "") {
    errors.push("ID number is required");
    missingFields.push("idNumber");
  }

  if (!data.documentFile) {
    errors.push("Document file is required");
    missingFields.push("documentFile");
  }

  // Driving License specific checks
  if (documentType === "DL") {
    // Check DL number format
    if (data.idNumber) {
      const dlRegex = /^[A-Z]{2}[0-9]{2}\s?[0-9]{4}[0-9]{7}$/;
      const cleanValue = data.idNumber
        .replace(/\s+/g, " ")
        .trim()
        .toUpperCase();
      if (!dlRegex.test(cleanValue)) {
        errors.push(
          "Driving License must be in format: KA01 20230012345 (State + RTO + Year + Serial)"
        );
      }
    }

    // Check required fields for DL
    if (!data.placeOfIssue || data.placeOfIssue.trim() === "") {
      errors.push("Place of issue is required for Driving License");
      missingFields.push("placeOfIssue");
    }

    if (!data.issuingAuthority || data.issuingAuthority.trim() === "") {
      errors.push("Issuing authority is required for Driving License");
      missingFields.push("issuingAuthority");
    }

    if (!data.validFrom || data.validFrom.trim() === "") {
      errors.push("Valid from date is required for Driving License");
      missingFields.push("validFrom");
    }

    if (!data.validTo || data.validTo.trim() === "") {
      errors.push("Valid to date is required for Driving License");
      missingFields.push("validTo");
    }

    // if (!data.nameOnDocument || data.nameOnDocument.trim() === "") {
    //   errors.push("Name on document is required for Driving License");
    //   missingFields.push("nameOnDocument");
    // }

    if (!data.dateOfBirth || data.dateOfBirth.trim() === "") {
      errors.push("Date of birth is required for Driving License");
      missingFields.push("dateOfBirth");
    }

    // Check date validity
    if (data.validFrom && data.validTo) {
      const fromDate = new Date(data.validFrom);
      const toDate = new Date(data.validTo);

      if (fromDate >= toDate) {
        errors.push("Valid from date must be before valid to date");
      }

      if (toDate < new Date()) {
        warnings.push("Driving License appears to be expired");
      }
    }

    // Check DOB validity
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      if (age < 18) {
        warnings.push("Person appears to be under 18 years old");
      }

      if (age > 100) {
        warnings.push("Date of birth appears to be invalid");
      }
    }
  }

  // File validation
  if (data.documentFile && data.documentFile instanceof File) {
    // Check file size
    if (data.documentFile.size > 2 * 1024 * 1024) {
      errors.push("File size must be less than 2MB");
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedTypes.includes(data.documentFile.type)) {
      errors.push("File type must be JPG, PNG, JPEG, or PDF");
    }
  }

  // General recommendations
  if (data.documentVerified === false) {
    recommendations.push("Consider verifying the document before submission");
  }

  if (data.activeStatus === false) {
    recommendations.push("Document is marked as inactive");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    missingFields,
    recommendations,
  };
};

export const getKycSubmissionBlockers = (
  data: KycFormData,
  documentType: string
): string[] => {
  const diagnostic = diagnoseKycForm(data, documentType);
  return diagnostic.errors;
};

export const getKycFormCompleteness = (
  data: KycFormData,
  documentType: string
): number => {
  const diagnostic = diagnoseKycForm(data, documentType);
  const totalFields = getTotalRequiredFields(documentType);
  const completedFields = totalFields - diagnostic.missingFields.length;
  return Math.round((completedFields / totalFields) * 100);
};

const getTotalRequiredFields = (documentType: string): number => {
  const baseFields = 3; // documentType, idNumber, documentFile

  if (documentType === "DL") {
    return baseFields + 6; // + placeOfIssue, issuingAuthority, validFrom, validTo, nameOnDocument, dateOfBirth
  }

  return baseFields;
};
