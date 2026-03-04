import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logger } from "@/global/service";

interface CustomerIdentityState {
  identity: string | null;
  customerCode: string | null;
  status: string | null;
  isInitialized: boolean;
}

const loadInitialState = (): CustomerIdentityState => {
  try {
    const saved = sessionStorage.getItem("customerIdentity");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        identity: parsed.identity || null,
        customerCode: parsed.customerCode || null,
        status: parsed.status || null,
        isInitialized: parsed.isInitialized || false,
      };
    }
  } catch (error) {
    logger.error(error);
  }

  return {
    identity: null,
    customerCode: null,
    status: null,
    isInitialized: false,
  };
};

const initialState: CustomerIdentityState = loadInitialState();

export const customerIdentityViewSlice = createSlice({
  name: "customerIdentityViewSlice",
  initialState,
  reducers: {
    setViewCustomerIdentity: (
      state,
      action: PayloadAction<{
        identity: string;
        customerCode: string;
        status: string;
      }>
    ) => {
      state.identity = action.payload.identity;
      state.customerCode = action.payload.customerCode;
      state.status = action.payload.status;
      state.isInitialized = true;

      try {
        sessionStorage.setItem(
          "customerIdentity",
          JSON.stringify({
            identity: action.payload.identity,
            customerCode: action.payload.customerCode,
            status: action.payload.status,
            isInitialized: true,
          })
        );
      } catch (error) {
        logger.error(error);
      }
    },
    clearViewCustomerIdentity: state => {
      state.identity = null;
      state.customerCode = null;
      state.status = null;
      state.isInitialized = false;

      try {
        sessionStorage.removeItem("customerIdentity");
      } catch (error) {
        logger.error(error);
      }
    },
    updateViewCustomerStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;

      try {
        const currentData = {
          identity: state.identity,
          customerCode: state.customerCode,
          status: action.payload,
          isInitialized: state.isInitialized,
        };
        sessionStorage.setItem("customerIdentity", JSON.stringify(currentData));
      } catch (error) {
        logger.error(error);
      }
    },
  },
});

export const {
  setViewCustomerIdentity,
  clearViewCustomerIdentity,
  updateViewCustomerStatus,
} = customerIdentityViewSlice.actions;
