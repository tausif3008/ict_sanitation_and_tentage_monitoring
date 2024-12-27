import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../../Axios/commonAxios";
import URLS from "../../../urils/URLS";

const initialState = {
  loading: false,
  vehicle_list: null,
};

const vehicleSlice = createSlice({
  name: "vehicleSlice",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.vehicle_list = action.payload;
    },
  },
});

// get vehicle list
export const getVehicleList = (param) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.vehicles?.path}`, {
      params: param,
    });
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get vehicle list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess } = vehicleSlice.actions;
export default vehicleSlice.reducer;
