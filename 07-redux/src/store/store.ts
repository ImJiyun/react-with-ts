import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./cart-slice";

// overall store = combination of multiplel state slices
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
}); // creates a redux store

// const name = "Max";

// type N = typeof name;

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
