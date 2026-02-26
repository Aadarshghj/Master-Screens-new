import type { LeadAssignmentFormData, LeadFilterFormData } from "@/types/lead";
import * as yup from "yup";

export const leadFilterValidationSchema: yup.ObjectSchema<LeadFilterFormData> =
  yup.object().shape({
    leadProduct: yup.string().default("all"),
    leadSource: yup.string().default("all"),
    leadStage: yup.string().default("all"),
    gender: yup.string().default("all"),
    leadDate: yup
      .string()
      .default("")
      .test("valid-date", "Please enter a valid date", value => {
        if (!value || value.trim() === "") return true;
        return /^\d{4}-\d{2}-\d{2}$/.test(value);
      }),
  });

export const leadAssignmentValidationSchema: yup.ObjectSchema<LeadAssignmentFormData> =
  yup.object().shape({
    assignTo: yup.string().required("Staff selection is required"),
    assignmentDate: yup.string().required("Assignment date is required"),
  });

export const validateLeadSelection = (selectedLeads: string[]) => {
  if (selectedLeads.length === 0) {
    return "Please select at least one lead to assign";
  }
  if (selectedLeads.length > 50) {
    return "Cannot assign more than 50 leads at once";
  }
  return null;
};
