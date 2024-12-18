// slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import URLS from "../../urils/URLS";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  loading: false,
  token_data: null,
};

const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postToken: (state, action) => {
      state.token_data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// store token
export const storeToken = (data) => async (dispatch) => {
  dispatch(postToken(data));
};

// log out
export const logOutUser = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.delete(`${URLS.out.path}`);
    return res
  } catch (error) {
    console.error("In log out error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { postToken, setLoading } = loginSlice.actions;
export default loginSlice.reducer;
