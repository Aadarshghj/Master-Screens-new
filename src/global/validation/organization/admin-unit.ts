import type { AdminUnitDetails } from "@/types/organisation/admin-unit";
import * as yup from "yup";

const noTripleConsecutive = (value: string | undefined): boolean => {
  if (!value) return true;
  return !/(.)\1\1/i.test(value);
};
const noTripleConsecutiveMsg =
  "Three or more identical consecutive characters are not allowed";

const notAllSameChar = (value: string | undefined): boolean => {
  if (!value || value.length <= 1) return true;
  return !/^(.)\1+$/.test(value.trim());
};
const notAllSameCharMsg = "Value cannot consist of a single repeated character";

const namePattern = /^[a-zA-Z0-9 \-/]+$/;
const namePatternMsg =
  "Only letters, numbers, spaces, hyphens, and slashes are allowed";

const hasAtLeastOneLetter = (value: string | undefined): boolean => {
  if (!value) return true;
  return /[a-zA-Z]/.test(value);
};
const hasAtLeastOneLetterMsg = "Value must contain at least one letter";

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

    adminUnitTypeIdentity: yup.string().required("This field is required"),

    // ✅ Removed: no-triple-consecutive and not-all-same tests
    // Branch code is auto-generated (e.g. BR001) and must not be blocked
    // by repeated character rules.
    branchCode: yup
      .string()
      .required("This field is required")
      .max(10, "Maximum 10 characters allowed")
      .matches(
        /^[A-Za-z0-9]+$/,
        "Branch code must contain only letters and numbers"
      ),

    branchName: yup
      .string()
      .required("This field is required")
      .max(100, "Maximum 100 characters allowed")
      .min(2, "Minimum 2 characters required")
      .matches(namePattern, namePatternMsg)
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      )
      .test("not-all-same", notAllSameCharMsg, notAllSameChar)
      .test("has-letter", hasAtLeastOneLetterMsg, hasAtLeastOneLetter),

    branchShortName: yup
      .string()
      .optional()
      .max(50, "Maximum 50 characters allowed")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      )
      .test("not-all-same", notAllSameCharMsg, notAllSameChar),

    branchStatusIdentity: yup.string().required("This field is required"),

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
      .test("required", "This field is required", isNonEmpty),

    openingDate: yup
      .string()
      .nullable()
      .test("required", "This field is required", isNonEmpty),

    closingDate: yup.string().nullable().optional(),
    dateOfShift: yup.string().nullable().optional(),

    doorNumber: yup
      .string()
      .required("This field is required")
      .max(50, "Maximum 50 characters allowed")
      .matches(
        /^[a-zA-Z0-9/ -]+$/,
        "Only letters, numbers, spaces, hyphens, and slashes are allowed"
      )
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      ),

    addressLine1: yup
      .string()
      .required("This field is required")
      .max(100, "Maximum 100 characters allowed")
      .min(5, "Minimum 5 characters required")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      )
      .test("not-all-same", notAllSameCharMsg, notAllSameChar),

    addressLine2: yup
      .string()
      .required("This field is required")
      .max(100, "Maximum 100 characters allowed")
      .min(3, "Minimum 3 characters required")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      )
      .test("not-all-same", notAllSameCharMsg, notAllSameChar),

    landmark: yup
      .string()
      .required("This field is required")
      .max(100, "Maximum 100 characters allowed")
      .min(3, "Minimum 3 characters required")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      )
      .test("not-all-same", notAllSameCharMsg, notAllSameChar),

    placeName: yup
      .string()
      .required("This field is required")
      .max(100, "Maximum 100 characters allowed")
      .min(2, "Minimum 2 characters required")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      )
      .test("not-all-same", notAllSameCharMsg, notAllSameChar),

    pincode: yup
      .string()
      .required("This field is required")
      .matches(/^[1-9][0-9]{5}$/, "Pincode must be exactly 6 digits")
      .test(
        "valid-range",
        "Pincode must be between 110001 and 999999",
        value => {
          if (!value) return false;
          const num = Number(value);
          return num >= 110001 && num <= 999999;
        }
      ),

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
      .max(20, "Maximum 20 characters allowed")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      ),

    parentAdminCode: yup
      .string()
      .optional()
      .max(20, "Maximum 20 characters allowed")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      ),

    micrCode: yup
      .string()
      .optional()
      .max(9, "MICR code must be exactly 9 digits")
      .matches(/^[0-9]*$/, "MICR code must contain only digits")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      ),

    ifscCode: yup
      .string()
      .optional()
      .max(11, "IFSC code must be 11 characters")
      .matches(
        /^[A-Z]{4}0[A-Z0-9]{6}$|^$/,
        "IFSC code must be in format: XXXX0XXXXXX (4 letters, 0, 6 alphanumeric)"
      ),

    swiftBicCode: yup
      .string()
      .optional()
      .max(11, "SWIFT/BIC code must be 8 or 11 characters")
      .matches(
        /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$|^$/,
        "SWIFT/BIC code must be 8 or 11 characters (letters and numbers only)"
      ),

    bsrCode: yup
      .string()
      .optional()
      .max(7, "BSR code must be 7 digits")
      .matches(/^[0-9]*$/, "BSR code must contain only digits"),

    authDealerCode: yup
      .string()
      .optional()
      .max(10, "Maximum 10 characters allowed")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      ),

    tbaMainKey: yup
      .string()
      .optional()
      .max(20, "Maximum 20 characters allowed")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      ),

    regDirectoryCode: yup
      .string()
      .optional()
      .max(10, "Maximum 10 characters allowed")
      .test(
        "no-triple-consecutive",
        noTripleConsecutiveMsg,
        noTripleConsecutive
      ),

    sizeId: yup
      .number()
      .nullable()
      .optional()
      .typeError("Must be a number")
      .min(0, "Cannot be negative")
      .max(9999, "Maximum value is 9999"),

    numExtensionCounters: yup
      .number()
      .nullable()
      .optional()
      .typeError("Must be a number")
      .min(0, "Cannot be negative")
      .max(9999, "Maximum value is 9999"),

    linkServiceMainBranchId: yup
      .number()
      .nullable()
      .optional()
      .typeError("Must be a number")
      .min(0, "Cannot be negative"),

    numSplitPremises: yup
      .number()
      .nullable()
      .optional()
      .typeError("Must be a number")
      .min(0, "Cannot be negative")
      .max(9999, "Maximum value is 9999"),

    numOfficersAvailable: yup
      .number()
      .nullable()
      .optional()
      .typeError("Must be a number")
      .min(0, "Cannot be negative")
      .max(99999, "Maximum value is 99999"),

    baseCurrency: yup
      .string()
      .optional()
      .max(3, "Maximum 3 characters allowed")
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
