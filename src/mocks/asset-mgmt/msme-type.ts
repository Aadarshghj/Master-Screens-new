import { MsmeType } from "../../types/asset-mgmt/msme-type";

export const MSME_TYPE_SAMPLE_DATA: MsmeType[] = [
  {
    msmeType: "Micro Enterprise",
    msmeTypeDesc:
      "Small local businesses, startups, shops, and small manufacturing units with limited investment.",
    status: true,
  },
  {
    msmeType: "Small Enterprise",
    msmeTypeDesc:
      "Growing businesses with moderate investment, workforce, and production capacity.",
    status: true,
  },
  {
    msmeType: "Medium Enterprise",
    msmeTypeDesc:
      "Established businesses with larger investment, structured operations, and higher turnover.",
    status: true,
  },
  {
    msmeType: "Retail MSME",
    msmeTypeDesc:
      "Businesses primarily involved in retail trading, stores, and consumer sales activities.",
    status: true,
  },
  {
    msmeType: "Manufacturing MSME",
    msmeTypeDesc:
      "Enterprises engaged in production, processing, or manufacturing of goods.",
    status: true,
  },
  {
    msmeType: "Service MSME",
    msmeTypeDesc:
      "Businesses providing services such as consulting, repair, IT services, and support activities.",
    status: false,
  },
  {
    msmeType: "Trading MSME",
    msmeTypeDesc:
      "Enterprises involved in wholesale or distribution of goods without manufacturing.",
    status: true,
  },
];