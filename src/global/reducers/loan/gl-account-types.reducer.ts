import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface GLAccountTypeState {
  isReady: boolean;
  isEditMode: boolean;
  currentGLAccountTypeId: string | null;
}

const initialState: GLAccountTypeState = {
  isReady: false,
  isEditMode: false,
  currentGLAccountTypeId: null,
};

export const glAccountTypesSlice = createSlice({
  name: "glAccountTypes",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setEditMode: (
      state,
      action: PayloadAction<{ isEdit: boolean; glAccountTypeId: string | null }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentGLAccountTypeId = action.payload.glAccountTypeId;
    },
    resetGLAccountTypeState: state => {
      state.isEditMode = false;
      state.currentGLAccountTypeId = null;
      state.isReady = false;
    },
  },
});

export const { setIsReady, setEditMode, resetGLAccountTypeState } =
  glAccountTypesSlice.actions;

export default glAccountTypesSlice.reducer;
