import type { Staff } from "@/types/customer-management/staffs";

export const STAFFS_SAMPLE_DATA: Staff[] = [
  {
    staffName: "Ramesh Kumar",
    staffCode: "STF001",
    reportingTo: "Branch Manager",
    contactAddress: "Chennai, Tamil Nadu",
    contactPhone: "9876543210",
    email: "ramesh@bank.com",
    appUser: true,
    appUserReferenceId: "USR1001",
  },
  {
    staffName: "Anita Sharma",
    staffCode: "STF002",
    reportingTo: "Regional Manager",
    contactAddress: "Bangalore, Karnataka",
    contactPhone: "9123456789",
    email: "anita@bank.com",
    appUser: false,
    appUserReferenceId: "",
  },
];
