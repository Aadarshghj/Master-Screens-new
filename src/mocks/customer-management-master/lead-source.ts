import type { LeadSource } from "@/types/customer-management/lead-source";

export const LEAD_SOURCE_SAMPLE_DATA: LeadSource[] = [
  {
    leadSourceName: "Website",
    description: "Leads generated from company website",
  },
  {
    leadSourceName: "Referral",
    description: "Leads referred by existing customers",
  },
  {
    leadSourceName: "Walk-In",
    description: "Direct walk-in customers",
  },
];
