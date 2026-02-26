import * as yup from "yup";

export const firmDocumentSchema = yup.object().shape({
  firmType: yup.string().required("Firm Type is required"),
  documentType: yup.string().required("Document Type is required"),
  idNumber: yup
    .string()
    .required("ID Number is required")

    // PAN
    .test("pan-format", "PAN must be in format: AAAAA9999A", function (value) {
      const { documentType } = this.parent;
      if (documentType === "PAN" && value) {
        const clean = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
        return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(clean);
      }
      return true;
    })

    // Aadhaar
    .test(
      "aadhaar-format",
      "Aadhaar must be 12 digits and should not start with 0 or 1",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "AADHAAR" && value) {
          const digitsOnly = value.replace(/\D/g, "");
          return /^[2-9][0-9]{11}$/.test(digitsOnly);
        }
        return true;
      }
    )

    // Driving License
    .test(
      "dl-format",
      "Driving License must be in format: KA01 20230012345 (State + RTO + Year + Serial)",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "DL" && value) {
          const clean = value.replace(/\s+/g, " ").trim().toUpperCase();
          return /^[A-Z]{2}[0-9]{2}\s?[0-9]{4}[0-9]{7}$/.test(clean);
        }
        return true;
      }
    )

    // Passport
    .test(
      "passport-format",
      "Passport must be in format: A1234567",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "PASSPORT" && value) {
          const clean = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
          return /^[A-Z][0-9]{7}$/.test(clean);
        }
        return true;
      }
    )

    // Voter ID
    .test(
      "voterid-format",
      "Voter ID must be in format: ABC1234567",
      function (value) {
        const { documentType } = this.parent;
        if (documentType === "VOTER ID" && value) {
          const clean = value.replace(/\s+/g, "").toUpperCase();
          return /^[A-Z]{3}[0-9]{7}$/.test(clean);
        }
        return true;
      }
    ),

  documentFile: yup.mixed().nullable(),
  isActive: yup.boolean().default(true),
});

export type FirmDocumentFormData = yup.InferType<typeof firmDocumentSchema>;
