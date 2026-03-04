import type {
  LeadFollowupDetailsFormData,
  LeadFollowupFilterFormData,
  LeadFollowupHistoryFilterFormData,
} from "@/types/lead/lead-followup.types";

export const leadFollowupFilterDefaultValues: LeadFollowupFilterFormData = {
  leadName: "",
  assignee: "all",
  followUpType: "all",
  // leadDateFrom: new Date().toISOString().split("T")[0],
  // leadDateTo: new Date().toISOString().split("T")[0],
  leadDateFrom: "",
  leadDateTo: "",
  leadStage: "all",
};

export const leadFollowupHistoryFilterDefaultValues: LeadFollowupHistoryFilterFormData =
  {
    leadId: "",
    assignee: "all",
    followUpType: "all",
    leadDateFrom: "",
    leadDateTo: "",
    // leadDateFrom: new Date().toISOString().split("T")[0],
    // leadDateTo: new Date().toISOString().split("T")[0],
    leadStage: "all",
    nextFollowUpDate: "",
  };

export const singleLeadFollowupDefaultValues: LeadFollowupDetailsFormData = {
  followUpDate: new Date().toISOString().split("T")[0],
  nextFollowUpDate: "",
  productService: "",
  leadStage: "",
  followUpType: "",
  followUpNotes: "",
};
