import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = { username: string } | null;

type AuthState = { user: AuthUser };

const initialState: AuthState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
  setUser(state: AuthState, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  clearUser(state: AuthState) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
