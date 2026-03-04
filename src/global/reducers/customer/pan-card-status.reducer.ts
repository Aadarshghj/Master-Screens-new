import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface panDetailsProps {
  isPanDetailsSubmit?: boolean;
}

const initialState: panDetailsProps = {
  isPanDetailsSubmit: false,
};

export const panDetailsSubmitSlice = createSlice({
  name: "panDetailsSubmitSlice",
  initialState,
  reducers: {
    setPandDetailSubmit: (state, action: PayloadAction<panDetailsProps>) => {
      state.isPanDetailsSubmit = action.payload.isPanDetailsSubmit;
    },
    resetPanDetails: state => {
      state.isPanDetailsSubmit = false;
    },
  },
});

export const { setPandDetailSubmit, resetPanDetails } =
  panDetailsSubmitSlice.actions;

export default panDetailsSubmitSlice.reducer;
