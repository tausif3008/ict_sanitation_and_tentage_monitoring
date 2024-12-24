// slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
};

const questionSlice = createSlice({
  name: "questionSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
  },
});

// get question
export const getQuestionList = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.questions?.path}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get question error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess } = questionSlice.actions;
export default questionSlice.reducer;
