import * as yup from "yup";
import {
  FirmType,
  CannelmentType,
  RoleInFirm,
  DurationWithCompany,
} from "@/types/firm/firm-details.types";

export const firmDetailsValidationSchema = yup.object({
  typeOfFirm: yup.mixed<FirmType>().required("Please select the firm type"),
  firmName: yup.string().required("Please enter the Firm name"),
  productIndustryCategory: yup
    .mixed()
    .required("Please select the Product/Industry category "),
  registrationNo: yup.string().required("Please enter the Registration number"),
  registrationDate: yup
    .string()
    .required("Please enter the Registration date "),
  canvassedType: yup
    .mixed<CannelmentType>()
    .required("Please select the Canvassed type "),
  canvasserIdentity: yup.string().required("Please enter the Canvasser ID"),

  associatedPersons: yup
    .array()
    .of(
      yup.object({
        customerCode: yup.string().required(),
        customerName: yup.string().required(),
        roleInFirm: yup.mixed<RoleInFirm>().required(),
        authorizedSignatory: yup.boolean().required(),
        durationWithCompany: yup.mixed<DurationWithCompany>().required(),
      })
    )
    .ensure()
    .nullable(),
});
