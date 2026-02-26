import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface PhotoState {
  isReady: boolean;
}

const initialState: PhotoState = {
  isReady: false,
};

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = photoSlice.actions;

export default photoSlice.reducer;
