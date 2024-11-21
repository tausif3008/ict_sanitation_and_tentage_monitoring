import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  vendor_list: null,
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
    console.error("In get sanitation dashboard data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postVendor } =
  sanitationDashboard.actions;
export default sanitationDashboard.reducer;
