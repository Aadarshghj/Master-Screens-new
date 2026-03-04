import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FormWarningState {
  showFormWarningModal: boolean;
}

const initialState: FormWarningState = {
  showFormWarningModal: false,
};

export const viewFormWarningModalSlice = createSlice({
  name: "viewFormWarningModal",
  initialState,
  reducers: {
    setShowViewFormWarningModal: (state, action: PayloadAction<boolean>) => {
      state.showFormWarningModal = action.payload;
    },
    resetViewFormWarningModal: state => {
      state.showFormWarningModal = false;
    },
  },
});

export const { resetViewFormWarningModal, setShowViewFormWarningModal } =
  viewFormWarningModalSlice.actions;

export default viewFormWarningModalSlice.reducer;
