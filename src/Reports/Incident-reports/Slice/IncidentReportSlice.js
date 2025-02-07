import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../../Redux/action";
import axiosInstance from "../../../Axios/commonAxios";
import URLS from "../../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  unit_data: null,
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
    postUnit: (state, action) => {
      state.unit_data = action.payload;
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
// get asset Unit Report Data
export const getAssetUnitReportData =
  (param = null) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.get(`${URLS?.assetUnit?.path}`, {
        params: param,
      });
      dispatch(postUnit(res?.data));
    } catch (error) {
      console.error("In get asset Unit report data error", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const { setLoading, postSuccess, postUnit } =
  IncidentReportSlice.actions;
export default IncidentReportSlice.reducer;
