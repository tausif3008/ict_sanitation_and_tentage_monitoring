import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../Redux/action";
import axiosInstance from "../Axios/commonAxios";

const initialState = {
  monitoringUpdateEl: null,
  assetInfo: null,
  isUpdated: false,
  loading: false,
  name: null,
};

export const monitoringSlice = createSlice({
  name: "monitoringSlice",
  initialState,
  reducers: {
    setUpdateMonitoringEl: (state, action) => {
      state.monitoringUpdateEl = action.payload.updateElement;
    },
    setAssetInfo: (state, action) => {
      state.assetInfo = action.payload;
    },
    setMonitoringListIsUpdated: (state, action) => {
      state.isUpdated = action.payload.isUpdated;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postAgent: (state, action) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
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

export const {
  setUpdateMonitoringEl,
  setMonitoringListIsUpdated,
  setAssetInfo,
  setLoading,
  postAgent,
} = monitoringSlice.actions;
export default monitoringSlice.reducer;
