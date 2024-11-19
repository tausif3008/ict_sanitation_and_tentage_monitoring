// import { createSlice } from "@reduxjs/toolkit";

// const parkingSlice = createSlice({
//   name: "parking",
//   initialState: {
//     userUpdateEl: null,
//     isUpdated: false,
//   },
//   reducers: {
// setUpdateUserEl: (state, action) => {
//   state.userUpdateEl = action.payload.updateElement;
// },
// setUserListIsUpdated: (state, action) => {
//   state.isUpdated = action.payload.isUpdated;
// },
//   },
// });

// export const { setUpdateUserEl, setUserListIsUpdated } = parkingSlice.actions;
// export default parkingSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
  userUpdateEl: null,
  isUpdated: false,
};

export const parkingSlice = createSlice({
  name: "parkingSlice",
  initialState,
  reducers: {
    setUpdateUserEl: (state, action) => {
      state.userUpdateEl = action.payload.updateElement;
    },
    setUserListIsUpdated: (state, action) => {
      state.isUpdated = action.payload.isUpdated;
    },
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

// get parking data
export const getParkingData = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get parking data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const {
  setUpdateUserEl,
  setUserListIsUpdated,
  setLoading,
  postSuccess,
} = parkingSlice.actions;
export default parkingSlice.reducer;
