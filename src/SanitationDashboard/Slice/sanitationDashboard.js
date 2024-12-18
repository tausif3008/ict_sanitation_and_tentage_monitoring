import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";
import { message } from "antd";

const initialState = {
  loading: false,
  name: null,
  dash_data: null,
};

export const sanitationDashboard = createSlice({
  name: "sanitationDashboard",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postDash: (state, action) => {
      state.dash_data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get sanitation dashboard data
export const getSanitationDashData = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(
      `${URLS?.sanitationDash?.path}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(postSuccess(res?.data));
  } catch (error) {
    message.error("Something went wrong");
    console.error("In get sanitation dashboard data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get dashboard data
export const getDashboardData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${URLS?.dashboardApi?.path}`);
    dispatch(postDash(res?.data));
  } catch (error) {
    message.error("Something went wrong");
    console.error("In get dashboard data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postDash } =
  sanitationDashboard.actions;
export default sanitationDashboard.reducer;
