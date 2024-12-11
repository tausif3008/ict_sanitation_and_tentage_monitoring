import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../../Redux/action";
import axiosInstance from "../../../Axios/commonAxios";
import URLS from "../../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  sector_list: null,
  user_list: null,
};

export const vendorSectorSlice = createSlice({
  name: "vendorSectorSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postSector: (state, action) => {
      state.sector_list = action.payload;
    },
    postUser: (state, action) => {
      state.user_list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get all sectors list
export const getSectorsList = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${URLS?.sectors?.path}`);
    dispatch(postSector(res?.data));
  } catch (error) {
    console.error("In get sectors list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get vendor wise supervisor list
export const getVendorWiseSupervisorList = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get supervisor list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get user type wise user list
export const getUserTypeWiseUserList = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postUser(res?.data));
  } catch (error) {
    console.error("In get supervisor list error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// delete Supervisor Sector Allocation
export const deleteSupervisorSectorAllocation = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.delete(`${url}`);
    // dispatch(postUser(res?.data));
    return res?.data?.success;
  } catch (error) {
    console.error("In delete Supervisor Sector Allocation error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postSector, postUser } =
  vendorSectorSlice.actions;
export default vendorSectorSlice.reducer;
