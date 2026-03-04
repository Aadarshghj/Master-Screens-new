import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface BankAccountState {
  isReady: boolean;
}

const initialState: BankAccountState = {
  isReady: false,
};

export const bankAccountSlice = createSlice({
  name: "bankAccount",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = bankAccountSlice.actions;

export default bankAccountSlice.reducer;
