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
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get route list
export const getRouteList = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`);
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

export const { setLoading, postSuccess, postPickUp } = routeSlice.actions;
export default routeSlice.reducer;
