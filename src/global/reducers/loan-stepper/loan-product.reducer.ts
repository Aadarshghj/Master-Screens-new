import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoanProductState {
  isReady: boolean;
  isEditMode: boolean;
  currentSchemeId: string | null;
  currentSchemeName: string | null;
  interestTypeFlag: string | null;
  approvalStatus: string | null;
}

const initialState: LoanProductState = {
  isReady: false,
  isEditMode: false,
  currentSchemeId: null,
  currentSchemeName: null,
  interestTypeFlag: null,
  approvalStatus: null,
};

export const loanProductSlice = createSlice({
  name: "loanProduct",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setEditMode: (
      state,
      action: PayloadAction<{
        isEdit: boolean;
        schemeId: string | null;
        schemeName?: string | null;
      }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentSchemeId = action.payload.schemeId;
      if (action.payload.schemeName !== undefined) {
        state.currentSchemeName = action.payload.schemeName;
      }
    },
    setInterestTypeFlag: (state, action: PayloadAction<string | null>) => {
      state.interestTypeFlag = action.payload;
    },
    setApprovalStatus: (state, action: PayloadAction<string | null>) => {
      state.approvalStatus = action.payload;
    },
    resetLoanProductState: state => {
      state.isEditMode = false;
      state.currentSchemeId = null;
      state.currentSchemeName = null;
      state.isReady = false;
      state.interestTypeFlag = null;
      state.approvalStatus = null;
    },
  },
});

export const {
  setIsReady,
  setEditMode,
  resetLoanProductState,
  setInterestTypeFlag,
  setApprovalStatus,
} = loanProductSlice.actions;

export default loanProductSlice.reducer;
