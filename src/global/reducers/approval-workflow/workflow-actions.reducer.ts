import type { WorkflowActionData } from "@/types/approval-workflow/workflow-actions.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WorkflowActionState {
  isReady: boolean;
  isEditMode: boolean;
  currentActionId: string | null;
  currentActionData: WorkflowActionData | null;
}

const initialState: WorkflowActionState = {
  isReady: false,
  isEditMode: false,
  currentActionId: null,
  currentActionData: null,
};

export const workflowActionsSlice = createSlice({
  name: "workflowActions",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },

    setEditMode: (
      state,
      action: PayloadAction<{
        isEdit: boolean;
        actionId: string | null;
        actionData?: WorkflowActionData | null;
      }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentActionId = action.payload.actionId;
      state.currentActionData = action.payload.actionData || null;
    },
    resetWorkflowActionState: state => {
      state.isEditMode = false;
      state.currentActionId = null;
      state.isReady = false;
      state.currentActionData = null;
    },
  },
});

export const { setIsReady, setEditMode, resetWorkflowActionState } =
  workflowActionsSlice.actions;

export default workflowActionsSlice.reducer;
