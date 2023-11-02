import { createSlice } from "@reduxjs/toolkit";
import { CommonGet } from "../Service/services";
import jwt_decode from "jwt-decode";

const initialState = {
  userDetails: {},
  email:""
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserDetails: (state, action) => {
      state.userDetails = action.payload;
      localStorage.setItem("UserName", action.payload.userName);
    },
    setUserDetails: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { getUserDetails,setUserDetails } = userSlice.actions;
export const userView = () => async (dispatch) => {
  const accessToken = localStorage.getItem("accessToken");
  let decodedToken = jwt_decode(accessToken);
  const response = await CommonGet(`/user/${decodedToken.id}`);
  if (response?.data?.result) {
    dispatch(getUserDetails(response.data.result));
  }
};

export default userSlice.reducer;
