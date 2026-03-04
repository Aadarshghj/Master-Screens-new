import type { StaffFormData } from "@/types/customer-management/staffs";

export const STAFF_DEFAULT_VALUES: StaffFormData = {
  staffName: "",
  staffCode: "",
  reportingToIdentity: "",
  contactAddress: "",
  contactPhone: "",
  email: "",
  isAppUser: false,
  appUserRefId: "",
};
