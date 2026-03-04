import type { User } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authApiService } from "../service";

type AuthState = {
  user: User | null | undefined;
  token: string | null;
  demoValue: string;
};

const initialState: AuthState = { user: undefined, token: null, demoValue: "" };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSampleState: (
      state,
      { payload: { val } }: PayloadAction<{ val: string }>
    ) => {
      state.demoValue = val;
    },
  },

  extraReducers: builder => {
    builder.addMatcher(
      authApiService.endpoints.login.matchFulfilled,
      (state, { payload }: PayloadAction<{ user: User; token: string }>) => {
        state.token = payload.token;
        state.user = payload.user;
      }
    );
  },
});

export const { setSampleState } = authSlice.actions;
