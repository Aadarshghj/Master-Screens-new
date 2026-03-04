import type {
  FirmProfile,
  AssociatedPerson,
  AssociatedPersonFormInputs,
} from "@/types/firm/firm-details.types";
import {
  FirmType,
  RoleInFirm,
  DurationWithCompany,
} from "@/types/firm/firm-details.types";

export const firmProfileDefaultValues: FirmProfile = {
  typeOfFirm: undefined,
  firmName: "",
  productIndustryCategory: "",
  registrationNo: "",
  registrationDate: "",
  canvassedType: undefined,
  canvasserIdentity: "",
  associatedPersons: [],
  status: "",
  firmCode: "",
};

export const associatedPersonDefaultValues: AssociatedPerson = {
  customerCode: "",
  customerName: "",
  roleInFirm: RoleInFirm.EMPLOYEE,
  authorizedSignatory: false,
  durationWithCompany: DurationWithCompany.LESS_THAN_1_YEAR,
};

export const associatedPersonFormDefaultValues: AssociatedPersonFormInputs = {
  customerCode: "",
  customerName: "",
  roleInFirm: null,
  authorizedSignatory: false,
  durationWithCompany: null,
};

export const firmFormMeta = {
  requiredFields: [
    "firmName",
    "typeOfFirm",
    "registrationNo",
    "registrationDate",
  ],
  dateFields: ["registrationDate"],
  defaultFirmType: FirmType.SOLE_PROPRIETORSHIP,
};

export const firmSearchFilterDefaultValues = {
  firmName: "",
  typeOfFirm: "all",
  registrationNo: "",
  canvassedType: "all",
};
