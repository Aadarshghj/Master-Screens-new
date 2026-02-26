import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoanBusinessRuleState {
  isReady: boolean;
  isEditMode: boolean;
  currentRuleId: string | null;
}

const initialState: LoanBusinessRuleState = {
  isReady: false,
  isEditMode: false,
  currentRuleId: null,
};

export const loanBusinessRulesSlice = createSlice({
  name: "loanBusinessRules",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setEditMode: (
      state,
      action: PayloadAction<{ isEdit: boolean; ruleId: string | null }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentRuleId = action.payload.ruleId;
    },
    resetBusinessRuleState: state => {
      state.isEditMode = false;
      state.currentRuleId = null;
      state.isReady = false;
    },
  },
});

export const { setIsReady, setEditMode, resetBusinessRuleState } =
  loanBusinessRulesSlice.actions;

export default loanBusinessRulesSlice.reducer;
