import { combineReducers } from "@reduxjs/toolkit";
import { apiInstance } from "../service";
import { authSlice } from "../reducers";
import { menuSlice } from "../reducers/menu.reducer";
import { kycSlice } from "../reducers/customer/kyc.reducer";
import { basicInfoSlice } from "../reducers/customer/basicinfo.reducer";
import { photoSlice } from "../reducers/customer/photo.reducer";
import { addressSlice } from "../reducers/customer/address.reducer";
import { contactSlice } from "../reducers/customer/contact.reducer";
import { customerIdentitySlice } from "../reducers/customer/customer-identity.reducer";
import { form60IdentitySlice } from "../reducers/customer/form60-identity.reducer";
import firmOnboardingReducer from "../reducers/firm/firmOnboarding.reducer";
import { leadDetailsSlice } from "../reducers/lead/lead-details.reducer";
import { panDetailsSubmitSlice } from "../reducers/customer/pan-card-status.reducer";
import { panDetailsSubmitViewSlice } from "../reducers/customer/pan-card-status.reducer-view";
import { loanProductSlice } from "../reducers/loan-stepper/loan-product.reducer";
import { loanStepperSlice } from "@/hooks/loan-stepper.reducer";
import loanSchemeAttributesReducer from "@/global/reducers/loan/loan-scheme-attributes.reducer";
import loanSchemePropertiesReducer from "@/global/reducers/loan/loan-scheme-properties.reducer";
import glAccountTypesReducer from "@/global/reducers/loan/gl-account-types.reducer";
import loanBusinessRulesReducer from "@/global/reducers/loan/business-rules.reducer";
import chargeMasterReducer from "@/global/reducers/loan/charge-master.reducer";
import { formDirtySlice } from "../reducers/form-dirty.reducer";
import { FormDirtyViewSlice } from "../reducers/form-dirty-view.reducer";
import { viewformUnsavedWarningSlice } from "../reducers/view-form-unsaved-warning.reducer";
import { formUnsavedWarningSlice } from "../reducers/form-unsaved-warning.reducer";
import { formDirtyModalSlice } from "../reducers/form-dirty-modal.reducer";
import { formWarningModalSlice } from "../reducers/form-warning-modal.reducer";
import { formForwardSlice } from "../reducers/form-forward-page.reducer";
import { formDisableNextSlice } from "../reducers/form-disable-next.reducer";
import { viewFormDisableNextSlice } from "../reducers/form-disable-next.-view-reducer";
import { viewFormWarningModalSlice } from "../reducers/form-warning-modal-view.reducer";
import { customerDataSlice } from "../reducers/customer/customer-details.reducer";
import { customerIdentityViewSlice } from "../reducers/customer/customer-identity-view.reducer";
import workflowDefinitionsReducer from "@/global/reducers/approval-workflow/workflow-definitions.reducer";
import workflowActionsReducer from "@/global/reducers/approval-workflow/workflow-actions.reducer";
import approverRoleMappingReducer from "@/global/reducers/approval-workflow/approver-role-mapping.reducer";
import { formDirtyViewModalSlice } from "../reducers/form-dirty-modal-view.reducer";
import { approvalConfirmationModalSlice } from "../reducers/approval-confirmation.reducer";
import { approvalViewModalSlice } from "../reducers/approval-workflow/approval-view-modal.reducer";
import { PrefillSlice } from "../reducers/customer/prefill-kyc-data.reducer";
import { loanFormDirtySlice } from "../reducers/loan-stepper/loan-form-dirty.reducer";

// import { leadAssignmentApiService } from "../service/end-points/lead/lead-assignment";

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  menu: menuSlice.reducer,
  kyc: kycSlice.reducer,
  basicInfo: basicInfoSlice.reducer,
  photo: photoSlice.reducer,
  address: addressSlice.reducer,
  contact: contactSlice.reducer,
  customerIdentity: customerIdentitySlice.reducer,
  customerIdentityView: customerIdentityViewSlice.reducer,
  form60Identity: form60IdentitySlice.reducer,
  firmOnboarding: firmOnboardingReducer,
  [apiInstance.reducerPath]: apiInstance.reducer,
  leadDetails: leadDetailsSlice.reducer,
  panDetails: panDetailsSubmitSlice.reducer,
  panDetailsView: panDetailsSubmitViewSlice.reducer,
  customerData: customerDataSlice.reducer,
  loanProduct: loanProductSlice.reducer,
  loanStepper: loanStepperSlice.reducer,
  loanFormDirty: loanFormDirtySlice.reducer,
  loanSchemeAttributes: loanSchemeAttributesReducer,
  loanSchemeProperties: loanSchemePropertiesReducer,
  glAccountTypes: glAccountTypesReducer,
  loanBusinessRules: loanBusinessRulesReducer,
  workflowDefinitions: workflowDefinitionsReducer,
  workflowActions: workflowActionsReducer,
  approverRoleMapping: approverRoleMappingReducer,
  formDirty: formDirtySlice.reducer,
  viewformDirty: FormDirtyViewSlice.reducer,
  formDirtyModal: formDirtyModalSlice.reducer,
  formDirtyViewModal: formDirtyViewModalSlice.reducer,
  formWarningModal: formWarningModalSlice.reducer,
  viewFormWarningModal: viewFormWarningModalSlice.reducer,
  viewUnsavedformWarning: viewformUnsavedWarningSlice.reducer,
  unsavedformWarning: formUnsavedWarningSlice.reducer,
  formForward: formForwardSlice.reducer,
  formDisableNext: formDisableNextSlice.reducer,
  viewFormDisableNext: viewFormDisableNextSlice.reducer,
  approvalConfirmationModal: approvalConfirmationModalSlice.reducer,
  approvalViewModal: approvalViewModalSlice.reducer,
  chargeMaster: chargeMasterReducer,
  prefillKycData: PrefillSlice.reducer,
  // [leadAssignmentApiService.reducerPath]: leadAssignmentApiService.reducer,
});

export default rootReducer;
