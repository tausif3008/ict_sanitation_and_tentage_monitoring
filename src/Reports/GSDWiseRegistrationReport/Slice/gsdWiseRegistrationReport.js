import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../../Redux/action";
import axiosInstance from "../../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
  vendor_data: null,
};

export const GsdWiseRegistrationReport = createSlice({
  name: "GsdWiseRegistrationReport",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postVendor: (state, action) => {
      state.vendor_data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get gsd wise registration report data
export const getGSDReportData = (url, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get gsd wise registration report data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get vendor wise registration report data
export const getVendorReportData = (url, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(postVendor(res?.data));
  } catch (error) {
    console.error("In get vendor wise registration report data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postVendor } =
  GsdWiseRegistrationReport.actions;
export default GsdWiseRegistrationReport.reducer;
