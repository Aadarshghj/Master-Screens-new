// addressDetails-schema.ts
import * as yup from "yup";
// addressType is dynamic; no enum import needed
import {
  addressErrorMessages,
  addressFieldLengths,
  addressValidationPatterns,
} from "@/pages/firm/management/onboarding/address-details/components/constants/form.constants";

// ============================================
// VALIDATION SCHEMA
// ============================================

export const addressDetailsValidationSchema = yup.object({
  // Address Type - Required (dynamic)
  addressType: yup
    .string()
    .trim()
    .required(addressErrorMessages.required("Address Type")),

  // Street/Lane Name - Required, 5-200 chars
  streetLaneName: yup
    .string()
    .trim()
    .min(
      addressFieldLengths.streetLaneName.min,
      addressErrorMessages.minLength(
        "Street/Lane Name",
        addressFieldLengths.streetLaneName.min
      )
    )
    .max(
      addressFieldLengths.streetLaneName.max,
      addressErrorMessages.maxLength(
        "Street/Lane Name",
        addressFieldLengths.streetLaneName.max
      )
    )
    .required(addressErrorMessages.required("Street/Lane Name")),

  // Place Name - Optional, 3-100 chars
  placeName: yup
    .string()
    .trim()
    .min(
      addressFieldLengths.placeName.min,
      addressErrorMessages.minLength(
        "Place Name",
        addressFieldLengths.placeName.min
      )
    )
    .max(
      addressFieldLengths.placeName.max,
      addressErrorMessages.maxLength(
        "Place Name",
        addressFieldLengths.placeName.max
      )
    )
    .optional(),

  // PIN Code - Required, exactly 6 digits
  pinCode: yup
    .string()
    .trim()
    .matches(
      addressValidationPatterns.pinCode,
      addressErrorMessages.invalidPinCode
    )
    .length(
      addressFieldLengths.pinCode.exact,
      addressErrorMessages.exactLength(
        "PIN Code",
        addressFieldLengths.pinCode.exact
      )
    )
    .required(addressErrorMessages.required("PIN Code")),

  // Country - Required (auto-populated)
  country: yup
    .string()
    .trim()
    .required(addressErrorMessages.required("Country")),

  // State - Required (auto-populated)
  state: yup.string().trim().required(addressErrorMessages.required("State")),

  // District - Optional (auto-populated)
  district: yup.string().trim().optional(),

  // Post Office - Optional
  postOffice: yup.string().trim().optional(),

  // City - Required (auto-populated)
  city: yup
    .string()
    .trim()
    .min(
      addressFieldLengths.city.min,
      addressErrorMessages.minLength("City", addressFieldLengths.city.min)
    )
    .max(
      addressFieldLengths.city.max,
      addressErrorMessages.maxLength("City", addressFieldLengths.city.max)
    )
    .required(addressErrorMessages.required("City")),

  // Landmark - Optional, 3-150 chars
  landmark: yup
    .string()
    .trim()
    .min(
      addressFieldLengths.landmark.min,
      addressErrorMessages.minLength(
        "Landmark",
        addressFieldLengths.landmark.min
      )
    )
    .max(
      addressFieldLengths.landmark.max,
      addressErrorMessages.maxLength(
        "Landmark",
        addressFieldLengths.landmark.max
      )
    )
    .optional(),

  // Digi Pin - Optional (auto-generated) - REMOVED REGEX VALIDATION
  digiPin: yup.string().trim().optional().nullable(),

  // Latitude - Optional, valid coordinate (only validate if provided)
  latitude: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(value => (value === "" ? null : value))
    .when([], {
      is: (val: string | null) => !!val,
      then: schema =>
        schema.matches(
          addressValidationPatterns.latitude,
          addressErrorMessages.invalidLatitude
        ),
      otherwise: schema => schema,
    }),

  // Longitude - Optional, valid coordinate (only validate if provided)
  longitude: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(value => (value === "" ? null : value))
    .when([], {
      is: (val: string | null) => !!val,
      then: schema =>
        schema.matches(
          addressValidationPatterns.longitude,
          addressErrorMessages.invalidLongitude
        ),
      otherwise: schema => schema,
    }),

  // Site Type - Optional (dynamic from backend)
  siteType: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(value => (value === "" ? null : value))
    .optional(),
  // Owner Name - Optional, 3-100 chars
  ownerName: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(v => (v === "" ? null : v))
    .when([], {
      is: (val: string | null) => !!val,
      then: schema =>
        schema
          .min(
            addressFieldLengths.ownerName.min,
            addressErrorMessages.minLength(
              "Owner Name",
              addressFieldLengths.ownerName.min
            )
          )
          .max(
            addressFieldLengths.ownerName.max,
            addressErrorMessages.maxLength(
              "Owner Name",
              addressFieldLengths.ownerName.max
            )
          ),
      otherwise: schema => schema,
    }),

  // Relationship with Firm - Optional, 3-100 chars
  relationshipWithFirm: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(v => (v === "" ? null : v))
    .when([], {
      is: (val: string | null) => !!val,
      then: schema =>
        schema
          .min(
            addressFieldLengths.relationshipWithFirm.min,
            addressErrorMessages.minLength(
              "Relationship with Firm",
              addressFieldLengths.relationshipWithFirm.min
            )
          )
          .max(
            addressFieldLengths.relationshipWithFirm.max,
            addressErrorMessages.maxLength(
              "Relationship with Firm",
              addressFieldLengths.relationshipWithFirm.max
            )
          ),
      otherwise: schema => schema,
    }),

  // Landline Number - Optional, valid format
  landlineNumber: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(v => (v === "" ? null : v))
    .when([], {
      is: (val: string | null) => !!val,
      then: schema =>
        schema.matches(
          addressValidationPatterns.landlineNumber,
          addressErrorMessages.invalidLandlineNumber
        ),
      otherwise: schema => schema,
    }),

  mobileNumber: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(value => (value === "" ? null : value))
    .when([], {
      is: (val: string | null) => !!val,
      then: schema =>
        schema
          .matches(
            addressValidationPatterns.mobileNumber,
            addressErrorMessages.invalidMobileNumber
          )
          .length(
            addressFieldLengths.mobileNumber.exact,
            addressErrorMessages.exactLength(
              "Mobile Number",
              addressFieldLengths.mobileNumber.exact
            )
          ),
      otherwise: schema => schema,
    }),

  // Email ID - Optional, valid email format
  emailId: yup
    .string()
    .trim()
    .nullable()
    .notRequired()
    .transform(value => (value === "" ? null : value))
    .when([], {
      is: (val: string | null) => !!val,
      then: schema =>
        schema
          .email(addressErrorMessages.invalidEmail)
          .min(
            addressFieldLengths.emailId.min,
            addressErrorMessages.minLength(
              "Email ID",
              addressFieldLengths.emailId.min
            )
          )
          .max(
            addressFieldLengths.emailId.max,
            addressErrorMessages.maxLength(
              "Email ID",
              addressFieldLengths.emailId.max
            )
          ),
      otherwise: schema => schema,
    }),

  // Metadata fields - Optional
  addressId: yup.string().optional(),
  isPrimary: yup.boolean().optional(),
  isActive: yup.boolean().optional(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});

export const basicAddressValidationSchema = yup.object({
  addressType: yup
    .string()
    .trim()
    .required(addressErrorMessages.required("Address Type")),
  streetLaneName: yup
    .string()
    .trim()
    .min(addressFieldLengths.streetLaneName.min)
    .required(addressErrorMessages.required("Street/Lane Name")),
  pinCode: yup
    .string()
    .trim()
    .matches(
      addressValidationPatterns.pinCode,
      addressErrorMessages.invalidPinCode
    )
    .required(addressErrorMessages.required("PIN Code")),
});

// Validation for location fields
export const locationValidationSchema = yup.object({
  latitude: yup
    .string()
    .trim()
    .matches(
      addressValidationPatterns.latitude,
      addressErrorMessages.invalidLatitude
    )
    .required(addressErrorMessages.required("Latitude")),
  longitude: yup
    .string()
    .trim()
    .matches(
      addressValidationPatterns.longitude,
      addressErrorMessages.invalidLongitude
    )
    .required(addressErrorMessages.required("Longitude")),
});

export const contactValidationSchema = yup.object({
  mobileNumber: yup
    .string()
    .trim()
    .matches(
      addressValidationPatterns.mobileNumber,
      addressErrorMessages.invalidMobileNumber
    )
    .required(addressErrorMessages.required("Mobile Number")),
  emailId: yup
    .string()
    .trim()
    .email(addressErrorMessages.invalidEmail)
    .optional(),
});

export const validateAddressField = async (
  fieldName: string,
  value: unknown
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    await (
      yup.reach(
        addressDetailsValidationSchema,
        fieldName
      ) as yup.Schema<unknown>
    ).validate(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { isValid: false, error: error.message };
    }
    return { isValid: false, error: "Validation error occurred" };
  }
};

