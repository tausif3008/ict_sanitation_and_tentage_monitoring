import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  allocate_data: null,
};

const assetsSlice = createSlice({
  name: "assetsSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postAllocate: (state, action) => {
      state.allocate_data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get asset allocation data
export const getAssetAllocationData =
  (params = null) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(`${URLS?.getAllocate_Asset?.path}`, {
        params: params,
      });
      dispatch(postAllocate(res?.data));
    } catch (error) {
      console.error("In get asset allocation data error", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

// get pdf and excel data
export const getPdfExcelData =
  (url, params = null) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(`${url}`, { params: params });
      dispatch(postSuccess(res?.data));
      return res?.data;
    } catch (error) {
      console.error("In get pdf and excel data error", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const { setLoading, postSuccess, postAllocate } = assetsSlice.actions;
export default assetsSlice.reducer;
