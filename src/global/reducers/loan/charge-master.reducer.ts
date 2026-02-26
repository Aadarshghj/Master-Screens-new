import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ChargeMasterState {
  isReady: boolean;
  isEditMode: boolean;
  currentChargeId: string | null;
  activeTab:
    | "charge-details"
    | "calculation-logic"
    | "state-config"
    | "tax-config";
}

const initialState: ChargeMasterState = {
  isReady: false,
  isEditMode: false,
  currentChargeId: null,
  activeTab: "charge-details",
};

export const chargeMasterSlice = createSlice({
  name: "chargeMaster",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
    setEditMode: (
      state,
      action: PayloadAction<{ isEdit: boolean; chargeId: string | null }>
    ) => {
      state.isEditMode = action.payload.isEdit;
      state.currentChargeId = action.payload.chargeId;
    },
    setActiveTab: (
      state,
      action: PayloadAction<
        "charge-details" | "calculation-logic" | "state-config" | "tax-config"
      >
    ) => {
      state.activeTab = action.payload;
    },
    resetChargeMasterState: state => {
      state.isEditMode = false;
      state.currentChargeId = null;
      state.isReady = false;
      state.activeTab = "charge-details";
    },
  },
});

export const { setIsReady, setEditMode, setActiveTab, resetChargeMasterState } =
  chargeMasterSlice.actions;

export default chargeMasterSlice.reducer;
