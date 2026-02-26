import type { SitePRemiseType } from "@/types/customer-management/site-premise";

export const PREMISE_TYPE_TABLE_DATA: SitePRemiseType[] = [
  {
    premiseTypeName: "Warehouse",
    description:
      "Storage facility for raw materials, finished goods, and inventory management",
  },
  {
    premiseTypeName: "Office",
    description:
      "Commercial space used for administrative, managerial, and professional work",
  },
  {
    premiseTypeName: "Showroom",
    description:
      "Display area for showcasing and demonstrating products to customers",
  },
  {
    premiseTypeName: "Retail Store",
    description: "Physical outlet for direct sale of goods to customers",
  },
  {
    premiseTypeName: "Factory",
    description:
      "Premises used for manufacturing, processing, or assembling products",
  },
];
