import { auth } from "./auth/auth.api";
import { customer } from "./customer/customer.api";
import { master } from "./master/master.api";
import { lead } from "./lead/lead.api";
import { leadMaster } from "./master/lead-master.api";
import { dms } from "./dms/dms.api";
import { firmMaster } from "./master/firm-master.api";
import { firm } from "./firm/firm.api";
import { files } from "./files/files.api";
import { loan } from "./loan/loan.api";
import { workflowStages } from "./workflow/stages.api";
import { occupation } from "./customer-management/occupation";
import { purposes } from "./customer-management/purpose";
import { customerGroup } from "./customer-management/groupMaster";
import { agentMaster } from "./customer-management/agentMaster";
import { industryCategory } from "./customer-management/industryCategoryMaster";
import { sitePremise } from "./customer-management/sitePremise";
import { productService } from "./customer-management/productService";
import { documentMaster } from "./customer-management/documentMaster";
import { documentType } from "./customer-management/documentType";
import { workflow } from "./approval-workflow/workflow.api";
import { riskCategories } from "./customer-management/risk-category";
import { leadSources } from "./customer-management/lead-sources";
import { designation } from "./customer-management/designation";
import { referralSources } from "./customer-management/referral-sources";
import { bank } from "./customer-management/bank";
import { firmType } from "./customer-management/firm-type";
import { sectoralPerformances } from "./customer-management/sectoral-performances";
import { firmRole } from "./customer-management/firm-role";
import { staff } from "./customer-management/staff";
import { sourceOfIncome } from "./customer-management/source-of-income";
import { branchContact } from "./customer-management/branch-contact";
import { customerCategory } from "./customer-management/customer-category";
import { loanMaster } from "./master/loan-master.api";
import { loanStepper } from "./loan/loanStepper.api";
import { UserRoleMaster } from "./customer-management/userRoleMaster.ts";
import { roleManagement } from "./customer-management/roleManagement";
import { userReg } from "./customer-management/user-reg";
import { riskAssessmentType } from "./customer-management/risk-assessment-type.ts";
import { adminUnitType } from "./customer-management/admin-unit-type";
import { branchType } from "./customer-management/branch-type.ts";
import { designationRoleMapping } from "./customer-management/designationRoleMapping.ts";
import { tenant } from "./customer-management/tenant";


export const api = { 
  tenant,
  auth,
  customer,
  master,
  lead,
  leadMaster,
  dms,
  firmMaster,
  firm,
  files,
  loan,
  workflowStages,
  occupation,
  purposes,
  customerGroup,
  adminUnitType, 
  agentMaster,
  industryCategory,
  sitePremise,
  productService,
  documentMaster,
  documentType,
  workflow,
  riskCategories,
  leadSources,
  designation,
  referralSources,
  bank,
  firmType,
  sectoralPerformances,
  firmRole,
  staff,
  sourceOfIncome,
  branchContact,
  customerCategory,
  loanStepper,
  loanMaster,
  UserRoleMaster,
  roleManagement,
  userReg,
  riskAssessmentType,
  branchType,
  designationRoleMapping,
};

export {
  dmsApi,
  useGetDMSFileUrlQuery,
  useGetDMSPreSignedUrlMutation,
} from "./customer/files/files.api";
