import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface WarningProps {
  disableNext: boolean;
  disableReason: string | null;
  title?: string | null;
}

const initialState: WarningProps = {
  disableNext: false,
  disableReason: null,
  title: null,
};

export const formUnsavedWarningSlice = createSlice({
  name: "formUnsavedWarningSlice",
  initialState,
  reducers: {
    setFormWarningState: (state, action: PayloadAction<WarningProps>) => {
      state.disableNext = action.payload.disableNext;
      state.disableReason = action.payload.disableReason;
      state.title = action.payload.title;
    },
    resetFormWarningState: state => {
      state.disableNext = false;
      state.disableReason = null;
      state.title = null;
    },
  },
});

export const { setFormWarningState, resetFormWarningState } =
  formUnsavedWarningSlice.actions;

export default formUnsavedWarningSlice.reducer;
