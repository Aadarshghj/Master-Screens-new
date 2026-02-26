import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DisableProps {
  disableNext: boolean;
  disableReason: string | null;
  title?: string | null;
}

const initialState: DisableProps = {
  disableNext: false,
  disableReason: null,
  title: null,
};

export const FormDirtyViewSlice = createSlice({
  name: "FormDirtyViewSlice",
  initialState,
  reducers: {
    setFormDirtyViewState: (state, action: PayloadAction<DisableProps>) => {
      state.disableNext = action.payload.disableNext;
      state.disableReason = action.payload.disableReason;
      state.title = action.payload.title;
    },
    resetFormDirtyViewState: state => {
      state.disableNext = false;
      state.disableReason = null;
      state.title = null;
    },
  },
});

export const { setFormDirtyViewState, resetFormDirtyViewState } =
  FormDirtyViewSlice.actions;

export default FormDirtyViewSlice.reducer;
