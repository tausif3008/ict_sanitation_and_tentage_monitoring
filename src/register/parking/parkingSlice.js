import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
};

export const parkingSlice = createSlice({
  name: "parkingSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postReport: (state, action) => {
      state.report_data = action.payload;
    },
    postParkingType: (state, action) => {
      state.parking_type = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get parking data
export const getParkingData =
  (url, param = null) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(`${url}`, {
        params: param,
      });
      dispatch(postSuccess(res?.data));
    } catch (error) {
      console.error("In get parking data error", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

// add parking data
export const addParkingData = (url, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res?.data;
  } catch (error) {
    console.error("In add parking data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get Parking reports
export const getParkingReports = (data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${URLS?.parkingReport?.path}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(postReport(res?.data));
  } catch (error) {
    console.error("In get Parking reports error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get parking-type wise registration report data
export const getParkingTypeRegData =
  (data = null) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.post(
        `${URLS?.parking_type_wise_reg_report?.path}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(postParkingType(res?.data));
    } catch (error) {
      console.error(
        "In get parking-type wise registration report data error",
        error
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const { setLoading, postSuccess, postReport, postParkingType } =
  parkingSlice.actions;
export default parkingSlice.reducer;
