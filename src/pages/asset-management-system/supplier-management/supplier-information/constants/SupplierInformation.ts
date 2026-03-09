import type {SupplierInformationType} from "@/types/asset-management-system/supplier-management/supplier-information"


export const DEFAULT_VALUES: SupplierInformationType = {
  id: "",
  supplierName: "",
  tradeName: "",
 supplierRiskCategory:"",

  panNumber: "",
  panFile: "",
  panVerification: true,

  gstRegistrationType: "",
  gstin: "",
  gstinFile:"",

  msmeRegistrationNo: "",
  msmeFile:"",
  msmeType: "",

  cinOrLlpin: "",
  cinFile:"",

  incorporationDate: "",

  contactPersonName: "",
  designation: "",
  isActive: true,
};
