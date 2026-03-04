import * as yup from "yup";
import type { AddressFormData } from "@/types/customer/address.types";

const pincodePattern = /^\d{6}$/;

const messages = {
  required: (field: string) => `${field} is required`,
  invalidFormat: (field: string) => `Invalid ${field.toLowerCase()} format`,
  invalidCoordinate: "Invalid coordinate format",
  invalidPincode: "PIN code must be exactly 6 digits",
  addressProofRequired:
    "Address proof type is required for communication address",
};

const conditionalRequiredSchema = (fieldName: string, condition: string) => {
  return yup
    .string()
    .transform(value => value?.trim() || "")
    .when(condition, {
      is: true,
      then: schema => schema,
      otherwise: schema => schema.required(messages.required(fieldName)),
    })
    .transform(value => value || "");
};

export const addressValidationSchema = yup.object({
  addressType: yup.string().required(messages.required("Address type")),
  addressTypeId: yup.string().default(""),

  houseNo: conditionalRequiredSchema("House No", "isCommunicationSame"),
  streetLane: conditionalRequiredSchema(
    "Street/Lane name",
    "isCommunicationSame"
  ),
  placeName: conditionalRequiredSchema("Place name", "isCommunicationSame"),

  pinCode: yup
    .string()
    .transform(value => value?.trim() || "")
    .when("isCommunicationSame", {
      is: true,
      then: schema => schema,
      otherwise: schema =>
        schema
          .required(messages.required("PIN code"))
          .matches(pincodePattern, messages.invalidPincode),
    }),

  country: conditionalRequiredSchema("Country", "isCommunicationSame"),
  state: conditionalRequiredSchema("State", "isCommunicationSame"),
  district: conditionalRequiredSchema("District", "isCommunicationSame"),
  city: conditionalRequiredSchema("City", "isCommunicationSame"),
  landmark: conditionalRequiredSchema("Landmark", "isCommunicationSame"),

  postOfficeId: yup.string().required("Post office is required"),
  // landmark: yup.string().default(""),
  digPin: yup.string().default(""),

  latitude: yup.string().default(""),
  longitude: yup.string().default(""),

  addressProofType: yup
    .string()
    .default("")
    .when(["addressType", "isCommunicationSame"], {
      is: (addressType: string, isCommunicationSame: boolean) => {
        const normalizedType = addressType?.toUpperCase().trim();
        if (normalizedType === "PERMANENT") return false;
        if (normalizedType === "COMMUNICATION" && isCommunicationSame)
          return false;

        return true;
      },
      then: schema => schema.required(messages.required("Address Proof Type")),
      otherwise: schema => schema.notRequired(),
    }),

  addressProofTypeId: yup.string().default(""),

  uploadedDocuments: yup.array().when(["addressType", "isCommunicationSame"], {
    is: (addressType: string, isCommunicationSame: boolean) => {
      const normalizedType = addressType?.toUpperCase().trim();
      return normalizedType !== "PERMANENT" && !isCommunicationSame;
    },
    then: schema =>
      schema
        .min(1, "Please upload at least one document")
        .required("Document upload is required"),
    otherwise: schema => schema.notRequired(),
  }),

  coordinates: yup.object().shape({
    latitude: yup.number().default(0),
    longitude: yup.number().default(0),
  }),

  isEnabled: yup.boolean().default(true),
  isCommunicationSame: yup.boolean().default(false),
  selectedFile: yup.mixed().nullable().optional(),
  dmsFileData: yup.object().nullable().optional(),
  selectedPostOfficeId: yup.string().optional(),
  isMapLoading: yup.boolean().optional(),
  triggerPinCodeSearch: yup.boolean().optional(),
});

export const validateField = async <K extends keyof AddressFormData>(
  fieldName: K,
  value: AddressFormData[K],
  formData: AddressFormData
): Promise<string | null> => {
  try {
    await addressValidationSchema.validateAt(fieldName, {
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

export const transformFormData = (
  data: Partial<AddressFormData>
): AddressFormData => {
  return {
    addressType: data.addressType || "",
    addressTypeId: data.addressTypeId || "",
    houseNo: data.houseNo?.trim() || "",
    streetLane: data.streetLane?.trim() || "",
    placeName: data.placeName?.trim() || "",
    pinCode: data.pinCode?.trim() || "",
    country: data.country?.trim() || "India",
    state: data.state?.trim() || "",
    district: data.district?.trim() || "",
    postOfficeId: data.postOfficeId?.trim() || "",
    city: data.city?.trim() || "",
    landmark: data.landmark?.trim() || "",
    digPin: data.digPin?.trim() || "",
    latitude: data.latitude?.trim() || "",
    longitude: data.longitude?.trim() || "",
    addressProofType: data.addressProofType?.trim() || "",
    addressProofTypeId: data.addressProofTypeId?.trim() || "",
    uploadedDocuments: data.uploadedDocuments || [],
    coordinates: data.coordinates || { latitude: 0, longitude: 0 },
    isEnabled: data.isEnabled ?? true,
    isCommunicationSame: data.isCommunicationSame ?? false,
    selectedFile: data.selectedFile || null,
    dmsFileData: data.dmsFileData || null,
    selectedPostOfficeId: data.selectedPostOfficeId || "",
    isMapLoading: data.isMapLoading || false,
    triggerPinCodeSearch: data.triggerPinCodeSearch || false,
  };
};
