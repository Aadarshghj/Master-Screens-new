import * as yup from "yup";

export const chargeDetailsValidationSchema = yup.object().shape({
  chargeCode: yup.string().when("$isEditMode", {
    is: true,
    then: schema => schema.required("Charge Code is required"),
    otherwise: schema => schema.optional(),
  }),
  chargeName: yup
    .string()
    .required("Charge Name is required")
    .min(2, "Charge Name must be at least 2 characters")
    .max(100, "Charge Name must not exceed 100 characters"),
  module: yup
    .string()
    .required("Module is required")
    .test("not-empty", "Module is required", value => value?.trim() !== ""),
  subModule: yup
    .string()
    .required("Sub Module is required")
    .test("not-empty", "Sub Module is required", value => value?.trim() !== ""),
  calculationOn: yup
    .string()
    .required("Calculation On is required")
    .test(
      "not-empty",
      "Calculation On is required",
      value => value?.trim() !== ""
    ),
  chargeCalculation: yup
    .string()
    .required("Charge Calculation is required")
    .test(
      "not-empty",
      "Charge Calculation is required",
      value => value?.trim() !== ""
    ),
  chargeIncomeGLAccount: yup
    .string()
    .required("Charge Income GL Account is required")
    .test(
      "not-empty",
      "Charge Income GL Account is required",
      value => value?.trim() !== ""
    ),
  monthAmount: yup
    .string()
    .required("Month/Amount is required")
    .test(
      "not-empty",
      "Month/Amount is required",
      value => value?.trim() !== ""
    ),
  calculationCriteria: yup
    .string()
    .required("Calculation Criteria is required")
    .test(
      "not-empty",
      "Calculation Criteria is required",
      value => value?.trim() !== ""
    ),
  chargesPostingRequired: yup.boolean().default(false),
  isActive: yup.boolean().default(true),
});

export const calculationLogicValidationSchema = yup.object().shape({
  calculationLogics: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number(),
        upToAmount: yup
          .string()
          .required("Up To Amount is required")
          .matches(/^\d+(\.\d{1,2})?$/, "Up To Amount must be a valid number"),
        chargeAmountPercentage: yup
          .string()
          .required("Charge Amount/Percentage is required")
          .matches(
            /^(\d+\.?\d*%?|\d*\.\d+%?)$/,
            "Must contain only numbers, decimal point (.), and percent sign (%)"
          )
          .test(
            "valid-percentage",
            "Percentage value cannot exceed 100%",
            value => {
              if (!value) return true;
              if (value.includes("%")) {
                const numValue = parseFloat(value.replace("%", ""));
                return numValue <= 100;
              }
              return true;
            }
          ),
      })
    )
    .default([])
    .min(1, "At least one calculation logic entry is required"),
});

export const stateConfigurationValidationSchema = yup.object().shape({
  specificToState: yup.boolean().default(false),
  selectedStates: yup
    .array()
    .of(yup.string().required())
    .default([])
    .when("specificToState", {
      is: true,
      then: schema =>
        schema.min(
          1,
          "At least one state must be selected when specific to state is enabled"
        ),
      otherwise: schema => schema,
    }),
  northZoneEnabled: yup.boolean().default(false),
  southZoneEnabled: yup.boolean().default(false),
});

export const taxConfigurationValidationSchema = yup.object().shape({
  ifTaxApplicable: yup.boolean().default(false),
  taxInclusive: yup.string().when("ifTaxApplicable", {
    is: true,
    then: schema => schema.required("Tax Inclusive is required"),
    otherwise: schema => schema.optional(),
  }),

  singleTaxMethod: yup.boolean().default(false),
  singleTaxMethodValue: yup
    .string()
    .when(["ifTaxApplicable", "singleTaxMethod"], {
      is: (tax: boolean, single: boolean) => tax && single,
      then: schema => schema.required("Single Tax Method is required"),
      otherwise: schema => schema.optional(),
    }),

  cgstApplicable: yup.boolean().default(false),
  cgstPercentage: yup.string().when(["ifTaxApplicable", "cgstApplicable"], {
    is: (tax: boolean, cgst: boolean) => tax && cgst,
    then: schema =>
      schema
        .required("CGST Percentage is required")
        .matches(/^\d+(\.\d{1,2})?$/, "Percentage must be a valid number")
        .test(
          "max-percentage",
          "Percentage cannot exceed 100",
          value => !value || parseFloat(value) <= 100
        ),
    otherwise: schema => schema.optional(),
  }),
  cgstGLAccount: yup.string().when(["ifTaxApplicable", "cgstApplicable"], {
    is: (tax: boolean, cgst: boolean) => tax && cgst,
    then: schema => schema.required("CGST GL Account is required"),
    otherwise: schema => schema.optional(),
  }),

  sgstApplicable: yup.boolean().default(false),
  sgstPercentage: yup.string().when(["ifTaxApplicable", "sgstApplicable"], {
    is: (tax: boolean, sgst: boolean) => tax && sgst,
    then: schema =>
      schema
        .required("SGST Percentage is required")
        .matches(/^\d+(\.\d{1,2})?$/, "Percentage must be a valid number")
        .test(
          "max-percentage",
          "Percentage cannot exceed 100",
          value => !value || parseFloat(value) <= 100
        ),
    otherwise: schema => schema.optional(),
  }),
  sgstGLAccount: yup.string().when(["ifTaxApplicable", "sgstApplicable"], {
    is: (tax: boolean, sgst: boolean) => tax && sgst,
    then: schema => schema.required("SGST GL Account is required"),
    otherwise: schema => schema.optional(),
  }),

  igstApplicable: yup.boolean().default(false),
  igstPercentage: yup.string().when(["ifTaxApplicable", "igstApplicable"], {
    is: (tax: boolean, igst: boolean) => tax && igst,
    then: schema =>
      schema
        .required("IGST Percentage is required")
        .matches(/^\d+(\.\d{1,2})?$/, "Percentage must be a valid number")
        .test(
          "max-percentage",
          "Percentage cannot exceed 100",
          value => !value || parseFloat(value) <= 100
        ),
    otherwise: schema => schema.optional(),
  }),
  igstGLAccount: yup.string().when(["ifTaxApplicable", "igstApplicable"], {
    is: (tax: boolean, igst: boolean) => tax && igst,
    then: schema => schema.required("IGST GL Account is required"),
    otherwise: schema => schema.optional(),
  }),

  cessApplicable: yup.boolean().default(false),
  cessPercentage: yup.string().when(["ifTaxApplicable", "cessApplicable"], {
    is: (tax: boolean, cess: boolean) => tax && cess,
    then: schema =>
      schema
        .required("CESS Percentage is required")
        .matches(/^\d+(\.\d{1,2})?$/, "Percentage must be a valid number")
        .test(
          "max-percentage",
          "Percentage cannot exceed 100",
          value => !value || parseFloat(value) <= 100
        ),
    otherwise: schema => schema.optional(),
  }),
  cessGLAccount: yup.string().when(["ifTaxApplicable", "cessApplicable"], {
    is: (tax: boolean, cess: boolean) => tax && cess,
    then: schema => schema.required("CESS GL Account is required"),
    otherwise: schema => schema.optional(),
  }),
});

export const chargeMasterValidationSchema = yup.object().shape({
  chargeDetails: chargeDetailsValidationSchema,
  calculationLogic: calculationLogicValidationSchema,
  stateConfiguration: stateConfigurationValidationSchema,
  taxConfiguration: taxConfigurationValidationSchema,
});
