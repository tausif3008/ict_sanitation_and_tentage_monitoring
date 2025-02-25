import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../../Redux/action";
import axiosInstance from "../../../Axios/commonAxios";
import URLS from "../../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
};

export const VehicleReport = createSlice({
  name: "VehicleReport",
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

// get vehicle IMEI report data
export const getVehicleImeiReportData = (param) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.getVehicleReports?.path}`, {
      params: param,
    });
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get vehicle IMEI report data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess } = VehicleReport.actions;
export default VehicleReport.reducer;
