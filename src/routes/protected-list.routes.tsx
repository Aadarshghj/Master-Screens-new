import Home from "@/pages/home";
import type { RouteObject } from "react-router-dom";
import { ProtectedRoutes } from "./protected.route";
import { CustomerOnboardingPage } from "@/pages/customer/management/onboading";
import { LeadDetailsPage } from "@/pages/lead/lead-and-sales/lead-details";
import { LeadFollowupPage } from "@/pages/lead/lead-and-sales/lead-followup";
import { LeadAssignmentPage } from "@/pages/lead/lead-and-sales/lead-assignment";
import { FirmOnboardingPage } from "@/pages/firm/management/onboarding";
import { LoanProductSchemeOnboardingPage } from "@/pages/loan-product-and-scheme-stepper/management/onboarding";
import { LoanSchemeAttributesPage } from "@/pages/loan-product-and-scheme-masters/loan-scheme-attributes";
import { LoanSchemePropertiesPage } from "@/pages/loan-product-and-scheme-masters/loan-scheme-properties";
import { GLAccountTypesPage } from "@/pages/loan-product-and-scheme-masters/gl-account-types-loan";
import { LoanBusinessRulesPage } from "@/pages/loan-product-and-scheme-masters/business-rules-loan";
import { WorkflowApproverRoleMappingPage } from "@/pages/admin/approval-workflow";
// import { LoanApplicationPage } from "@/pages/loan-management-system/managing-loan-application";
import { DocumentMasterPage } from "@/pages/customer-management/document-master";
import { DocumentTypePage } from "@/pages/customer-management/document-type";
import { FirmTypePage } from "@/pages/customer-management/firm-type";
import { DesignationPage } from "@/pages/customer-management/designation";
import { ReferralSourcesPage } from "@/pages/customer-management/referal-sources";
import { BanksPage } from "@/pages/customer-management/banks";
import { IndustryCategoryPage } from "@/pages/customer-management/industry-category";
import { SitePremisePage } from "@/pages/customer-management/site-premise";
import { ProductServicePage } from "@/pages/customer-management/product-service";
import { SectoralPerformancePage } from "@/pages/customer-management/sectoral-performance";
import { FirmRolePage } from "@/pages/customer-management/firm-role";
import { RiskCategoryPage } from "@/pages/customer-management/risk-category";
import { CustomerGroupMasterPage } from "@/pages/customer-management/customer-group-master";
import { AgentMasterPage } from "@/pages/customer-management/agent-master";
import { StaffPage } from "@/pages/customer-management/staffs";
import { LeadSourcePage } from "@/pages/customer-management/lead-source";
import { OccupationPage } from "@/pages/customer-management/occupation";
import { PurposePage } from "@/pages/customer-management/purpose";
import { SourceOfIncomePage } from "@/pages/customer-management/source-of-income";
import { BranchContactPage } from "@/pages/customer-management/branch-contacts";
import { CustomerCategoryPage } from "@/pages/customer-management/customer-category";
import { WorkflowStagesSetupPage } from "@/pages/approval-workflow/workflow-stages-setup";
import { WorkflowDefinitionsPage } from "@/pages/approval-workflow/workflow-definitions";
import UserLeaveStatusPage from "@/pages/approval-workflow/workflow-user-leave-status";
import { WorkflowApprovalQueuePage } from "@/pages/approval-workflow/workflow-approval-queue";
import { WorkflowAmountRulesPage } from "@/pages/approval-workflow/workflow-amount-rules";
import { ManageUserDelegations } from "@/pages/approval-workflow/user-deligation/components/Form/UserDelegation";
import { WorkflowActionsPage } from "@/pages/approval-workflow/workflow-actions";
import { ApproverRoleMappingPage } from "@/pages/approval-workflow/approver-role-mapping";
import { ChargeMasterPage } from "@/pages/loan-product-and-scheme-masters/charge-master";
import { UserRoleMappingContainer } from "@/pages/user-mapping/components/Form/UserRoleMappingContainer";
import { AssetItemPage } from "@/pages/customer-management/asset-management/asset-group";

