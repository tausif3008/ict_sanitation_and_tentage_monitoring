import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../../Redux/action";
import axiosInstance from "../../../Axios/commonAxios";

const initialState = {
  loading: false,
};

export const vendorDetailsSlice = createSlice({
  name: "vendorDetailsSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// delete vendor details
export const deleteVendorDetails = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.delete(`${url}`);
    return res?.data?.success;
  } catch (error) {
    console.error("In delete vendor details error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading } = vendorDetailsSlice.actions;
export default vendorDetailsSlice.reducer;
