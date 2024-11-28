import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
};

export const SectorReportSlice = createSlice({
  name: "SectorReportSlice",
  initialState,
  reducers: {
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

// get Sector reports
export const getSectorReports = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get Sector reports error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess } = SectorReportSlice.actions;
export default SectorReportSlice.reducer;
