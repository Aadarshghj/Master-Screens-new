import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface approvalViewState {
  showApprovalView: boolean;
}

const initialState: approvalViewState = {
  showApprovalView: false,
};

export const approvalViewModalSlice = createSlice({
  name: "approvalViewModalSlice",
  initialState,
  reducers: {
    setShowApprovalView: (state, action: PayloadAction<boolean>) => {
      state.showApprovalView = action.payload;
    },
    resetApprovalView: state => {
      state.showApprovalView = false;
    },
  },
});

export const { setShowApprovalView, resetApprovalView } =
  approvalViewModalSlice.actions;

export default approvalViewModalSlice.reducer;
