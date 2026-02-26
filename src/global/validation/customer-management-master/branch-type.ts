import * as yup from "yup";

export const branchTypeSchema = yup.object({

    branchTypeIdentity: yup
    .string(),

    branchTypeCode: yup
  .string()
  .transform(v => v?.toUpperCase().trim())
  .required("Branch Type Code is required")
  .max(20,"Maximum 20 characters")
  .matches(
    /^[A-Z0-9_/]+$/,
    "Only uppercase letters, numbers, _ and / are allowed"
  )
    .test(
    "no-repeated-chars",
    "Repeated characters are not allowed",
    value => !value || !/(.)\1{2,}/.test(value)
  ),
    
    branchTypeName: yup
    .string() 
    .transform(v => v?.toUpperCase().trim())
    .required("Branch Type Name is required")
    .max(50,"Maximum 50 characters")
    .test(
    "no-repeated-chars",
    "Repeated characters are not allowed",
    value => !value || !/(.)\1{2,}/.test(value)
  ),

    branchTypeDesc: yup
    .string()
    .transform(v => v?.toUpperCase().trim())
    .max(200,"Maximum 200 characters")
    .test(
  "no-repeated",
  "Repeated words or symbols are not allowed",
  (value) => {
    if (!value) return true;

    if (/(.)\1{2,}/.test(value)) return false;

    const words = value.trim().toLowerCase().split(/\s+/);

    for (let i = 1; i < words.length; i++) {
      if (words[i] === words[i - 1]) return false;
    }

    return true;
  }
),
    isActive: yup
    .boolean(),
})