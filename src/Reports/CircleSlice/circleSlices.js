import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  report_data: null,
};

export const circleWiseSlice = createSlice({
  name: "circleWiseSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postCircle: (state, action) => {
      state.report_data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get Circle reports
export const getCircleReports = (url, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(postCircle(res?.data));
  } catch (error) {
    console.error("In get Circle reports error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get circle list
export const getAllCircleList = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.allCircleList?.path}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get circle list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postCircle } = circleWiseSlice.actions;
export default circleWiseSlice.reducer;
