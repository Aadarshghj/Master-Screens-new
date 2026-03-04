import * as yup from "yup";

export const collateralSchema = yup.object({
  ornamentType: yup.string().required("Ornament Type is required"),
  ornamentName: yup.string().required("Ornament Name is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required"),
  caratType: yup.string().required("Carat Type is required"),
  purityPercentage: yup
    .number()
    .typeError("Purity % must be a number")
    .min(0, "Purity % cannot be negative")
    .max(100, "Purity % cannot exceed 100")
    .required("Purity % is required"),
  carat: yup.string().required("Carat is required"),
  grossWeight: yup
    .number()
    .typeError("Gross Weight must be a number")
    .positive("Gross Weight must be greater than 0")
    .required("Gross Weight is required"),
  isBroken: yup.boolean(),
  deductedWeight: yup
    .number()
    .typeError("Deducted Weight must be a number")
    .min(0, "Deducted Weight cannot be negative")
    .required("Deducted Weight is required"),
  deductionReason: yup.string().required("Deduction Reason is required"),
  netWeight: yup
    .number()
    .typeError("Net Weight must be a number")
    .positive("Net Weight must be greater than 0")
    .required("Net Weight is required"),
  ratePerGram: yup
    .number()
    .typeError("Rate per Gram must be a number")
    .positive("Rate per Gram must be greater than 0")
    .required("Rate per Gram is required"),
  marketValue: yup
    .number()
    .typeError("Market Value must be a number")
    .positive("Market Value must be greater than 0")
    .required("Market Value is required"),
  collateralValue: yup
    .number()
    .typeError("Collateral Value must be a number")
    .positive("Collateral Value must be greater than 0")
    .required("Collateral Value is required"),
  ownershipType: yup.string().required("Ownership Type is required"),
  yearOfPurchase: yup
    .number()
    .typeError("Year of Purchase is required")
    .required("Year of Purchase is required"),
  purchasedFrom: yup.string().required("Purchased From is required"),
  giftedPersonName: yup.string().when("ownershipType", {
    is: "GIFTED",
    then: schema => schema.required("Gifted Person Name is required"),
    otherwise: schema => schema.notRequired(),
  }),
  giftedPersonRelation: yup.string().when("ownershipType", {
    is: "GIFTED",
    then: schema => schema.required("Gifted Person Relationship is required"),
    otherwise: schema => schema.notRequired(),
  }),
  remarks: yup.string().notRequired(),
  accuracy: yup
    .number()
    .typeError("Accuracy must be a number")
    .min(0, "Accuracy cannot be less than 0")
    .max(100, "Accuracy cannot exceed 100")
    .required("Accuracy is required"),
  ornamentLivePhoto: yup.string().nullable(),
});
