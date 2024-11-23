import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../../Redux/action";
import axiosInstance from "../../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
  vendorDetailsUpdateEl: null,
  isUpdated: false,
  sectorQuant: [1],
};

export const vendorDetailsSlice = createSlice({
  name: "vendorDetailsSlice",
  initialState,
  reducers: {
    setUpdateVendorDetailsEl: (state, action) => {
      state.vendorDetailsUpdateEl = action.payload.updateElement;
    },
    setVendorDetailsListIsUpdated: (state, action) => {
      state.isUpdated = action.payload.isUpdated;
    },
    setSectorQuant: (state, action) => {
      state.sectorQuant = action.payload;
    },
    addSectorQuant: (state, action) => {
      state.sectorQuant = [...state.sectorQuant, ...action.payload];
    },
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

export const {
  setLoading,
  setUpdateVendorDetailsEl,
  setVendorDetailsListIsUpdated,
  setSectorQuant,
  addSectorQuant,
} = vendorDetailsSlice.actions;
export default vendorDetailsSlice.reducer;
