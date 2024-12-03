import { createSlice } from "@reduxjs/toolkit";
import URLS from "../../urils/URLS";
import axiosInstance from "../../Axios/commonAxios";
import { revertAll } from "../../Redux/action";
import { message } from "antd";

const initialState = {
  loading: false,
  name: null,
  dash_data: null,
};

export const tentageSlice = createSlice({
  name: "tentageSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get tentage dashboard data
export const getTentageDashboardData = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${URLS?.tentageDash?.path}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(postSuccess(res?.data));
  } catch (error) {
    message.error("Error fetching details.");
    console.error("In get tentage dashboard data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess } = tentageSlice.actions;
export default tentageSlice.reducer;
