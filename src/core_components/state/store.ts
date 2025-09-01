import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

export function makeStore(preloadedState?: unknown) {
  return configureStore({
    reducer: {
      auth: authReducer,
  cart: cartReducer,
    },
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
