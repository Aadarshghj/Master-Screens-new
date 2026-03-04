import type {
  ChargeMasterFormData,
  SaveChargeMasterPayload,
  StateZoneConfig,
} from "@/types/loan-product-and-scheme-masters/charge-master.types";

export const transformChargeMasterFormToPayload = (
  formData: ChargeMasterFormData,
  allStates: StateZoneConfig[] = []
): SaveChargeMasterPayload => {
  const {
    chargeDetails,
    calculationLogic,
    stateConfiguration,
    taxConfiguration,
  } = formData;

  const calculationSlabsDTO = calculationLogic.calculationLogics.map(logic => ({
    upToAmount: parseFloat(logic.upToAmount),
    chargeAmountPercentage: parseFloat(
      logic.chargeAmountPercentage.replace("%", "").trim()
    ),
  }));
  const stateConfigsDTO = stateConfiguration.specificToState
    ? stateConfiguration.selectedStates.map(identity => ({
        stateZoneConfigIdentity: identity,
        applicable: true,
      }))
    : allStates.map(state => ({
        stateZoneConfigIdentity: state.identity,
        applicable: true,
      }));

  const taxConfigsDTO: SaveChargeMasterPayload["taxConfigsDTO"] = {
    taxApplicable: taxConfiguration.ifTaxApplicable,
    taxTreatmentIdentity: taxConfiguration.taxInclusive || undefined,
    singleTaxMethod: taxConfiguration.singleTaxMethod,
    singleTaxMethodIdentity: taxConfiguration.singleTaxMethodValue || undefined,
    cgstApplicable: taxConfiguration.cgstApplicable,
    cgstPercentage:
      taxConfiguration.cgstApplicable && taxConfiguration.cgstPercentage
        ? parseFloat(taxConfiguration.cgstPercentage)
        : undefined,
    cgstGlAccountIdentity:
      taxConfiguration.cgstApplicable && taxConfiguration.cgstGLAccount
        ? taxConfiguration.cgstGLAccount
        : undefined,
    sgstApplicable: taxConfiguration.sgstApplicable,
    sgstPercentage:
      taxConfiguration.sgstApplicable && taxConfiguration.sgstPercentage
        ? parseFloat(taxConfiguration.sgstPercentage)
        : undefined,
    sgstGlAccountIdentity:
      taxConfiguration.sgstApplicable && taxConfiguration.sgstGLAccount
        ? taxConfiguration.sgstGLAccount
        : undefined,
    igstApplicable: taxConfiguration.igstApplicable,
    igstPercentage:
      taxConfiguration.igstApplicable && taxConfiguration.igstPercentage
        ? parseFloat(taxConfiguration.igstPercentage)
        : undefined,
    igstGlAccountIdentity:
      taxConfiguration.igstApplicable && taxConfiguration.igstGLAccount
        ? taxConfiguration.igstGLAccount
        : undefined,
    cessApplicable: taxConfiguration.cessApplicable,
    cessPercentage:
      taxConfiguration.cessApplicable && taxConfiguration.cessPercentage
        ? parseFloat(taxConfiguration.cessPercentage)
        : undefined,
    cessGlAccountIdentity:
      taxConfiguration.cessApplicable && taxConfiguration.cessGLAccount
        ? taxConfiguration.cessGLAccount
        : undefined,
  };

  // final payload
  const payload: SaveChargeMasterPayload = {
    chargeName: chargeDetails.chargeName,
    moduleIdentity: chargeDetails.module,
    subModuleIdentity: chargeDetails.subModule,
    calculationBasisIdentity: chargeDetails.calculationOn,
    calculationTypeIdentity: chargeDetails.chargeCalculation,
    incomeGlAccountIdentity: chargeDetails.chargeIncomeGLAccount,
    monthAmountTypeIdentity: chargeDetails.monthAmount,
    calculationCriteriaIdentity: chargeDetails.calculationCriteria,
    chargesPostingRequired: chargeDetails.chargesPostingRequired,
    calculationSlabsDTO,
    stateConfigsDTO,
    taxConfigsDTO,
  };

  return payload;
};

// Validates if all required data is present before save
export const validateChargeMasterData = (
  formData: ChargeMasterFormData
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate charge details
  if (!formData.chargeDetails.chargeName?.trim()) {
    errors.push("Charge Name is required");
  }
  if (!formData.chargeDetails.module) {
    errors.push("Module is required");
  }
  if (!formData.chargeDetails.subModule) {
    errors.push("Sub Module is required");
  }
  if (!formData.chargeDetails.calculationOn) {
    errors.push("Calculation On is required");
  }
  if (!formData.chargeDetails.chargeCalculation) {
    errors.push("Charge Calculation is required");
  }
  if (!formData.chargeDetails.chargeIncomeGLAccount) {
    errors.push("Charge Income GL Account is required");
  }
  if (!formData.chargeDetails.monthAmount) {
    errors.push("Month/Amount is required");
  }
  if (!formData.chargeDetails.calculationCriteria) {
    errors.push("Calculation Criteria is required");
  }

  // Validate calculation logic
  if (formData.calculationLogic.calculationLogics.length === 0) {
    errors.push("At least one calculation logic entry is required");
  }

  // Validate state configuration
  if (
    formData.stateConfiguration.specificToState &&
    formData.stateConfiguration.selectedStates.length === 0
  ) {
    errors.push(
      "At least one state must be selected when specific to state is enabled"
    );
  }

  // Validate tax configuration
  if (formData.taxConfiguration.ifTaxApplicable) {
    if (!formData.taxConfiguration.taxInclusive) {
      errors.push("Tax Treatment is required when tax is applicable");
    }

    if (formData.taxConfiguration.singleTaxMethod) {
      if (!formData.taxConfiguration.singleTaxMethodValue) {
        errors.push("Single Tax Method value is required");
      }
    }

    // Validate CGST
    if (formData.taxConfiguration.cgstApplicable) {
      if (!formData.taxConfiguration.cgstPercentage) {
        errors.push("CGST Percentage is required");
      }
      if (!formData.taxConfiguration.cgstGLAccount) {
        errors.push("CGST GL Account is required");
      }
    }

    // Validate SGST
    if (formData.taxConfiguration.sgstApplicable) {
      if (!formData.taxConfiguration.sgstPercentage) {
        errors.push("SGST Percentage is required");
      }
      if (!formData.taxConfiguration.sgstGLAccount) {
        errors.push("SGST GL Account is required");
      }
    }

    // Validate IGST
    if (formData.taxConfiguration.igstApplicable) {
      if (!formData.taxConfiguration.igstPercentage) {
        errors.push("IGST Percentage is required");
      }
      if (!formData.taxConfiguration.igstGLAccount) {
        errors.push("IGST GL Account is required");
      }
    }

    // Validate CESS
    if (formData.taxConfiguration.cessApplicable) {
      if (!formData.taxConfiguration.cessPercentage) {
        errors.push("CESS Percentage is required");
      }
      if (!formData.taxConfiguration.cessGLAccount) {
        errors.push("CESS GL Account is required");
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
