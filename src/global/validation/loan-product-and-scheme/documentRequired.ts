import * as yup from "yup";

export const documentRequirementValidationSchema = yup.object({
  loanScheme: yup.string().required("Loan Scheme is required"),
  document: yup.string().required("Document is required"),
  acceptanceLevel: yup.string().required("Acceptance Level is required"),

  mandatoryStatus: yup.boolean().required("Mandatory status is required"),
});

export const documentRequirementTableValidationSchema = yup.object({
  documents: yup
    .array()
    .of(documentRequirementValidationSchema)
    .min(1, "At least one document requirement must be configured")
    .test(
      "unique-documents",
      "Document types must be unique for each acceptance level",
      function (documents) {
        if (!documents) return true;

        const combinations = documents.map(
          doc => `${doc.document}-${doc.acceptanceLevel}`
        );
        return combinations.length === new Set(combinations).size;
      }
    )
    .test(
      "mandatory-documents",
      "At least one mandatory document must be specified",
      function (documents) {
        if (!documents) return true;
        return documents.some(doc => doc.mandatoryStatus === true);
      }
    ),
});

export const documentValidationByAcceptanceLevel = yup.object({
  preDisbursement: yup
    .array()
    .of(documentRequirementValidationSchema)
    .min(1, "At least one pre-disbursement document is required"),
  postDisbursement: yup
    .array()
    .of(documentRequirementValidationSchema)
    .optional(),
  preApproval: yup.array().of(documentRequirementValidationSchema).optional(),
  postApproval: yup.array().of(documentRequirementValidationSchema).optional(),
});

export type DocumentRequirementFormValidation = yup.InferType<
  typeof documentRequirementValidationSchema
>;
export type DocumentRequirementTableValidation = yup.InferType<
  typeof documentRequirementTableValidationSchema
>;
export type DocumentValidationByLevel = yup.InferType<
  typeof documentValidationByAcceptanceLevel
>;
