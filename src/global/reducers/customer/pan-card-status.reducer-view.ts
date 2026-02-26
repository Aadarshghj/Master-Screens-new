import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface panDetailsProps {
  isPanDetailsSubmit?: boolean;
}

const initialState: panDetailsProps = {
  isPanDetailsSubmit: false,
};

export const panDetailsSubmitViewSlice = createSlice({
  name: "panDetailsSubmitSlice",
  initialState,
  reducers: {
    setViewPandDetailSubmit: (
      state,
      action: PayloadAction<panDetailsProps>
    ) => {
      state.isPanDetailsSubmit = action.payload.isPanDetailsSubmit;
    },
    resetViewPanDetails: state => {
      state.isPanDetailsSubmit = false;
    },
  },
});

export const { setViewPandDetailSubmit, resetViewPanDetails } =
  panDetailsSubmitViewSlice.actions;

export default panDetailsSubmitViewSlice.reducer;
