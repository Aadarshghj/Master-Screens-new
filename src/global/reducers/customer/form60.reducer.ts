import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Form60State {
  isReady: boolean;
}

const initialState: Form60State = {
  isReady: false,
};

export const form60Slice = createSlice({
  name: "form60",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = form60Slice.actions;

export default form60Slice.reducer;
