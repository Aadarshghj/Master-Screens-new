import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FormWarningState {
  showFormWarningModal: boolean;
}

const initialState: FormWarningState = {
  showFormWarningModal: false,
};

export const formWarningModalSlice = createSlice({
  name: "formWarningModal",
  initialState,
  reducers: {
    setShowFormWarningModal: (state, action: PayloadAction<boolean>) => {
      state.showFormWarningModal = action.payload;
    },
    resetFormWarningModal: state => {
      state.showFormWarningModal = false;
    },
  },
});

export const { setShowFormWarningModal, resetFormWarningModal } =
  formWarningModalSlice.actions;

export default formWarningModalSlice.reducer;
