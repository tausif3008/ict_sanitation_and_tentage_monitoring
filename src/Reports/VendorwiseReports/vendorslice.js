import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
};

export const vendorWiseSlice = createSlice({
  name: "vendorWiseSlice",
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

// get vendor reports
export const getVendorReports = (url, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get vendor reports error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess } = vendorWiseSlice.actions;
export default vendorWiseSlice.reducer;
