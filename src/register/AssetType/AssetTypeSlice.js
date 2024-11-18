// slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  type_data: null,
  assetUpdateEl: null,
  isUpdated: false,
  sla_data: null,
  vendor_assetType: null,
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
    postSla: (state, action) => {
      state.sla_data = action.payload;
    },
    postVendorAssetType: (state, action) => {
      state.vendor_assetType = action.payload;
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

// get sla types
export const getSLATypes = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSla(res?.data));
  } catch (error) {
    console.error("In get sla types error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get asset type wise vendor list
export const getVendorListAssetType = (Id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(
      `${URLS?.vendorDetailsAssetType?.path}${Id}`
    );
    dispatch(postVendorAssetType(res?.data));
  } catch (error) {
    console.error("In get asset type wise vendor list error", error);
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
  postSla,
  postVendorAssetType,
} = assetTypeSlice.actions;
export default assetTypeSlice.reducer;
