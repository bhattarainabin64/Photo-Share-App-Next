import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie"; 

const initialState = {
  token: Cookies.get("token") || null, 
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      Cookies.set("token", action.payload.token, { expires: 7, secure: true, path: "/" }); 
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
