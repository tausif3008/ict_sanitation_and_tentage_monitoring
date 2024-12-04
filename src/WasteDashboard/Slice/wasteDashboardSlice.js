import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";
import { revertAll } from "../../Redux/action";

const initialState = {
  loading: false,
  name: null,
};

export const wasteDashboardSlice = createSlice({
  name: "wasteDashboardSlice",
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

// get waste dashboard data
export const getWasteDashData = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.wasteDash?.path}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get waste dashboard data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postDash } =
  wasteDashboardSlice.actions;
export default wasteDashboardSlice.reducer;
