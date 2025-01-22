import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";
import URLS from "../../urils/URLS";

const initialState = {
  loading: false,
  name: null,
  sector_data: null,
  sector_type: null,
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
    postSector: (state, action) => {
      state.sector_data = action.payload;
    },
    postSectorType: (state, action) => {
      state.sector_type = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// get Sector reports
export const getSectorReports = (url, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(postSuccess(res?.data));
  } catch (error) {
    console.error("In get Sector reports error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get sector wise registration report data
export const getSectorWiseRegData = (url, data) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.post(`${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(postSector(res?.data));
  } catch (error) {
    console.error("In get sector wise registration report data error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// get sector-type wise registration report data
export const getSectorTypeRegData =
  (data = null) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const res = await axiosInstance.post(
        `${URLS?.sector_type_wise_reg_report?.path}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(postSectorType(res?.data));
    } catch (error) {
      console.error(
        "In get sector-type wise registration report data error",
        error
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

export const { setLoading, postSuccess, postSector, postSectorType } =
  SectorReportSlice.actions;
export default SectorReportSlice.reducer;
