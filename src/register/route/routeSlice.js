import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  routeUpdate: null,
  isUpdated: false,
  loading: false,
  name: null,
  point: null,
  dropdown_data: null,
};

export const routeSlice = createSlice({
  name: "routeSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postPickUp: (state, action) => {
      state.point = action.payload;
    },
    postDrop: (state, action) => {
      state.dropdown_data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get route list
export const getRouteList = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get route list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get route pick up point
export const getRoutePickUpPoint = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postPickUp(res?.data));
  } catch (error) {
    console.error("In get route pick up point error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get route pick up point
export const getRoutePickUpPointDrop = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.getPickUpPointDrop?.path}`);
    dispatch(postDrop(res?.data));
  } catch (error) {
    console.error("In get route pick up point error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postPickUp, postDrop } =
  routeSlice.actions;
export default routeSlice.reducer;
