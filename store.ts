import { configureStore } from "@reduxjs/toolkit";
import cartItemsSlice from "./slices/cartSlice";
import wishListReducer from "./slices/wishListSlice";

export const store = configureStore({
  reducer: {
    cart: cartItemsSlice,
    wishListCounter: wishListReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
