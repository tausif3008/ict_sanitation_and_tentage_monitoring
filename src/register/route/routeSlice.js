import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  routeUpdate: null,
  isUpdated: false,
  loading: false,
  name: null,
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

export const { setLoading, postSuccess } = routeSlice.actions;
export default routeSlice.reducer;
