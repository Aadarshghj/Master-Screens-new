export const lead = {
  // Lead Details APIs
  getLeadDetails: ({ leadId }: { leadId: string }) => `/lead/${leadId}/details`,
  saveLeadDetails: () => "/api/v1/leads",
  updateLeadDetails: ({ leadId }: { leadId: string }) =>
    `/api/v1/leads/${leadId}`,
  getLeadDetailsConfig: () => "/lead/config",
  getAdditionalReferenceConfig: ({ leadId }: { leadId: string }) =>
    `/lead/${leadId}/additional-reference-config`,
  searchLead: () => "/api/v1/leads/search",
  getAdditionalReferenceByProduct: () =>
    "/api/v1/master/additional-reference-configurations",
  getSuccessDetails: ({ batchId }: { batchId: string }) =>
    `/api/v1/leads/import-history/${batchId}/success`,
  getErrorDetails: ({ batchId }: { batchId: string }) =>
    `/api/v1/leads/import-history/${batchId}/errors`,

  // Lead  Follow-up APIs
  saveLeadFollowup: ({ leadId }: { leadId: string }) =>
    `/api/v1/leads/${leadId}/follow-up-history`,
  bulkSaveLeadFollowup: () => "/api/v1/leads/follow-up-history/bulk",
  searchFollowupHistory: () => "/api/v1/leads/follow-up-history/search",
  searchLeadFollowups: () => "/api/v1/leads/follow-up/search",
  getLeadFollowupHistory: ({ leadIdentity }: { leadIdentity: string }) =>
    `/api/v1/leads/${leadIdentity}/follow-up-history`,
  updateLeadFollowup: ({ leadIdentity }: { leadIdentity: string }) =>
    `/api/v1/leads/${leadIdentity}/follow-up`,

  // lead-dms
  viewFile: () => "/api/v1/dms/file/view/presignedUrl",
  bulkImport: () => "/api/v1/leads/bulk-import",
  getImportBatches: () => "/api/v1/leads/import-batches",
  getBatchDetails: ({ batchId }: { batchId: string }) =>
    `/api/v1/leads/import-batches/${batchId}`,

  // Lead Assignment operations
  searchLeadAssignments: () => "/api/v1/leads/lead-assignments/search",
  bulkAssignLeads: () => "/api/v1/leads/lead-assignments/bulk",
  getLeadAssignment: ({ leadId }: { leadId: string }) =>
    `/api/v1/leads/lead-assignments/${leadId}`,
  updateLeadAssignment: ({ leadIdentity }: { leadIdentity: string }) =>
    `/api/v1/leads/${leadIdentity}/assignment-history`,
  getAssignmentHistory: ({ leadId }: { leadId: string }) =>
    `/api/v1/leads/${leadId}/assignment-history`,

  // User endpoints (for staff/assignment)
  getUsers: () => "/api/v1/users",
};
