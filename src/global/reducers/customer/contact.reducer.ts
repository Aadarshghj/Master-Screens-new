import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  ContactType,
  ContactFormData,
} from "@/types/customer/contact.types";

interface ContactState {
  isReady: boolean;
  addedContacts: Partial<Record<ContactType, ContactFormData>>;
}

const initialState: ContactState = {
  isReady: false,
  addedContacts: {},
};

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setIsReady: (state, action: PayloadAction<boolean>) => {
      state.isReady = action.payload;
    },
  },
});

export const { setIsReady } = contactSlice.actions;

export default contactSlice.reducer;
