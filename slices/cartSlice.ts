import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../libs/types/search";
import { RootState } from "../store";

// Read from localStorage safely (only in browser)
const storedCartJson =
  typeof window !== "undefined" ? localStorage.getItem("cartData") : null;

// Define a type for the slice state
interface CartSliceState {
  items: CartItem[];
}

// Initial state with a descriptive property
const initialState: CartSliceState = {
  items: storedCartJson ? JSON.parse(storedCartJson) : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      console.log("actionPayload", action.payload);
      const existing = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existing) {
        existing.quantity = (existing.quantity ?? 1) + 1;
      } else {
        state.items.push({ ...action.payload });
      }
      localStorage.setItem("cartData", JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item._id === action.payload._id
      );
      if (existing) {
        if ((existing.quantity ?? 1) === 1) {
          state.items = state.items.filter(
            (item) => item._id !== action.payload._id
          );
        } else {
          existing.quantity = (existing.quantity ?? 1) - 1;
        }
      }
      localStorage.setItem("cartData", JSON.stringify(state.items));
    },
    deleteItem: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartData", JSON.stringify(state.items));
    },
    deleteAll: (state) => {
      state.items = [];
      localStorage.removeItem("cartData");
    },
  },
});

export const { addItem, removeItem, deleteItem, deleteAll } = cartSlice.actions;
export const cartItemsValue = (state: RootState) => state.cart.items;

export default cartSlice.reducer;

// export const selctValue = (state: RootState) => state.counter.value;
