import { RootState } from "@/store";
import { createSlice } from "@reduxjs/toolkit";

const storedUsersJson =
  typeof window !== "undefined" ? localStorage.getItem("usersLength") : null;

interface ChatSliceState {
  users: number[];
}

const initialState: ChatSliceState = {
  users: storedUsersJson ? JSON.parse(storedUsersJson) : [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUser: (state) => {
      state.users.push(1);
      localStorage.setItem("usersLength", JSON.stringify(state.users));
    },
    deleteAllUsers: (state) => {
      state.users = [];
      localStorage.removeItem("usersLength");
    },
  },
});

export const { addUser, deleteAllUsers } = chatSlice.actions;

export const usersValue = (state: RootState) => state.chat.users;

export default chatSlice.reducer;