export const protectedRoutesList: RouteObject[] = [
  {
    path: "/",
    element: <ProtectedRoutes allowedRoles={[]} />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "customer/management/onboarding",
        children: [
          {
            index: true,
            element: <CustomerOnboardingPage />,
          },
          {
            path: ":step",
            element: <CustomerOnboardingPage />,
          },
        ],
      },
      {
        path: "admin/approver-role-map",
        children: [
          {
            index: true,
            element: <WorkflowApproverRoleMappingPage />,
          },
        ],
      },
      // {
      //   path: "/loan-management/loan-application",
      //   children: [
      //     {
      //       index: true,
      //       element: <LoanApplicationPage />,
      //     },
      //   ],
      // },
      {
        path: "/customer/lead-sales/lead-details",
        element: <LeadDetailsPage />,
      },
      {
        path: "customer/lead-sales/assignment",
        element: <LeadAssignmentPage />,
      },
      {
        path: "/customer/lead-sales/followup",
        element: <LeadFollowupPage />,
      },
      {
        path: "/loan-management/schema-master/gl-account-types",
        element: <GLAccountTypesPage />,
      },

      {
        path: "/loan-management/approval-workflow/workflow-approval-queue",
        element: <WorkflowApprovalQueuePage />,
      },
      {
        path: "/loan-management/schema-master/charge-master",
        element: <ChargeMasterPage />,
      },
      {
        path: "firm/management/onboarding",
        children: [
          {
            index: true,
            element: <FirmOnboardingPage />,
          },
          {
            path: ":step",
            element: <FirmOnboardingPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoutes allowedRoles={[]} isLayoutHidden />,
    children: [
      {
        path: "/loan-product-schema/management/onboarding",
        children: [
          {
            index: true,
            element: <LoanProductSchemeOnboardingPage />,
          },
          {
            path: ":step",
            element: <LoanProductSchemeOnboardingPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoutes allowedRoles={[]} isLayoutHidden />,
    children: [
      {
        path: "/loan-management/schema-master/scheme-attributes",
        element: <LoanSchemeAttributesPage />,
      },
      {
        path: "/loan-management/schema-master/scheme-properties",
        element: <LoanSchemePropertiesPage />,
      },

      {
        path: "/loan-management/schema-master/business-rules",
        element: <LoanBusinessRulesPage />,
      },

      {
        path: "/loan-management/schema-master/business-rules",
        element: <LoanBusinessRulesPage />,
      },

      {
        path: "/loan-management/Approval-workflow/definition",
        element: <WorkflowDefinitionsPage />,
      },
      {
        path: "/loan-management/Approval-workflow/workflow-stages-setup",
        element: <WorkflowStagesSetupPage />,
      },
      {
        path: "/loan-management/Approval-workflow/workflow-amountrules",
        element: <WorkflowAmountRulesPage />,
      },
      {
        path: "/loan-management/Approval-workflow/workflow-manageuserdelegation",
        element: <ManageUserDelegations />,
      },

      {
        path: "/loan-management/Approval-workflow/actions",
        element: <WorkflowActionsPage />,
      },
      {
        path: "/loan-management/approval-workflow/workflow-user-leave-status",
        element: <UserLeaveStatusPage />,
      },
      {
        path: "/loan-management/Approval-workflow/workflow-rolemapping",
        element: <ApproverRoleMappingPage />,
      },
      {
        path: "/customer-management/master/firm-type",
        element: <FirmTypePage />,
      },
      {
        path: "/customer-management/master/sectoral-performance",
        element: <SectoralPerformancePage />,
      },
      {
        path: "/customer-management/master/firm-role",
        element: <FirmRolePage />,
      },
      {
        path: "/customer-management/master/staffs",
        element: <StaffPage />,
      },
      {
        path: "/customer-management/master/source-income",
        element: <SourceOfIncomePage />,
      },
      {
        path: "/customer-management/master/branch-contact",
        element: <BranchContactPage />,
      },
      {
        path: "/customer-management/master/customer-category",
        element: <CustomerCategoryPage />,
      },
      {
        path: "/customer-management/master/user-role-mapping",
        element: <UserRoleMappingContainer />,
      },
      {
        path: "/customer-management/master/asset-item",
        element: <AssetItemPage />,
      },
      {
        path: "/customer-management/master/document-master",
        children: [
          {
            index: true,
            element: <DocumentMasterPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/document-type",
        children: [
          {
            index: true,
            element: <DocumentTypePage />,
          },
        ],
      },
      {
        path: "/customer-management/master/designation",
        children: [
          {
            index: true,
            element: <DesignationPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/referral-sources",
        children: [
          {
            index: true,
            element: <ReferralSourcesPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/bank",
        children: [
          {
            index: true,
            element: <BanksPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/industry-category",
        children: [
          {
            index: true,
            element: <IndustryCategoryPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/site-premise",
        children: [
          {
            index: true,
            element: <SitePremisePage />,
          },
        ],
      },
      {
        path: "/customer-management/master/product-service",
        children: [
          {
            index: true,
            element: <ProductServicePage />,
          },
        ],
      },
      {
        path: "/customer-management/master/risk-category",
        children: [
          {
            index: true,
            element: <RiskCategoryPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/customer-group-master",
        children: [
          {
            index: true,
            element: <CustomerGroupMasterPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/agent-master",
        children: [
          {
            index: true,
            element: <AgentMasterPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/lead-source",
        children: [
          {
            index: true,
            element: <LeadSourcePage />,
          },
        ],
      },
      {
        path: "/customer-management/master/occupation",
        children: [
          {
            index: true,
            element: <OccupationPage />,
          },
        ],
      },
      {
        path: "/customer-management/master/purpose",
        children: [
          {
            index: true,
            element: <PurposePage />,
          },
        ],
      },
    ],
  },
];
