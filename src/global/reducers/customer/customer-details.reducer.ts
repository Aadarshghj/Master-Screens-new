import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CustomerData {
  customerFirstName: string | null;
  customerMiddleName: string | null;
  customerLastName: string | null;
  mobileNumber: string | null;
}

const initialState: CustomerData = {
  customerFirstName: null,
  customerMiddleName: null,
  customerLastName: null,
  mobileNumber: null,
};

export const customerDataSlice = createSlice({
  name: "customerData",
  initialState,
  reducers: {
    setCustomerData: (state, action: PayloadAction<CustomerData>) => {
      state.customerFirstName = action.payload.customerFirstName;
      state.customerMiddleName = action.payload.customerMiddleName;
      state.customerLastName = action.payload.customerLastName;
      state.mobileNumber = action.payload.mobileNumber;
    },
    resetCustomerData: state => {
      state.customerFirstName = null;
      state.customerMiddleName = null;
      state.customerLastName = null;
      state.mobileNumber = null;
    },
  },
});

export const { setCustomerData, resetCustomerData } = customerDataSlice.actions;

export default customerDataSlice.reducer;
