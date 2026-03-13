import type { Option } from "@/types/customer-management/designation";

export const ADMIN_UNIT_TYPE_OPTIONS: Option[] = [
  { label: "Branch", value: "BRANCH" },
  { label: "Zone", value: "ZONE" },
  { label: "Region", value: "REGION" },
];

export const ADMIN_UNIT_CODES = {
  BRANCH: "BRANCH",
  REGION: "REGION",
  ZONE: "ZONE",
} as const;

export const BRANCH_CODE_PREFIX = "BR";
export const BRANCH_CODE_PAD = 3;

export const DEFAULT_COUNTRY = "INDIA";
export const DEFAULT_CURRENCY = "INR";
export const DEFAULT_TIMEZONE = "Asia/Kolkata";

export const PINCODE_MIN_LENGTH = 6;
export const PINCODE_MIN_VALUE = 110001;
export const PINCODE_MAX_VALUE = 999999;

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  DUPLICATE_CODE: "Branch code already exists",
  NO_TRIPLE_CONSECUTIVE:
    "Three or more identical consecutive characters are not allowed",
  NOT_ALL_SAME: "Value cannot consist of a single repeated character",
  NAME_PATTERN:
    "Only letters, numbers, spaces, hyphens, and slashes are allowed",
  HAS_LETTER: "Value must contain at least one letter",
  BRANCH_CODE_PATTERN: "Branch code must contain only letters and numbers",
  BRANCH_CODE_MAX: "Maximum 10 characters allowed",
  BRANCH_NAME_MAX: "Maximum 100 characters allowed",
  BRANCH_NAME_MIN: "Minimum 2 characters required",
  SHORT_NAME_MAX: "Maximum 50 characters allowed",
  ADDRESS1_MIN: "Minimum 5 characters required",
  ADDRESS1_MAX: "Maximum 100 characters allowed",
  ADDRESS2_MIN: "Minimum 3 characters required",
  ADDRESS2_MAX: "Maximum 100 characters allowed",
  LANDMARK_MIN: "Minimum 3 characters required",
  LANDMARK_MAX: "Maximum 100 characters allowed",
  PLACE_NAME_MIN: "Minimum 2 characters required",
  PLACE_NAME_MAX: "Maximum 100 characters allowed",
  DOOR_NUMBER_MAX: "Maximum 50 characters allowed",
  DOOR_NUMBER_PATTERN:
    "Only letters, numbers, spaces, hyphens, and slashes are allowed",
  PINCODE_PATTERN: "Pincode must be exactly 6 digits",
  PINCODE_RANGE: `Pincode must be between ${PINCODE_MIN_VALUE} and ${PINCODE_MAX_VALUE}`,
  MICR_MAX: "MICR code must be exactly 9 digits",
  MICR_PATTERN: "MICR code must contain only digits",
  IFSC_MAX: "IFSC code must be 11 characters",
  IFSC_PATTERN:
    "IFSC code must be in format: XXXX0XXXXXX (4 letters, 0, 6 alphanumeric)",
  SWIFT_MAX: "SWIFT/BIC code must be 8 or 11 characters",
  SWIFT_PATTERN:
    "SWIFT/BIC code must be 8 or 11 characters (letters and numbers only)",
  BSR_MAX: "BSR code must be 7 digits",
  BSR_PATTERN: "BSR code must contain only digits",
  LOCATION_CODE_MAX: "Maximum 20 characters allowed",
  PARENT_ADMIN_CODE_MAX: "Maximum 20 characters allowed",
  AUTH_DEALER_CODE_MAX: "Maximum 10 characters allowed",
  TBA_MAIN_KEY_MAX: "Maximum 20 characters allowed",
  REG_DIR_CODE_MAX: "Maximum 10 characters allowed",
} as const;

export const TABLE_LABELS = {
  DEFAULT_UNIT: "Branch",
  NO_RECORDS: (unit: string) => `No ${unit} Records Found`,
  LOADING: "Loading...",
  DELETE_TITLE: (unit: string) => `Delete ${unit}`,
  DELETE_MSG: (unit: string) =>
    `Are you sure you want to delete this ${unit.toLowerCase()}? This action cannot be undone.`,
  CONFIRM_DELETE: "Delete",
  CANCEL: "Cancel",
  EDITING_HINT: "Editing existing record — Reset to cancel",
} as const;

export const PLACEHOLDERS = {
  AUTO_FETCH: "//Auto Fetch",
  BRANCH_CODE: "Auto Generated",
  DATE: "dd/mm/yyyy",
  LATITUDE: "Latitude",
  LONGITUDE: "Longitude",
  PINCODE: "e.g. 600001",
  NO_PO_FOUND: "No post offices found for this PIN code",
} as const;
