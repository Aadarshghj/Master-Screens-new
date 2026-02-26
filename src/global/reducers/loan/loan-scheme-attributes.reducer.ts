import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoanSchemeAttributeState {
  isReady: boolean;
  isEditMode: boolean;
  currentAttributeId: string | null;
}

const initialState: LoanSchemeAttributeState = {
  isReady: false,
  isEditMode: false,
  currentAttributeId: null,
};

export const loanSchemeAttributesSlice = createSlice({
  name: "loanSchemeAttributes",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setEditMode: (
      state,
      action: PayloadAction<{ isEdit: boolean; attributeId: string | null }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentAttributeId = action.payload.attributeId;
    },
    resetSchemeAttributeState: state => {
      state.isEditMode = false;
      state.currentAttributeId = null;
      state.isReady = false;
    },
  },
});

export const { setIsReady, setEditMode, resetSchemeAttributeState } =
  loanSchemeAttributesSlice.actions;

export default loanSchemeAttributesSlice.reducer;
