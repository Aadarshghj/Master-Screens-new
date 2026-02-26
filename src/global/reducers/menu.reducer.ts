import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface MenuState {
  isOpen: boolean;
  userRating: number;
}

const initialState: MenuState = {
  isOpen: false,
  userRating: 4,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    toggleMenu: state => {
      state.isOpen = !state.isOpen;
    },
    closeMenu: state => {
      state.isOpen = false;
    },
    setUserRating: (state, action: PayloadAction<number>) => {
      state.userRating = action.payload;
    },
  },
});

export const { toggleMenu, closeMenu, setUserRating } = menuSlice.actions;
