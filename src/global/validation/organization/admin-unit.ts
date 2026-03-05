import type { AdminUnitDetails } from "@/types/organisation/admin-unit";
import * as yup from "yup";
import {
  VALIDATION_MESSAGES,
  PINCODE_MIN_VALUE,
  PINCODE_MAX_VALUE,
} from "@/pages/organization/zonal-information/constants/ZoneInformationConstants";

const noTripleConsecutive = (value: string | undefined): boolean => {
  if (!value) return true;
  return !/(.)\1\1/i.test(value);
};

const notAllSameChar = (value: string | undefined): boolean => {
  if (!value || value.length <= 1) return true;
  return !/^(.)\1+$/.test(value.trim());
};

const namePattern = /^[a-zA-Z0-9 \-/]+$/;

const hasAtLeastOneLetter = (value: string | undefined): boolean => {
  if (!value) return true;
  return /[a-zA-Z]/.test(value);
};

const isNonEmpty = (val: string | null | undefined) =>
  val !== null && val !== undefined && val.trim() !== "";

export const adminUnitRegistrationSchema = (): yup.ObjectSchema<
  AdminUnitDetails,
  yup.AnyObject,
  unknown,
  ""
> => {
  return yup.object({
    identity: yup.string().defined(),

    adminUnitTypeIdentity: yup.string().required(VALIDATION_MESSAGES.REQUIRED),

    branchCode: yup
      .string()
      .required(VALIDATION_MESSAGES.REQUIRED)
      .max(10, VALIDATION_MESSAGES.BRANCH_CODE_MAX)
      .matches(/^[A-Za-z0-9]+$/, VALIDATION_MESSAGES.BRANCH_CODE_PATTERN),

    branchName: yup
      .string()
      .required(VALIDATION_MESSAGES.REQUIRED)
      .max(100, VALIDATION_MESSAGES.BRANCH_NAME_MAX)
      .min(2, VALIDATION_MESSAGES.BRANCH_NAME_MIN)
      .matches(namePattern, VALIDATION_MESSAGES.NAME_PATTERN)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive)
      .test("not-all-same", VALIDATION_MESSAGES.NOT_ALL_SAME, notAllSameChar)
      .test("has-letter", VALIDATION_MESSAGES.HAS_LETTER, hasAtLeastOneLetter),

    branchShortName: yup
      .string()
      .optional()
      .max(50, VALIDATION_MESSAGES.SHORT_NAME_MAX)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive)
      .test("not-all-same", VALIDATION_MESSAGES.NOT_ALL_SAME, notAllSameChar),

    branchStatusIdentity: yup.string().required(VALIDATION_MESSAGES.REQUIRED),

    branchTypeIdentity: yup.string().optional(),

    branchCategoryIdentity: yup.string().optional(),

    parentBranchIdentity: yup.string().nullable().optional(),
    parentBranchName: yup.string().nullable().optional(),

    mergedToBranchIdentity: yup.string().nullable().optional(),
    mergedToBranchName: yup.string().nullable().optional(),
    mergedOn: yup.string().nullable().optional(),

    registrationDate: yup
      .string()
      .nullable()
      .test("required", VALIDATION_MESSAGES.REQUIRED, isNonEmpty),

    openingDate: yup
      .string()
      .nullable()
      .test("required", VALIDATION_MESSAGES.REQUIRED, isNonEmpty),

    closingDate: yup.string().nullable().optional(),
    dateOfShift: yup.string().nullable().optional(),

    doorNumber: yup
      .string()
      .required(VALIDATION_MESSAGES.REQUIRED)
      .max(50, VALIDATION_MESSAGES.DOOR_NUMBER_MAX)
      .matches(/^[a-zA-Z0-9/ -]+$/, VALIDATION_MESSAGES.DOOR_NUMBER_PATTERN)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive),

    addressLine1: yup
      .string()
      .required(VALIDATION_MESSAGES.REQUIRED)
      .max(100, VALIDATION_MESSAGES.ADDRESS1_MAX)
      .min(5, VALIDATION_MESSAGES.ADDRESS1_MIN)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive)
      .test("not-all-same", VALIDATION_MESSAGES.NOT_ALL_SAME, notAllSameChar),

    addressLine2: yup
      .string()
      .required(VALIDATION_MESSAGES.REQUIRED)
      .max(100, VALIDATION_MESSAGES.ADDRESS2_MAX)
      .min(3, VALIDATION_MESSAGES.ADDRESS2_MIN)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive)
      .test("not-all-same", VALIDATION_MESSAGES.NOT_ALL_SAME, notAllSameChar),

    landmark: yup
      .string()
      .required(VALIDATION_MESSAGES.REQUIRED)
      .max(100, VALIDATION_MESSAGES.LANDMARK_MAX)
      .min(3, VALIDATION_MESSAGES.LANDMARK_MIN)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive)
      .test("not-all-same", VALIDATION_MESSAGES.NOT_ALL_SAME, notAllSameChar),

    placeName: yup
      .string()
      .required(VALIDATION_MESSAGES.REQUIRED)
      .max(100, VALIDATION_MESSAGES.PLACE_NAME_MAX)
      .min(2, VALIDATION_MESSAGES.PLACE_NAME_MIN)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive)
      .test("not-all-same", VALIDATION_MESSAGES.NOT_ALL_SAME, notAllSameChar),

    pincode: yup
      .string()
      .required(VALIDATION_MESSAGES.REQUIRED)
      .matches(/^[1-9][0-9]{5}$/, VALIDATION_MESSAGES.PINCODE_PATTERN)
      .test("valid-range", VALIDATION_MESSAGES.PINCODE_RANGE, value => {
        if (!value) return false;
        const num = Number(value);
        return num >= PINCODE_MIN_VALUE && num <= PINCODE_MAX_VALUE;
      }),

    pincodeIdentity: yup.string().optional(),
    postOfficeIdentity: yup.string().optional(),
    postOffice: yup.string().optional(),
    cityIdentity: yup.string().optional(),
    cityName: yup.string().optional(),
    districtIdentity: yup.string().optional(),
    districtName: yup.string().optional(),
    stateIdentity: yup.string().optional(),
    stateName: yup.string().optional(),
    countryIdentity: yup.string().optional(),
    countryName: yup.string().optional(),
    language: yup.string().optional(),

    latitude: yup
      .number()
      .nullable()
      .optional()
      .typeError("Latitude must be a number")
      .min(-90, "Latitude must be between -90 and 90")
      .max(90, "Latitude must be between -90 and 90"),

    longitude: yup
      .number()
      .nullable()
      .optional()
      .typeError("Longitude must be a number")
      .min(-180, "Longitude must be between -180 and 180")
      .max(180, "Longitude must be between -180 and 180"),

    timezone: yup.string().optional(),

    locationCode: yup
      .string()
      .optional()
      .max(20, VALIDATION_MESSAGES.LOCATION_CODE_MAX)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive),

    parentAdminCode: yup
      .string()
      .optional()
      .max(20, VALIDATION_MESSAGES.PARENT_ADMIN_CODE_MAX)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive),

    micrCode: yup
      .string()
      .optional()
      .max(9, VALIDATION_MESSAGES.MICR_MAX)
      .matches(/^[0-9]*$/, VALIDATION_MESSAGES.MICR_PATTERN)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive),

    ifscCode: yup
      .string()
      .optional()
      .max(11, VALIDATION_MESSAGES.IFSC_MAX)
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$|^$/, VALIDATION_MESSAGES.IFSC_PATTERN),

    swiftBicCode: yup
      .string()
      .optional()
      .max(11, VALIDATION_MESSAGES.SWIFT_MAX)
      .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$|^$/, VALIDATION_MESSAGES.SWIFT_PATTERN),

    bsrCode: yup
      .string()
      .optional()
      .max(7, VALIDATION_MESSAGES.BSR_MAX)
      .matches(/^[0-9]*$/, VALIDATION_MESSAGES.BSR_PATTERN),

    authDealerCode: yup
      .string()
      .optional()
      .max(10, VALIDATION_MESSAGES.AUTH_DEALER_CODE_MAX)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive),

    tbaMainKey: yup
      .string()
      .optional()
      .max(20, VALIDATION_MESSAGES.TBA_MAIN_KEY_MAX)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive),

    regDirectoryCode: yup
      .string()
      .optional()
      .max(10, VALIDATION_MESSAGES.REG_DIR_CODE_MAX)
      .test("no-triple-consecutive", VALIDATION_MESSAGES.NO_TRIPLE_CONSECUTIVE, noTripleConsecutive),

    sizeId: yup
      .number()
      .nullable()
      .optional()
      .typeError("Size must be a number")
      .min(0, "Size cannot be negative")
      .max(9999, "Size maximum value is 9999"),

    numExtensionCounters: yup
      .number()
      .nullable()
      .optional()
      .typeError("Extension counters must be a number")
      .min(0, "Extension counters cannot be negative")
      .max(9999, "Extension counters maximum value is 9999"),

    linkServiceMainBranchId: yup
      .number()
      .nullable()
      .optional()
      .typeError("Link service branch must be a number")
      .min(0, "Link service branch cannot be negative"),

    numSplitPremises: yup
      .number()
      .nullable()
      .optional()
      .typeError("Split premises must be a number")
      .min(0, "Split premises cannot be negative")
      .max(9999, "Split premises maximum value is 9999"),

    numOfficersAvailable: yup
      .number()
      .nullable()
      .optional()
      .typeError("Officers available must be a number")
      .min(0, "Officers available cannot be negative")
      .max(99999, "Officers available maximum value is 99999"),

    baseCurrency: yup
      .string()
      .optional()
      .max(3, "Currency code must be at most 3 characters")
      .matches(/^[A-Z]*$/, "Currency code must be uppercase letters only"),

    isMainBranchInLocation: yup.boolean().optional(),
    isActive: yup.boolean().optional(),
    isSplitPremises: yup.boolean().optional(),
    localClearingMember: yup.boolean().optional(),
    nationalClearingMember: yup.boolean().optional(),
    highValueClearingMember: yup.boolean().optional(),
    clearingBasedOnMicr: yup.boolean().optional(),
    cashMgmtBranch: yup.boolean().optional(),
    rtgsDepEnabled: yup.boolean().optional(),
    authDealForex: yup.boolean().optional(),
    authForeignCurrencyDeposit: yup.boolean().optional(),
    ddIssueAllowed: yup.boolean().optional(),
    ttIssueAllowed: yup.boolean().optional(),
    dedicatedIssueOperations: yup.string().optional(),
  }) as unknown as yup.ObjectSchema<AdminUnitDetails, yup.AnyObject, unknown, "">;
};