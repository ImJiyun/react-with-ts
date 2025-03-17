## Redux with TypeScript

### Redux Setup

`npm install @reduxjs/toolkit react-redux`

### Define slice

- a slice is a feature provided by Redux Toolkit that encapsulates a piece of `state`, along with its related `actions` and `reducers`, into a single module.
  - `Action` : a plain JavaScript object that represents an event or a change that should happen in the application state. It must have a `type` field which describes what kind of change is happening. It also can have `payload` (an additional data)
  - `Reducer` : a pure function that determines how the state should change based on the received action. It accepts two argument (`state` and `action`)

```ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<{ id: string; title: string; price: number }>
    ) {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (itemIndex >= 0) {
        state.items[itemIndex].quantity++; // we can mutate the state (It's RTK)
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload
      );

      if (state.items[itemIndex].quantity === 1) {
        state.items.splice(itemIndex, 1);
      } else {
        state.items[itemIndex].quantity--;
      }
    },
  },
});
```

### Store

- `store` is a combination of multiple state `slices`, where each slice manages a specific part of the application's state.

```ts
import { configureStore } from "@reduxjs/toolkit";
import { cartSlice } from "./cart-slice";

// overall store = combination of multiplel state slices
export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
}); // creates a redux store
```

```ts
import Header from "./components/Header.tsx";
import Shop from "./components/Shop.tsx";
import Product from "./components/Product.tsx";
import { DUMMY_PRODUCTS } from "./dummy-products.ts";
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <>
      <Provider store={store}>
        <Header />
        <Shop>
          {DUMMY_PRODUCTS.map((product) => (
            <li key={product.id}>
              <Product {...product} />
            </li>
          ))}
        </Shop>
      </Provider>
    </>
  );
}

export default App;

```
