import * as yup from "yup";

export const adminUnitTypeSchema = yup.object({
  adminUnitType: yup
    .string()
    .required("Admin Unit Type name is required")
    .max(50, "Maximum 50 characters allowed"),

  adminUnitCode: yup
    .string()
    .required("Admin Unit Type code is required")
    .matches(/^[A-Za-z0-9_]+$/, "Admin Unit Type Code must contain only alphabets [A-Z], numbers(0-9) & underscores (_).")
    .max(10, "Maximum 10 characters allowed"),

  description: yup
    .string()
    .max(150, "Maximum 150 characters allowed"),
    
  isActive: yup
    .boolean(),
  
  identity: yup
  .string(),

 hierarchyLevel: yup
  .number()
    .typeError("Hierarchy must be a number")
    .transform(( originalValue) => {
      return originalValue === "" ? 0 : Number(originalValue);
    })
    .required("Hierarchy is required")
    .integer("Hierarchy must be an integer")
    .min(1, "Hierarchy must be 1 or greater")
    .max(50, "Hierarchy must be 50 or less"),
}); 