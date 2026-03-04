import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FormForwardState {
  forward: boolean;
}

const initialState: FormForwardState = {
  forward: false,
};

export const formForwardSlice = createSlice({
  name: "formForward",
  initialState,
  reducers: {
    setForward: (state, action: PayloadAction<boolean>) => {
      state.forward = action.payload;
    },
    resetForward: state => {
      state.forward = false;
    },
  },
});

export const { setForward, resetForward } = formForwardSlice.actions;

export default formForwardSlice.reducer;
