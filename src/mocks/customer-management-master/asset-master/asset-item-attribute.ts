import type { AssetItemAttributeTable } from "@/types/customer-management/asset-master/asset-item-attributes.types";

export const assetItemsOptions: AssetItemAttributeTable[] = [
  { assetItem: "Gold Loan", attributeKey: "ltv_percentage", attributeName:"LTV Percentage", dataType:"DECIMAL", defaultValue: "75",description:"LTV Percentage if applicable", isActive:true, identity: ""  },
  { assetItem: "Gold Loan", attributeKey: "epi_repayment_type", attributeName:"EPI Repayment Type", dataType:"VARCHAR", defaultValue: "",description:"Fixed EMI/ Flexi EMI/ etc", isActive:true, identity: ""  },
  { assetItem: "Gold Loan", attributeKey: "epi_frequency", attributeName:"EPI Frequency", dataType:"VARCHAR", defaultValue: "Fixed EMI",description:"EMI Payment Frequency", isActive:true, identity: "" },
];