export const validateAddress = async (
  address: Record<string, unknown>
): Promise<{ isValid: boolean; errors?: Record<string, string> }> => {
  try {
    await addressDetailsValidationSchema.validate(address, {
      abortEarly: false,
    });
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false };
  }
};

export const validateRequiredFields = async (
  address: Record<string, unknown>
): Promise<{ isValid: boolean; errors?: Record<string, string> }> => {
  const requiredFieldsSchema = yup.object({
    addressType: addressDetailsValidationSchema.fields.addressType,
    streetLaneName: addressDetailsValidationSchema.fields.streetLaneName,
    pinCode: addressDetailsValidationSchema.fields.pinCode,
    country: addressDetailsValidationSchema.fields.country,
    state: addressDetailsValidationSchema.fields.state,
    city: addressDetailsValidationSchema.fields.city,
  });

  try {
    await requiredFieldsSchema.validate(address, { abortEarly: false });
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false };
  }
};

export const validatePinCodeWithState = (
  pinCode: string,
  state: string
): boolean => {
  if (!addressValidationPatterns.pinCode.test(pinCode)) {
    return false;
  }

  const pinCodeStateMap: Record<string, string[]> = {
    "1": [
      "Delhi",
      "Haryana",
      "Punjab",
      "Himachal Pradesh",
      "Jammu and Kashmir",
      "Chandigarh",
    ],
    "2": ["Uttar Pradesh", "Uttarakhand"],
    "3": ["Rajasthan", "Gujarat", "Daman and Diu", "Dadra and Nagar Haveli"],
    "4": ["Maharashtra", "Goa"],
    "5": ["Andhra Pradesh", "Telangana", "Karnataka"],
    "6": ["Tamil Nadu", "Kerala", "Puducherry", "Lakshadweep"],
    "7": [
      "West Bengal",
      "Odisha",
      "Arunachal Pradesh",
      "Nagaland",
      "Manipur",
      "Mizoram",
      "Tripura",
      "Meghalaya",
      "Assam",
      "Sikkim",
    ],
    "8": ["Bihar", "Jharkhand"],
    "9": ["Mumbai", "Maharashtra"],
  };

  const firstDigit = pinCode.charAt(0);
  const validStates = pinCodeStateMap[firstDigit];

  return validStates ? validStates.includes(state) : false;
};

export const validateIndianCoordinates = (
  latitude: string,
  longitude: string
): boolean => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);

  const INDIA_BOUNDS = {
    minLat: 6.4,
    maxLat: 35.5,
    minLon: 68.1,
    maxLon: 97.4,
  };

  return (
    lat >= INDIA_BOUNDS.minLat &&
    lat <= INDIA_BOUNDS.maxLat &&
    lon >= INDIA_BOUNDS.minLon &&
    lon <= INDIA_BOUNDS.maxLon
  );
};

export type AddressValidationSchema = yup.InferType<
  typeof addressDetailsValidationSchema
>;
export type BasicAddressValidationSchema = yup.InferType<
  typeof basicAddressValidationSchema
>;
export type LocationValidationSchema = yup.InferType<
  typeof locationValidationSchema
>;
export type ContactValidationSchema = yup.InferType<
  typeof contactValidationSchema
>;
