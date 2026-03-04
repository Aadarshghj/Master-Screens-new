import type {
  LoanSchemePropertyData,
  LoanSchemePropertyState,
} from "@/types/loan-product-and-scheme-masters/loan-scheme-properties.types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState: LoanSchemePropertyState = {
  isReady: false,
  isEditMode: false,
  currentPropertyId: null,
  currentPropertyData: null,
};

export const loanSchemePropertiesSlice = createSlice({
  name: "loanSchemeProperties",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setEditMode: (
      state,
      action: PayloadAction<{
        isEdit: boolean;
        propertyId: string | null;
        propertyData: LoanSchemePropertyData;
      }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentPropertyId = action.payload.propertyId;
      state.currentPropertyData = action.payload.propertyData;
    },
    resetSchemePropertyState: state => {
      state.isEditMode = false;
      state.currentPropertyId = null;
      state.currentPropertyData = null;
      state.isReady = false;
    },
  },
});

export const { setIsReady, setEditMode, resetSchemePropertyState } =
  loanSchemePropertiesSlice.actions;

export default loanSchemePropertiesSlice.reducer;
