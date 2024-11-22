import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../../Redux/action";
import axiosInstance from "../../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
  dash_data: null,
};

export const IncidentReportSlice = createSlice({
  name: "IncidentReportSlice",
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

// get Incident Report Data
export const getIncidentReportData = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get Incident report data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setLoading, postSuccess } = IncidentReportSlice.actions;
export default IncidentReportSlice.reducer;
