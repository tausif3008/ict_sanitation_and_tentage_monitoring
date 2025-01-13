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

// get vehicle report data
export const getVehicleReportData = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(
    //   `${URLS?.getGsdMonitoringData?.path}`,
    //   data,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    );
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get vehicle report data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess } = VehicleReport.actions;
export default VehicleReport.reducer;
