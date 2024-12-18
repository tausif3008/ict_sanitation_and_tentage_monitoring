// slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  assetUpdateEl: null,
  isUpdated: false,
  loading: false,
  name: null,
};

const assetsSlice = createSlice({
  name: "assetsSlice",
  initialState,
  reducers: {
    setUpdateAssetEl: (state, action) => {
      state.assetUpdateEl = action.payload.updateElement;
    },
    setAssetListIsUpdated: (state, action) => {
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

// get pdf and excel data
export const getPdfExcelData = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
    return res?.data;
  } catch (error) {
    console.error("In get pdf and excel data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const {
  setUpdateAssetEl,
  setAssetListIsUpdated,
  setLoading,
  postSuccess,
} = assetsSlice.actions;
export default assetsSlice.reducer;
