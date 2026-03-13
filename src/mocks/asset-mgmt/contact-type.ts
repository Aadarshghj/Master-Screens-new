import { ContactType } from "../../types/asset-mgmt/contact-type";

export const CONTACT_TYPE_SAMPLE_DATA: ContactType[] = [
  {
    contactType: "Primary Contact",
    contactTypeDesc: "Main person responsible for communication.",
    status: true,
  },
  {
    contactType: "Secondary Contact",
    contactTypeDesc: "Alternate contact person if primary is unavailable.",
    status: true,
  },
  {
    contactType: "Emergency Contact",
    contactTypeDesc: "Person to contact during emergencies.",
    status: true,
  },
  {
    contactType: "Office Contact",
    contactTypeDesc: "Official workplace contact details.",
    status: true,
  },
  {
    contactType: "Personal Contact",
    contactTypeDesc: "Personal communication contact details.",
    status: true,
  },
  {
    contactType: "Billing Contact",
    contactTypeDesc: "Person responsible for billing and payment communication.",
    status: true,
  },
  {
    contactType: "Technical Contact",
    contactTypeDesc: "Person responsible for technical queries or system issues.",
    status: true,
  },
  {
    contactType: "Authorized Representative",
    contactTypeDesc: "Authorized person acting on behalf of the customer or organization.",
    status: true,
  },
];