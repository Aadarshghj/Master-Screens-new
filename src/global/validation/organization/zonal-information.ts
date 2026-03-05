import type { ZoneDetails } from "@/types/organisation/zonal-information";
import * as yup from "yup";

export const zoneRegistrationDetailSchema: yup.ObjectSchema<ZoneDetails> =
  yup.object({
    zonecode: yup
      .string()
      .max(10, "Maximum 10 characters allowed")
      .required("This field is required"),

    zonename: yup
      .string()
      .max(100, "Maximum 100 characters allowed")
      .required("This field is required"),

    zoneshortname: yup
      .string()
      .max(50, "Maximum 50 characters allowed")
      .required("This field is required"),

    status: yup.string().required("This field is required"),

    adminunittype: yup.string().required("This field is required"),

    parentzone: yup
      .number()
      .typeError("Parent Zone must be a number")
      .nullable()
      .defined()
      .test(
        "maxDigits",
        "Maximum 5 digits allowed",
        value => value === null || value.toString().length <= 5
      ),
    zonetype: yup.string().required("This field is required"),

    categoryid: yup.string().required("This field is required"),

    registrationdate: yup.date().nullable().required("This field is required"),

    openingdate: yup.date().nullable().required("This field is required"),

    closingdate: yup.date().nullable().defined(),

    dateofshift: yup.date().nullable().defined(),

    mergedon: yup.date().nullable().defined(),

    mergedto: yup.string().defined(),

    basecurrency: yup.string().max(3, "Maximum 3 characters allowed").defined(),

    language: yup.string().defined(),

    mainzone: yup.boolean().defined(),

    doornumber: yup
      .string()
      .required("This field is required")
      .max(4, "Maximum 4 digits allowed")
      .matches(/^\d+$/, "Only numbers allowed"),

    addressline1: yup.string().max(100).required("This field is required"),

    addressline2: yup.string().max(100).required("This field is required"),

    landmark: yup.string().required("This field is required"),

    placename: yup.string().required("This field is required"),

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

    postoffice: yup.string().required("This field is required"),

    city: yup.string().required("This field is required"),

    country: yup.string().required("This field is required"),

    state: yup.string().required("This field is required"),

    district: yup.string().required("This field is required"),

    timezone: yup.string().defined(),

    latitude: yup.string().defined(),

    longitude: yup.string().defined(),
  });
