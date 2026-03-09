export interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
}

export const menuTreeData: TreeNode[] = [

  {
    id: "1",
    name: "Dashboard",

  },

  {
    id: "2",
    name: "Master Data Management",
    children: [
      {
        id: "2-1",
        name: "Data Configuration",
      },
      {
        id: "2-2",
        name: "Master",
        children: [
          { id: "2-2-1", name: "Document Master" },
          { id: "2-2-2", name: "Document Type Master" },
          { id: "2-2-3", name: "Admin Unit Type Master" },
          { id: "2-2-4", name: "Firm Type Master" },
          { id: "2-2-5", name: "Designation Master" },
          { id: "2-2-6", name: "Refferal Sources Master" },
          { id: "2-2-7", name: "Banks Master" },
          { id: "2-2-8", name: "Branch Type Master" },
          { id: "2-2-9", name: "Industry Category Master" },
          { id: "2-2-10", name: "Site Premise Master" },
          { id: "2-2-11", name: "Product Service Master" },
          { id: "2-2-12", name: "Sectoral Perfomance Master" },
          { id: "2-2-13", name: "Role Management Master" },
          { id: "2-2-14", name: "User Registration" },
          { id: "2-2-14", name: "Firm Role Master" },
          { id: "2-2-14", name: "Risk Category Master" },
          { id: "2-2-14", name: "Customer Group Master" },
          { id: "2-2-14", name: "Agent Master" },
          { id: "2-2-14", name: "Staffs Master" },
          { id: "2-2-14", name: "Lead Sources Master" },
          { id: "2-2-14", name: "Occupation Master" },
          { id: "2-2-14", name: "Purpose Master" },
          { id: "2-2-14", name: "Source of Income Master" },
          { id: "2-2-14", name: "Branch Contacts Master" },
          { id: "2-2-14", name: "Customer Category Master" },
          { id: "2-2-14", name: "Tenant Master" },
          { id: "2-2-14", name: "Risk Assesment Type History Master" },
          { id: "2-2-14", name: "Use Role Mapping Master" },
          { id: "2-2-14", name: "Asset Item Master" },
          { id: "2-2-14", name: "Designation Role Mapping Master" },
          { id: "2-2-14", name: "Branch Staff Mapping" },
        ]
      },
      {
        id: "2-3",
        name: "Asset Master",
        children: [
          { id: "2-3-1", name: "Asset Model" },
          { id: "2-3-2", name: "Asset Group" },
          { id: "2-3-3", name: "Asset Type" },
          { id: "2-3-4", name: "Terms And Conditions" },
          { id: "2-3-5", name: "Supplier Risk Category" },
          { id: "2-3-6", name: "Unit of Measure" },
          { id: "2-3-7", name: "Depreciation Methods" },
          { id: "2-3-8", name: "GST Cost Master" },
          { id: "2-3-9", name: "TDS Section" },
        ]

      }
    ]
  },

  {
    id: "3",
    name: "Customer Management System",
    children: [
      {
        id: "3-1",
        name: "Lead & Sales Management- Configuration",
        children: [
          { id: "3-1-1", name: "Product and service master management" },
          { id: "3-1-2", name: "Lead stage master" },
          { id: "3-1-3", name: "Lead source master" },
          { id: "3-1-4", name: "Lead activity types" },
          { id: "3-1-5", name: "Lead additional Refference" },
        ]
      },
      {
        id: "3-2",
        name: "Lead & Sales Management",
        children: [
          { id: "3-2-1", name: "Lead Details" },
          { id: "3-2-2", name: "Lead Assignment" },
          { id: "3-2-3", name: "Lead Follow-up" },
        ]
      },

      {
        id: "3-3",
        name: "Customer Management Configuration",
        children: [
          { id: "3-3-1", name: "Customer Code Definition" },
          { id: "3-3-1", name: "Customer Risk Profile" },
          { id: "3-3-1", name: "Customer Freeze/Unfreeze" },
          { id: "3-3-1", name: "Customer Category Mapping" },
          { id: "3-3-1", name: "Assesment Type Details" },
          { id: "3-3-1", name: "Customer Group Details" },
          { id: "3-3-1", name: "Customer Group Mapping" },
          { id: "3-3-1", name: "Customer Role Mapping" },
          { id: "3-3-1", name: "Staff Customer Relationship" },
          { id: "3-3-1", name: "Re-KYC Process" },
          { id: "3-3-1", name: "Customer Additional Referencces" },
          { id: "3-3-1", name: "Customer Follow-Up Details" },

        ]
      },
      {
        id: "3-4",
        name: "Customer Management",
        children: [
          { id: "3-4-1", name: "Customer Onboarding" },
        ]
      },
      {
        id: "3-5",
        name: "Firm Management",
      }
    ]
  },

  {
    id: "4",
    name: "Loan Management System",
    children: [
      {
        id: "4-1",
        name: "Managing Loan Application",
      },
      {
        id: "4-2",
        name: "Loan Product and Scheme",
      },

      {
        id: "4-3",
        name: "Loan Product and Scheme",
        children: [
          { id: "4-3-1", name: "Loan Scheme Attributes Master" },
          { id: "4-3-2", name: "Loan Scheme Properties Master" },
          { id: "4-3-3", name: "GL Account types for loan Scheme Posting" },
          { id: "4-3-4", name: "Bussiness rules for Loan Processing" },
          { id: "4-3-5", name: "Loan Charge Master" },
          { id: "4-3-6", name: "Scheme Mapping" },
        ]
      },
      {
        id: "4-4",
        name: "Approval WorkFlow Management",
        children: [
          { id: "4-4-1", name: "Workflow Definition" },
          { id: "4-4-2", name: "Workflow Stages setup" },
          { id: "4-4-3", name: "Workflow Actions" },
          { id: "4-4-4", name: "Workflow Amount Rules" },
          { id: "4-4-5", name: "Workflow Role Mapping" },
          { id: "4-4-6", name: "Workflow User Delegation" },
          { id: "4-4-7", name: "User Leave Status" },
          { id: "4-4-8", name: "Approval Queue Management" },
        ]
      },
    ]
  },

{
  id: "5",
  name: "Asset Management System",
  children: [
    {
      id: "5-1",
      name: "Supplier Management",
          children: [
            {
              id: "5-1-1-1",
              name: "Supplier Information"
            }
          ]
             
    },
    {
      id: "5-2",
      name: "Quotation Registration"
    }
  ]
},
  
  {
    id: "6",
    name: "Financial Accounting Management System",
  },
  {
    id: "7",
    name: "Organization Hierarchy ",
  },
  {
    id: "8",
    name: "Liability Management System",
  },
]