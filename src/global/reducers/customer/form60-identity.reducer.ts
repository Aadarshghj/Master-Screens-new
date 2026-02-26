import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logger } from "@/global/service";

interface Form60IdentityState {
  form60Id: string | null;
  customerId: string | null;
  status: string | null;
  isInitialized: boolean;
}

const loadInitialState = (): Form60IdentityState => {
  try {
    const saved = sessionStorage.getItem("form60Identity");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        form60Id: parsed.form60Id || null,
        customerId: parsed.customerId || null,
        status: parsed.status || null,
        isInitialized: parsed.isInitialized || false,
      };
    }
  } catch (error) {
    logger.error(error);
  }

  return {
    form60Id: null,
    customerId: null,
    status: null,
    isInitialized: false,
  };
};

const initialState: Form60IdentityState = loadInitialState();

export const form60IdentitySlice = createSlice({
  name: "form60Identity",
  initialState,
  reducers: {
    setForm60Identity: (
      state,
      action: PayloadAction<{
        form60Id: string;
        customerId: string;
        status: string;
      }>
    ) => {
      state.form60Id = action.payload.form60Id;
      state.customerId = action.payload.customerId;
      state.status = action.payload.status;
      state.isInitialized = true;

      try {
        sessionStorage.setItem(
          "form60Identity",
          JSON.stringify({
            form60Id: action.payload.form60Id,
            customerId: action.payload.customerId,
            status: action.payload.status,
            isInitialized: true,
          })
        );
      } catch (error) {
        logger.error(error);
      }
    },
    clearForm60Identity: state => {
      state.form60Id = null;
      state.customerId = null;
      state.status = null;
      state.isInitialized = false;

      try {
        sessionStorage.removeItem("form60Identity");
      } catch (error) {
        logger.error(error);
      }
    },
    updateForm60Status: (state, action: PayloadAction<string>) => {
      state.status = action.payload;

      try {
        const currentData = {
          form60Id: state.form60Id,
          customerId: state.customerId,
          status: action.payload,
          isInitialized: state.isInitialized,
        };
        sessionStorage.setItem("form60Identity", JSON.stringify(currentData));
      } catch (error) {
        logger.error(error);
      }
    },
  },
});

export const { setForm60Identity, clearForm60Identity, updateForm60Status } =
  form60IdentitySlice.actions;

export default form60IdentitySlice.reducer;
