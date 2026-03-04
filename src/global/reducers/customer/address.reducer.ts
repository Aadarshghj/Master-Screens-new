import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AddressState {
  isReady: boolean;
}

const initialState: AddressState = {
  isReady: false,
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = addressSlice.actions;

export default addressSlice.reducer;
