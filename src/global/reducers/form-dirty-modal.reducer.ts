import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FormDirtyState {
  showFormDirtyModal: boolean;
}

const initialState: FormDirtyState = {
  showFormDirtyModal: false,
};

export const formDirtyModalSlice = createSlice({
  name: "formDirtyModal",
  initialState,
  reducers: {
    setShowFormDirtyModal: (state, action: PayloadAction<boolean>) => {
      state.showFormDirtyModal = action.payload;
    },
    resetFormDirtyModal: state => {
      state.showFormDirtyModal = false;
    },
  },
});

export const { setShowFormDirtyModal, resetFormDirtyModal } =
  formDirtyModalSlice.actions;

export default formDirtyModalSlice.reducer;
