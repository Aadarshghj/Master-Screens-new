export const menu = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
  },
  {
    id: "master-data",
    title: "Master Data Management",
    icon: "Database",
    children: [
      {
        id: "data-config",
        title: "Data Configuration",
        icon: "Settings",
        path: "/master-data/config",
      },
      {
        id: "master",
        title: "Master",
        icon: "User",
        children: [
          {
            id: "document-master",
            title: "Document Master",
            path: "/customer-management/master/document-master",
          },
          {
            id: "document-type",
            title: "Document Type Master",
            path: "/customer-management/master/document-type",
          },
          {
            id: "admin-unit-type",
            title: "Admin Unit Type Master",
            path: "/customer-management/master/admin-unit-type",
          },
          {
            id: "firm-type",
            title: "Firm Type Master",
            path: "/customer-management/master/firm-type",
          },
          {
            id: "designation",
            title: "Designation Master",
            path: "/customer-management/master/designation",
          },
          {
            id: "referral-sources",
            title: "Referral Sources Master",
            path: "/customer-management/master/referral-sources",
          },
          {
            id: "bank",
            title: "Banks Master",
            path: "/customer-management/master/bank",
          },
          {
            id: "branch-type",
            title: "Branch-Type Master",
            path: "/customer-management/master/branch-type",
          },
           {
            id: "address-type",
            title: "Address-Type Master",
            path: "/customer-management/master/address-type",
          },
          {
            id: "industry-category",
            title: "Industry Category Master",
            path: "/customer-management/master/industry-category",
          },
          {
            id: "module-management",
            title: "Module Management",
            path: "/customer-management/master/module-management",
          },
          {
            id: "site-premise",
            title: "Site Premise Master",
            path: "/customer-management/master/site-premise",
          },
          {
            id: "product-service",
            title: "Product Service Master",
            path: "/customer-management/master/product-service",
          },
          {
            id: "sectoral-performance",
            title: "Sectoral Performance Master",
            path: "/customer-management/master/sectoral-performance",
          },
          {
            id: "role-management",
            title: "Role Management",
            path: "/customer-management/master/role-management",
          },

          // {
          //   id: "menu-submenu",
          //   title: "Menu SubMenu",
          //   path: "/customer-management/master/menu-submenu",
          // },
          {
            id: "menu-submenu-tree",
            title: "Menu SubMenu",
            path: "/customer-management/master/menu-submenu-tree",
          },

          {
            id: "sub-module-management",
            title: "Sub Module Management",
            path: "/customer-management/master/sub-module-management",
          },

          {
            id: "user-reg",
            title: "User Registration",
            path: "/customer-management/master/user-reg",
          },
          {
            id: "menu-module-mapping",
            title: "Menu Module Mapping",
            path: "/customer-management/master/menu-module-mapping",
          },
          {
            id: "loan-scheme-type",
            title: "Loan Scheme Type",
            path: "/customer-management/master/loan-scheme-type",
          },

          {
            id: "firm-role",
            title: "Firm Role Master",
            path: "/customer-management/master/firm-role",
          },
          {
            id: "risk-category",
            title: "Risk Category Master",
            path: "/customer-management/master/risk-category",
          },
          {
            id: "customer-group-master",
            title: "Customer Group Master",
            path: "/customer-management/master/customer-group-master",
          },
          {
            id: "agent-master",
            title: "Agent Master",
            path: "/customer-management/master/agent-master",
          },
          {
            id: "staffs",
            title: "Staffs Master",
            path: "/customer-management/master/staffs",
          },
          {
            id: "lead-source",
            title: "Lead Sources Master",
            path: "/customer-management/master/lead-source",
          },
          {
            id: "occupation",
            title: "Occupation Master",
            path: "/customer-management/master/occupation",
          },
          {
            id: "purpose",
            title: "Purpose Master",
            path: "/customer-management/master/purpose",
          },
          {
            id: "source-income",
            title: "Source of Income Master",
            path: "/customer-management/master/source-income",
          },
          {
            id: "branch-contact",
            title: "Branch Contacts Master",
            path: "/customer-management/master/branch-contact",
          },
          {
            id: "customer-category",
            title: "Customer Category Master",
            path: "/customer-management/master/customer-category",
          },
          {
            id: "tenant",
            title: "Tenant Master",
            path: "/customer-management/master/tenant",
          },

          {
            id: "risk-assessment-type-history",
            title: "Risk Assessment Type History Master",
            path: "/customer-management/master/risk-assessment-type-history",
          },
          {
            id: "user-role-mapping",
            title: "User Role Mapping Master",
            path: "/customer-management/master/user-role-mapping",
          },
           {
            id: "user-type",
            title: "User Type Master",
            path: "/customer-management/master/user-type",
          },

          {
            id: "designation-role-mapping",
            title: "Designation Role Mapping Master",
            path: "/customer-management/master/designation-role-mapping",
          },
          {
            id: "branch-staff-mapping",
            title: "Branch Staff Mapping",
            path: "/customer-management/master/branch-staff-mapping",
          },
        ],
      },
      {
        id: "asset-master",
        title: "Asset Master",
        icon: "User",
        children: [
          {
            id: "unit-of-measure",
            title: "Unit of Measure",
            path: "/customer-management/asset-master/unit-of-measure",
          },
          {
            id: "depreciation-methods",
            title: "Depreciation Methods",
            path: "/customer-management/asset-master/depreciation-methods",
          },
          {
            id: "asset-item",
            title: "Asset Item",
            path: "/customer-management/asset-master/asset-item",
          },
          {
            id: "gst-cost-master",
            title: "GST Cost Master",
            path: "/customer-management/asset-master/gst-cost-master",
          },
          {
            id: "tds-section",
            title: "TDS Section",
            path: "/customer-management/asset-master/tds-section",
          },
          {
            id: "asset-model",
            title: "Asset Model",
            path: "/customer-management/asset-master/asset-model",
          },
          {
            id: "asset-group",
            title: "Asset Group",
            path: "/customer-management/asset-master/asset-group",
          },
          {
            id: "asset-type",
            title: "Asset Type",
            path: "/customer-management/asset-master/asset-type",
          },
          {
            id: "terms-and-conditions",
            title: "Terms And Conditions",
            path: "/customer-management/asset-master/terms-and-conditions",
          },
          {
            id: "supplier-risk-category",
            title: "Supplier Risk Category",
            path: "/customer-management/asset-master/supplier-risk-category",
          },
           {
                id: "asset-type",
                title: "Asset Type",
                path: "/customer-management/asset-master/asset-type"
              },
              {
                id: "terms-and-conditions",
                title: "Terms And Conditions",
                path: "/customer-management/asset-master/terms-and-conditions"
              },
              {
                id: "supplier-risk-category",
                title: "Supplier Risk Category",
                path: "/customer-management/asset-master/supplier-risk-category"
              },
              {
  id: "supplier-list-master",
  title: "Supplier List Master",
  path: "/customer-management/asset-master/supplier-list-master"
},
        ],
      },
    ],
  },
  {
    id: "organization-management-system",
    title: "Organization Management System",
    icon: "Users",
    children: [
      {
        id: "organization",
        title: "Organization",
        children: [
          {
            id: "org-branch",
            title: "Branch Information",
            path: "/organization-management-system/branch",
          },
          {
            id: "org-area",
            title: "Area Information",
            path: "/organization-management-system/area",
          },
          {
            id: "org-region",
            title: "Region Information",
            path: "/organization-management-system/region",
          },
          {
            id: "org-state",
            title: "State Information",
            path: "/organization-management-system/state",
          },
          {
            id: "org-corporate",
            title: "Corporate Information",
            path: "/organization-management-system/corporate",
          },
        ],
      },
    ],
  },

  {
    id: "customer-mgmt",
    title: "Customer Management System",
    icon: "Users",
    children: [
      {
        id: "lead-sales-config",
        title: "Lead & Sales Management - Configuration",
        children: [
          {
            id: "product-service-master",
            title: "Product and service master management",
            path: "/customer/lead-sales/product-service",
          },
          {
            id: "lead-stage-master",
            title: "Lead stage master",
            path: "/customer/lead-sales/lead-stage",
          },
          {
            id: "lead-source-master",
            title: "Lead source master",
            path: "/customer/lead-sales/lead-source",
          },
          {
            id: "lead-activity-types",
            title: "Lead activity types",
            path: "/customer/lead-sales/activity-types",
          },
          {
            id: "lead-additional-ref",
            title: "Lead additional reference",
            path: "/customer/lead-sales/additional-ref",
          },
        ],
      },
      {
        id: "lead-sales-mgmt",
        title: "Lead & Sales Management",
        children: [
          {
            id: "lead-details",
            title: "Lead Details",
            path: "/customer/lead-sales/lead-details",
          },
          {
            id: "lead-assignment",
            title: "Lead Assignment ",
            path: "/customer/lead-sales/assignment",
          },
          {
            id: "lead-followup",
            title: "Lead Follow-up",
            path: "/customer/lead-sales/followup",
          },
        ],
      },
      {
        id: "customer-mgmt-config",
        title: "Customer Management - Configuration",
        children: [
          {
            id: "customer-code-def",
            title: "Customer Code Definition",
            path: "/customer/config/code-definition",
          },
          {
            id: "customer-risk-profile",
            title: "Customer Risk Profile",
            path: "/customer/config/risk-profile",
          },
          {
            id: "customer-freeze-unfreeze",
            title: "Customer Freeze/Unfreeze",
            path: "/customer/config/freeze-unfreeze",
          },
          {
            id: "customer-category-mapping",
            title: "Customer Category Mapping",
            path: "/customer/config/category-mapping",
          },
          {
            id: "assessment-type-details",
            title: "Assessment Type Details",
            path: "/customer/config/assessment-type",
          },
          {
            id: "customer-group-details",
            title: "Customer Group Details",
            path: "/customer/config/group-details",
          },
          {
            id: "customer-group-mapping",
            title: "Customer Group Mapping",
            path: "/customer/config/group-mapping",
          },
          {
            id: "customer-role-mapping",
            title: "Customer Role Mapping",
            path: "/customer/config/role-mapping",
          },
          {
            id: "staff-customer-relationship",
            title: "Staff-Customer Relationship",
            path: "/customer/config/staff-relationship",
          },
          {
            id: "re-kyc-process",
            title: "Re-KYC Process",
            path: "/customer/config/re-kyc",
          },
          {
            id: "customer-additional-ref",
            title: "Customer Additional References",
            path: "/customer/config/additional-references",
          },
          {
            id: "customer-followup-details",
            title: "Customer follow-up details",
            path: "/customer/config/followup-details",
          },
        ],
      },
      {
        id: "customer-mgmt",
        title: "Customer Management",
        children: [
          {
            id: "customer-onboarding",
            title: "Customer Onboarding",
            path: "/customer/management/onboarding",
          },
        ],
      },
      {
        id: "firm-mgmt",
        title: "Firm Management",
        path: "/firm/management/onboarding",
      },
    ],
  },
  {
    id: "loan-mgmt",
    title: "Loan Management System",
    icon: "DollarSign",
    path: "/loan-management",
    children: [
      {
        id: "loan-application",
        title: "Managing Loan Application ",
        icon: "DollarSign",
        path: "/loan-management/loan-application",
      },

      {
        id: "loan-onboarding",
        title: "Loan Product and Scheme ",
        icon: "DollarSign",
        path: "/loan-product-schema/management/onboarding",
      },
      {
        id: "loan-schema",
        title: "Loan Product Configuration",
        path: "/loan-management/schema-master",
        children: [
          {
            id: "Bank Configuration",
            title: "Bank Configuration",
            path: "/loan-management/schema-master/bank-configuration",
          },
          {
            id: "scheme-attributes",
            title: "Loan Scheme Attributes Master",
            path: "/loan-management/schema-master/scheme-attributes",
          },
          {
            id: "scheme-properties",
            title: "Loan Scheme Properties  Master",
            path: "/loan-management/schema-master/scheme-properties",
          },
          {
            id: "gl-account-types",
            title: "GL Account types for loan scheme posting",
            path: "/loan-management/schema-master/gl-account-types",
          },
          {
            id: "business-rules",
            title: "Business rules for loan processing",
            path: "/loan-management/schema-master/business-rules",
          },
          {
            id: "charge-master",
            title: "Loan Charge Master",
            path: "/loan-management/schema-master/charge-master",
          },
          {
            id: "co-loan-scheme-mapping",
            title: "Scheme Mapping",
            path: "/loan-management/schema-master/co-loan-scheme-mapping",
          },
        ],
      },
      {
        id: "Approval-workflow",
        title: "Approval WorkFlow Management",
        path: "/loan-management/Approval-workflow",
        children: [
          {
            id: "workflow-definition",
            title: "Workflow Definitions",
            path: "/loan-management/Approval-workflow/definition",
          },
          {
            id: "workflow-stages-setup",
            title: "WorkFlow Stages setup",
            path: "/loan-management/Approval-workflow/workflow-stages-setup",
          },
          {
            id: "workflow-action",
            title: "WorkFlow Actions",
            path: "/loan-management/Approval-workflow/actions",
          },
          {
            id: "workflow-amountrules",
            title: "WorkFlow Amount Rules ",
            path: "/loan-management/Approval-workflow/workflow-amountrules",
          },
          {
            id: "workflow-rolemapping",
            title: "WorkFlow Role Mapping ",
            path: "/loan-management/Approval-workflow/workflow-rolemapping",
          },

          {
            id: "workflow-manageuserdelegation  ",
            title: "Manage User Delegation ",
            path: "/loan-management/Approval-workflow/workflow-manageuserdelegation",
          },
          {
            id: "workflow-userleavestatus",
            title: "User Leave Status",
            path: "/loan-management/approval-workflow/workflow-user-leave-status",
          },
          {
            id: "workflow-approval-queue",
            title: "Approval Queue Management  ",
            path: "/loan-management/Approval-workflow/workflow-approval-queue",
          },
        ],
      },
    ],
  },

  {
    id: "asset-mgmt",
    title: "Asset Management System",
    icon: "TrendingUp",
    path: "/asset-management",

     children: [
          {
        id: "supplier-management",
        title: "Supplier Management",
        path: "/asset-management/supplier-management",
        children: [
          {
            id: "supplier-information",
            title: "Supplier Information",
            path: "/asset-management/supplier-management/supplier-information",
          },
        ],
      },
      {
        id: "quotation-registration",
        title: "Quotation Registration  ",
        path: "/asset-management/quotation-registration",
    }
            ]
    
  },
  {
    id: "financial-accounting",
    title: "Financial Accounting Management System",
    icon: "Calculator",
    path: "/financial-accounting",
  },
  {
    id: "organization-hierarchy",
    title: "Organization Hierarchy",
    icon: "Sitemap",
    path: "/organization-hierarchy",
  },
  {
    id: "liability-mgmt",
    title: "Liability Management System",
    icon: "Shield",
    path: "/liability-management",
  },
];
