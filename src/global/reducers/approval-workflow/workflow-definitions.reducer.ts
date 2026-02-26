import type { WorkflowDefinitionData } from "@/types/approval-workflow/workflow-definitions.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WorkflowDefinitionState {
  isReady: boolean;
  isEditMode: boolean;
  currentDefinitionId: string | null;
  currentDefinitionData: WorkflowDefinitionData | null;
}

const initialState: WorkflowDefinitionState = {
  isReady: false,
  isEditMode: false,
  currentDefinitionId: null,
  currentDefinitionData: null,
};

export const workflowDefinitionsSlice = createSlice({
  name: "workflowDefinitions",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },

    setEditMode: (
      state,
      action: PayloadAction<{
        isEdit: boolean;
        definitionId: string | null;
        definitionData?: WorkflowDefinitionData | null;
      }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentDefinitionId = action.payload.definitionId;
      state.currentDefinitionData = action.payload.definitionData || null;
    },
    resetWorkflowDefinitionState: state => {
      state.isEditMode = false;
      state.currentDefinitionId = null;
      state.isReady = false;
      state.currentDefinitionData = null;
    },
  },
});

export const { setIsReady, setEditMode, resetWorkflowDefinitionState } =
  workflowDefinitionsSlice.actions;

export default workflowDefinitionsSlice.reducer;
