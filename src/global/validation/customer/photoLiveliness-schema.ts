import * as yup from "yup";
import type { PhotoLivelinessFormData } from "@/types/customer/photo.types";

const coordinatePattern = /^-?\d+(\.\d+)?$/;

const messages = {
  required: (field: string) => `${field} is required`,
  invalid: (field: string) => `Invalid ${field} format`,
  outOfBounds: (field: string, bounds: string) =>
    `${field} must be within ${bounds}`,
  futureDate: "Date cannot be in the future",
  photoRequired: "A photo must be captured",
  invalidDate: "Invalid date format",
  invalidAccuracy: "Invalid accuracy value",
};

const isValidIndianLatitude = (lat: string): boolean => {
  if (!lat) return false;
  const latitude = parseFloat(lat);
  return !isNaN(latitude) && latitude >= 6.0 && latitude <= 37.6;
};

const isValidIndianLongitude = (lng: string): boolean => {
  if (!lng) return false;
  const longitude = parseFloat(lng);
  return !isNaN(longitude) && longitude >= 68.7 && longitude <= 97.25;
};

const coordinateSchema = (
  fieldName: string,
  min: number,
  max: number,
  bounds: string
) =>
  yup
    .string()
    .required(messages.required(fieldName))
    .matches(coordinatePattern, messages.invalid(fieldName))
    .test("valid-coordinate", messages.invalid(fieldName), value =>
      value
        ? !isNaN(parseFloat(value)) &&
          parseFloat(value) >= min &&
          parseFloat(value) <= max
        : false
    )
    .test("bounds-check", messages.outOfBounds(fieldName, bounds), value => {
      if (fieldName === "Latitude") return isValidIndianLatitude(value || "");
      if (fieldName === "Longitude") return isValidIndianLongitude(value || "");
      return true;
    })
    .transform(value => value?.trim() || "");

const dateSchema = yup
  .string()
  .required(messages.required("Capture time"))
  .transform(value => value?.trim() || "");

const photoDataSchema = yup
  .string()
  .required(messages.required("Photo data"))
  .test(
    "has-photo",
    messages.photoRequired,
    value => typeof value === "string" && value.length > 0
  );

export const photoValidationSchema = yup.object({
  captureBy: yup
    .string()
    .required(messages.required("Capture By"))
    .transform(value => (value === "" ? "" : value)),

  latitude: coordinateSchema("Latitude", -90, 90, "Indian geographical bounds"),
  longitude: coordinateSchema(
    "Longitude",
    -180,
    180,
    "Indian geographical bounds"
  ),

  accuracy: yup
    .string()
    .nullable()
    .transform(value => (value === "" || value === undefined ? null : value))
    .defined()
    .test("valid-accuracy", messages.invalidAccuracy, value => {
      if (!value) return true;
      if (value === "Verification Failed") return true;
      const accuracy = parseFloat(value);
      return !isNaN(accuracy) && accuracy >= 0;
    }),

  captureDevice: yup
    .string()
    .nullable()
    .transform(value => (value === "" ? null : value))
    .defined(),

  locationDescription: yup
    .string()
    .nullable()
    .transform(value => (value === "" ? null : value))
    .defined(),

  captureTime: dateSchema,
  photoData: photoDataSchema,
  // Photo capture and UI state
  capturedImage: yup.string().nullable().optional().defined(),
  showWebcam: yup.boolean().optional().defined(),
  processingStep: yup.string().optional().defined(),
  livenessScore: yup.number().nullable().optional().defined(),
  isCapturing: yup.boolean().optional().defined(),
  captureTimestamp: yup.date().nullable().optional().defined(),
  dmsFileData: yup.mixed().nullable().optional().defined(),
}) as yup.ObjectSchema<PhotoLivelinessFormData>;

// Transform form data for preprocessing
export const transformFormData = (
  data: PhotoLivelinessFormData
): PhotoLivelinessFormData => {
  return {
    captureBy: data.captureBy || "",
    latitude: data.latitude?.trim() || "",
    longitude: data.longitude?.trim() || "",
    accuracy: data.accuracy || null,
    captureDevice: data.captureDevice || null,
    locationDescription: data.locationDescription?.trim() || null,
    captureTime: data.captureTime?.trim() || "",
    photoData: data.photoData?.trim() || "",
    capturedImage: data.capturedImage || null,
    showWebcam: data.showWebcam || false,
    processingStep: data.processingStep || "",
    livenessScore: data.livenessScore || null,
    isCapturing: data.isCapturing || false,
    captureTimestamp: data.captureTimestamp || null,
    dmsFileData: data.dmsFileData || null,
  };
};

// Field-specific validation functions for individual field validation
export const validateField = async <K extends keyof PhotoLivelinessFormData>(
  fieldName: K,
  value: PhotoLivelinessFormData[K],
  formData: PhotoLivelinessFormData
): Promise<string | null> => {
  try {
    await photoValidationSchema.validateAt(fieldName, {
      ...formData,
      [fieldName]: value,
    });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return "Validation error";
  }
};

export const validatePhotoCaptureInfo = (data: {
  captureTime: string | null;
  latitude: string | null;
  longitude: string | null;
}) => {
  const captureInfoSchema = photoValidationSchema.pick([
    "captureTime",
    "latitude",
    "longitude",
  ]);
  return captureInfoSchema.validate(data, { abortEarly: false });
};

export const validatePhotoSubmissionRequirements = (
  formData: {
    photoData: string | null;
    captureTime: string | null;
    latitude: string | null;
    longitude: string | null;
  },
  capturedImage: string | null,
  hasKycDocument: boolean
): boolean => {
  return Boolean(
    formData.captureTime &&
      formData.latitude &&
      formData.longitude &&
      formData.photoData &&
      capturedImage &&
      hasKycDocument
  );
};

// Use Yup's built-in validation instead of custom functions
export const validateForm = async (
  data: PhotoLivelinessFormData
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await photoValidationSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
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
    return { isValid: false, errors: { general: "Validation error" } };
  }
};

// For checking if form is complete (all required fields filled)
export const isFormComplete = async (
  data: PhotoLivelinessFormData
): Promise<boolean> => {
  try {
    await photoValidationSchema.validate(data, { abortEarly: false });
    return true;
  } catch {
    return false;
  }
};
