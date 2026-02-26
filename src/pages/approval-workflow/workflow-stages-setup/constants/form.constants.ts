import type {
  WorkflowStageFormData,
  WorkflowStageSearchParams,
} from "@/types/approval-workflow/workflow-stagesetup";

export const workflowStageDefaultValues: WorkflowStageFormData = {
  workflow: "",
  levelName: "",
  assignedToRole: "",
  finalLevel: false,
};

export const workflowFilterDefaultValues: WorkflowStageSearchParams = {
  page: 0,
  size: 10,
};

// Table constants
export const ITEMS_PER_PAGE = 10;
export const MAX_VISIBLE_PAGES = 5;

// Table text constants
export const TABLE_TEXTS = {
  NO_DATA: "Empty",
  SHOWING_ENTRIES: "Showing",
  OF_ENTRIES: "of",
  ENTRIES: "entries",
  TO: "to",
} as const;

// Badge text constants
export const BADGE_TEXTS = {
  TRUE: "True",
  FALSE: "False",
} as const;
