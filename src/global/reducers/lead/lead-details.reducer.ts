import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LeadDetailsState {
  isReady: boolean;
  isEditMode: boolean;
  currentLeadId: string | null;
}

const initialState: LeadDetailsState = {
  isReady: false,
  isEditMode: false,
  currentLeadId: null,
};

export const leadDetailsSlice = createSlice({
  name: "leadDetails",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setEditMode: (
      state,
      action: PayloadAction<{ isEdit: boolean; leadId: string | null }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentLeadId = action.payload.leadId;
    },
    resetLeadState: state => {
      state.isEditMode = false;
      state.currentLeadId = null;
      state.isReady = false;
    },
  },
});

export const { setIsReady, setEditMode, resetLeadState } =
  leadDetailsSlice.actions;

export default leadDetailsSlice.reducer;
