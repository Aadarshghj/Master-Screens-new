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

export const formDirtySlice = createSlice({
  name: "formDirtySlice",
  initialState,
  reducers: {
    setFormDirtyState: (state, action: PayloadAction<DisableProps>) => {
      state.disableNext = action.payload.disableNext;
      state.disableReason = action.payload.disableReason;
      state.title = action.payload.title;
    },
    resetFormDirtyState: state => {
      state.disableNext = false;
      state.disableReason = null;
      state.title = null;
    },
  },
});

export const { setFormDirtyState, resetFormDirtyState } =
  formDirtySlice.actions;

export default formDirtySlice.reducer;
