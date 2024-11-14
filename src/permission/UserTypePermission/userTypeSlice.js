import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
  user_list: null,
  module_list: null,
};

export const userTypeSlice = createSlice({
  name: "userTypeSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postSuccess: (state, action) => {
      state.name = action.payload;
    },
    postUserList: (state, action) => {
      state.user_list = action.payload;
    },
    postModule: (state, action) => {
      state.module_list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get module permission
export const getUserTypePermission = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get shifts error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get usre type list
export const getUserTypeList = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postUserList(res?.data));
  } catch (error) {
    console.error("In get shifts error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get usre type list
export const getModuleList = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postModule(res?.data));
  } catch (error) {
    console.error("In get shifts error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess, postUserList, postModule } =
  userTypeSlice.actions;
export default userTypeSlice.reducer;
