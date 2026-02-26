import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FirmOnboardingState {
  customerId: string | null;
  firmId: string | null;
  firmStatus?: string | null;
  currentStep: number;
  completedSteps: number[];
  isCurrentStepSaved: boolean;
  lastSavedStep: number | null;
  disableNext: boolean;
  disableReason: string | null;
  title: string | null;
  currentPath: string | null;
}

const initialState: FirmOnboardingState = {
  customerId: null,
  firmId: null,
  currentStep: 0,
  completedSteps: [],
  isCurrentStepSaved: false,
  lastSavedStep: null,
  disableNext: false,
  disableReason: null,
  title: null,
  currentPath: null,
};

const firmOnboardingSlice = createSlice({
  name: "firmOnboarding",
  initialState,
  reducers: {
    setCustomerId: (state, action: PayloadAction<string>) => {
      state.customerId = action.payload;
    },
    setFirmId: (state, action: PayloadAction<string>) => {
      state.firmId = action.payload;
    },
    setFirmStatus: (state, action: PayloadAction<string | null>) => {
      state.firmStatus = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      state.isCurrentStepSaved = false;
    },
    setFirmOnboardState: (
      state,
      action: PayloadAction<Partial<FirmOnboardingState>>
    ) => {
      state.disableNext = action.payload.disableNext ?? false;
      state.disableReason = action.payload.disableReason ?? null;
      state.title = action.payload.title ?? null;
      state.currentPath = action.payload.currentPath ?? null;
    },
    markStepCompleted: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    setCurrentStepSaved: (state, action: PayloadAction<boolean>) => {
      state.isCurrentStepSaved = action.payload;
      if (action.payload) {
        state.lastSavedStep = state.currentStep;
      }
    },
    resetOnboarding: state => {
      state.customerId = null;
      state.firmId = null;
      state.firmStatus = null;
      state.currentStep = 0;
      state.completedSteps = [];
      state.isCurrentStepSaved = false;
      state.lastSavedStep = null;
      state.disableNext = false;
      state.disableReason = null;
      state.currentPath = null;
      state.title = null;
    },
  },
});

export const {
  setCustomerId,
  setFirmId,
  setFirmStatus,
  setCurrentStep,
  markStepCompleted,
  setCurrentStepSaved,
  resetOnboarding,
  setFirmOnboardState,
} = firmOnboardingSlice.actions;

export default firmOnboardingSlice.reducer;
