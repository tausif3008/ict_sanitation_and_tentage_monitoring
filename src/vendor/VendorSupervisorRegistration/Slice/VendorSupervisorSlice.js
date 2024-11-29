import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../../Redux/action";
import axiosInstance from "../../../Axios/commonAxios";
import URLS from "../../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  vendor_list: null,
  type_vendor_list: null,
};

export const vendorSupervisorSlice = createSlice({
  name: "vendorSupervisorSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postVendor: (state, action) => {
      state.vendor_list = action.payload;
    },
    postTypeVendor: (state, action) => {
      state.type_vendor_list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get supervisor list
// export const getSupervisorList = (url) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
//     const res = await axiosInstance.get(`${url}`);
//     dispatch(postSuccess(res?.data));
//   } catch (error) {
//     console.error("In get supervisor list error", error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// get vendor list
export const getVendorList = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.vendors?.path}`);
    dispatch(postVendor(res?.data));
  } catch (error) {
    console.error("In get vendor list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get asset type wise vendor list
export const getAssetTypeWiseVendorList = (Id) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(
      `${URLS?.AssetTypeWiseVendors?.path}${Id}`
    );
    dispatch(postTypeVendor(res?.data));
  } catch (error) {
    console.error("In asset type wise vendor list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postVendor, postTypeVendor } =
  vendorSupervisorSlice.actions;
export default vendorSupervisorSlice.reducer;
