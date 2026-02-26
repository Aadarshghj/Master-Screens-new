import type { ApprovalConfirmationModalState } from "@/types/approval-workflow/approval-queue.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: ApprovalConfirmationModalState = {
  showConfirmationModal: false,
  action: null,
  instanceIdentity: null,
};

export const approvalConfirmationModalSlice = createSlice({
  name: "approvalConfirmationModalSlice",
  initialState,
  reducers: {
    setShowApprovalConfirmationModal: (
      state,
      action: PayloadAction<ApprovalConfirmationModalState>
    ) => {
      state.showConfirmationModal = action.payload.showConfirmationModal;
      state.action = action.payload.action;
      state.instanceIdentity = action.payload.instanceIdentity;
    },
    resetApprovalConfirmationModal: state => {
      state.showConfirmationModal = false;
      state.action = null;
    },
  },
});

export const {
  setShowApprovalConfirmationModal,
  resetApprovalConfirmationModal,
} = approvalConfirmationModalSlice.actions;

export default approvalConfirmationModalSlice.reducer;
