import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "./root-reducer";
import { apiInstance } from "../service";
import { ENV } from "@/config";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["firmOnboarding", "loanProduct"], // Persist firmOnboarding and loanProduct state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiInstance.middleware),
  devTools: ENV.DEV && true,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
