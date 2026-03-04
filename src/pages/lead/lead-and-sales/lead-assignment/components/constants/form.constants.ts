import type { LeadFilterFormData, LeadAssignmentFormData } from "@/types/lead";

export const leadFilterDefaultValues: LeadFilterFormData = {
  leadProduct: "all",
  leadSource: "all",
  leadStage: "all",
  gender: "all",
  leadDate: "",
};

export const leadAssignmentDefaultValues: LeadAssignmentFormData = {
  assignTo: "",
  assignmentDate: new Date().toISOString().split("T")[0],
};
