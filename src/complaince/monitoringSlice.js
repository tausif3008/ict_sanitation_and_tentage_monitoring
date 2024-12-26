import { createSlice } from "@reduxjs/toolkit";
import { revertAll, revertMonitoringSlice } from "../Redux/action";
import axiosInstance from "../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
  daily_report: null,
};

export const monitoringSlice = createSlice({
  name: "monitoringSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postAgent: (state, action) => {
      state.name = action.payload;
    },
    PostDailyReport: (state, action) => {
      state.daily_report = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
    builder.addCase(revertMonitoringSlice, () => initialState);
  },
});

// get monitoring agent list
export const getMonitoringAgent = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postAgent(res?.data));
  } catch (error) {
    console.error("In get monitoring agent list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get monitoring daily Report
export const getMonitoringDailyReport = (url, param) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`, { params: param });
    dispatch(PostDailyReport(res?.data));
  } catch (error) {
    console.error("In get monitoring daily Report error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postAgent, PostDailyReport } =
  monitoringSlice.actions;
export default monitoringSlice.reducer;
