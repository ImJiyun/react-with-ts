import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./cart-slice";

// overall store = combination of multiplel state slices
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
}); // creates a redux store
