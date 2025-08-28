import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface WishListCounterSlice {
  wishListAmount: number;
}

const storedAmount =
  typeof window !== "undefined"
    ? Number(localStorage.getItem("wishListAmount")) || 0
    : 0;

const initialState: WishListCounterSlice = {
  wishListAmount: storedAmount,
};

export const wishListSlice = createSlice({
  name: "wishListCounter",
  initialState,
  reducers: {
    wishListIncrement: (state) => {
      state.wishListAmount += 1;
    },
    wishListDecrement: (state) => {
      state.wishListAmount -= 1;
    },
    resetWishListAmount: (state, action) => {
      state.wishListAmount = action.payload;
    },
  },
});

export const { wishListIncrement, wishListDecrement, resetWishListAmount } =
  wishListSlice.actions;

export const wishListValue = (state: RootState) =>
  state.wishListCounter.wishListAmount;

export default wishListSlice.reducer;
