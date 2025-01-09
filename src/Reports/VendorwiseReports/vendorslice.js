import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  vendor_data: null,
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
    postDrop: (state, action) => {
      state.vendor_data = action.payload;
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

// get vendor list using asset main type and asset type
export const getVendorCategoryTypeDrop = (param) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(
      `${URLS?.vendorTypeCategoryDrop?.path}`,
      { params: param }
    );
    dispatch(postDrop(res?.data));
  } catch (error) {
    console.error("In get vendor dropdown data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postDrop } = vendorWiseSlice.actions;
export default vendorWiseSlice.reducer;
