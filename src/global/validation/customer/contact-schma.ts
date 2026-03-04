// File: @/global/validation/customer/address-schema.ts
import * as yup from "yup";

export const addressValidationSchema = yup.object().shape({
  addressType: yup.string().required("Address type is required"),
  addressTypeId: yup.string().required("Address type ID is required"),
  houseNo: yup.string().required("House No is required"),
  streetLane: yup.string().required("Street/Lane name is required"),
  placeName: yup.string().required("Place name is required"),
  pinCode: yup
    .string()
    .required("PIN code is required")
    .matches(/^\d{6}$/, "PIN code must be 6 digits"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
  postOffice: yup.string().required("Post office is required"),
  city: yup.string().required("City is required"),
  landmark: yup.string(), // Optional
  digPin: yup.string(), // Optional - not mandatory
  latitude: yup.string(), // Optional - not mandatory
  longitude: yup.string(), // Optional - not mandatory
  addressProofType: yup.string().when("addressType", {
    is: (val: string) => val === "COMMUNICATION",
    then: schema =>
      schema.when("isCommunicationSame", {
        is: false,
        then: schema => schema.required("Address proof type is required"),
        otherwise: schema => schema,
      }),
    otherwise: schema => schema,
  }),
  addressProofTypeId: yup.string(),
  uploadedDocuments: yup.array().when("addressType", {
    is: (val: string) => val === "COMMUNICATION",
    then: schema =>
      schema.when("isCommunicationSame", {
        is: false,
        then: schema =>
          schema
            .min(1, "At least one document is required")
            .required("Documents are required"),
        otherwise: schema => schema,
      }),
    otherwise: schema => schema,
  }),
  coordinates: yup
    .object()
    .shape({
      latitude: yup.number(),
      longitude: yup.number(),
    })
    .optional(), // Make coordinates object optional
  isEnabled: yup.boolean(),
  isCommunicationSame: yup.boolean(),
});
