import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface prefillProps {
  isPrefilled: null | boolean;
}

const initialState: prefillProps = {
  isPrefilled: null,
};

export const PrefillSlice = createSlice({
  name: "PrefillViewSlice",
  initialState,
  reducers: {
    setPrefillState: (state, action: PayloadAction<prefillProps>) => {
      state.isPrefilled = action.payload.isPrefilled;
    },
  },
});

export const { setPrefillState } = PrefillSlice.actions;

export default PrefillSlice.reducer;
