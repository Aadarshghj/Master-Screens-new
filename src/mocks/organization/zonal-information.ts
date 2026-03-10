import type { ZoneTableRow } from "@/types/organisation/zonal-information";

export const zone_TABLE_DATA: ZoneTableRow[] = [
  {
    zonecode: "101",
    zonename: "NorthEast Zone",
    adminunittype: "ZONE",
    parentzone: "North Zone",
    zonetype: "DIAMOND",
    mainzone: true,
  },
];

export const zone_DETAILS_STATUS = [
  { value: "ACTIVE", label: "ACTIVE" },
  { value: "CLOSED", label: "CLOSED" },
  { value: "MERGED", label: "MERGED" },
  { value: "CREATED", label: "CREATED" },
  { value: "SHIFTED", label: "SHIFTED" },
];

export const zone_DETAILS_ADMIN_UNIT_TYPE = [
  { value: "ZONE", label: "ZONE" },
  { value: "CORPORATE", label: "CORPORATE" },
  { value: "REGION", label: "REGION" },
  { value: "CLUSTER", label: "CLUSTER" },
];

export const zone_DETAILS_PARENT_zone = [
  { value: "KERALA NORTH REGION", label: "KERALA NORTH REGION" },
  { value: "KERALA SOUTH REGION", label: "KERALA SOUTH REGION" },
  { value: "NORTH ZONE", label: "NORTH ZONE" },
  { value: "SOUTH ZONE", label: "SOUTH ZONE" },
];

export const zone_DETAILS_zone_TYPE = [
  { value: "CHAIRMAN'S CLUB", label: "CHAIRMAN'S CLUB" },
  { value: "HIGH NETWORK", label: "HIGH NETWORK" },
  { value: "DIAMOND", label: "DIAMOND" },
  { value: "SILVER", label: "SILVER" },
];

export const zone_DETAILS_CATEGORY_ID = [
  { value: "METRO", label: "METRO" },
  { value: "URBAN", label: "URBAN" },
  { value: "RURAL", label: "RURAL" },
];

export const zone_DETAILS_MERGED_TO = [
  { value: "INFOPARK", label: "INFOPARK" },
  { value: "TECHNOPARK", label: "TECHNOPARK" },
];

export const zone_DETAILS_TIME_ZONE = [
  { value: "ASIA/KOLKATA", label: "ASIA/KOLKATA" },
];
