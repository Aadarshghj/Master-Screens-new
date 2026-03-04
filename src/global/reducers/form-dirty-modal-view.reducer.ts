import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FormDirtyState {
  showFormDirtyModal: boolean;
}

const initialState: FormDirtyState = {
  showFormDirtyModal: false,
};

export const formDirtyViewModalSlice = createSlice({
  name: "formDirtyViewModal",
  initialState,
  reducers: {
    setShowFormDirtyViewModal: (state, action: PayloadAction<boolean>) => {
      state.showFormDirtyModal = action.payload;
    },
    resetFormDirtyViewModal: state => {
      state.showFormDirtyModal = false;
    },
  },
});

export const { setShowFormDirtyViewModal, resetFormDirtyViewModal } =
  formDirtyViewModalSlice.actions;

export default formDirtyViewModalSlice.reducer;
