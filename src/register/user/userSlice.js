// slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  userUpdateEl: null,
  isUpdated: false,
  loading: false,
  nameList: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState: initialState,
  reducers: {
    setUpdateUserEl: (state, action) => {
      state.userUpdateEl = action.payload.updateElement;
    },
    setUserListIsUpdated: (state, action) => {
      state.isUpdated = action.payload.isUpdated;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.nameList = action.payload;
    },
  },
});

// get users list
export const getUsersList = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.users?.path}`);
    // URLS?.users?.path
    // this is not correct api
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get users list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const {
  setUpdateUserEl,
  setUserListIsUpdated,
  setLoading,
  postSuccess,
} = userSlice.actions;
export default userSlice.reducer;
