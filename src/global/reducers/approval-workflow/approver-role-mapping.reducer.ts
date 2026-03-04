import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ApproverRoleMappingState {
  isReady: boolean;
  isEditMode: boolean;
  currentMappingId: string | null;
}

const initialState: ApproverRoleMappingState = {
  isReady: false,
  isEditMode: false,
  currentMappingId: null,
};

export const approverRoleMappingSlice = createSlice({
  name: "approverRoleMapping",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setEditMode: (
      state,
      action: PayloadAction<{ isEdit: boolean; mappingId: string | null }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentMappingId = action.payload.mappingId;
    },
    resetApproverRoleMappingState: state => {
      state.isEditMode = false;
      state.currentMappingId = null;
      state.isReady = false;
    },
  },
});

export const { setIsReady, setEditMode, resetApproverRoleMappingState } =
  approverRoleMappingSlice.actions;

export default approverRoleMappingSlice.reducer;
