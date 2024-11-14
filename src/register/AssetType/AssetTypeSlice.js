// slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
  type_data: null,
  assetUpdateEl: null,
  isUpdated: false,
};

const assetTypeSlice = createSlice({
  name: "assetTypeSlice",
  initialState,
  reducers: {
    setUpdateAssetEl: (state, action) => {
      state.assetUpdateEl = action.payload.updateElement;
    },
    setAssetTypeListIsUpdated: (state, action) => {
      state.isUpdated = action.payload.isUpdated;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postType: (state, action) => {
      state.type_data = action.payload;
    },
  },
});

// get asset main type
export const getAssetMainTypes = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get asset main type error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get asset type
export const getAssetTypes = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postType(res?.data));
  } catch (error) {
    console.error("In get asset main type error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const {
  setUpdateAssetEl,
  setAssetTypeListIsUpdated,
  setLoading,
  postSuccess,
  postType,
} = assetTypeSlice.actions;
export default assetTypeSlice.reducer;
