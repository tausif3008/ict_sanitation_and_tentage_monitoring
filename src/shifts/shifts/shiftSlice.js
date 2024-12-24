import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";
import axiosInstance from "../../Axios/commonAxios";

const initialState = {
  loading: false,
  name: null,
};

export const shiftSlice = createSlice({
  name: "shiftSlice",
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

// get shifts
export const getShifts = (url) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const res = await axiosInstance.get(`${url}`);
    dispatch(postSuccess(res?.data));
  } catch (error) {
    // showAlert({
    //   status: 404,
    //   statusText: error?.response?.data?.error || "Something went wrong. ",
    // });
    console.error("In get shifts error", error);
  } finally {
    dispatch(setLoading(false));
  }
};

// add salary components
// export const addSalaryComponents = (data) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
//     const res = await axiosInstance.post(
//       `/payroll/api/v2/SalaryComponentView/`,
//       data
//     );
//     dispatch(getSalaryComponents());
//     showAlert({
//       status: res?.status,
//       statusText: "Salary Components Added Successfully. ",
//     });
//   } catch (error) {
//     showAlert({
//       status: 404,
//       statusText: error?.response?.data?.error || "Something went wrong. ",
//     });
//     console.error("In add salary components error", error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// // update salary components
// export const UpdateSalaryComponents = (id, data) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
//     const res = await axiosInstance.patch(
//       `/payroll/api/v2/SalaryComponentView/${id}/`,
//       data
//     );
//     dispatch(getSalaryComponents());
//     showAlert({
//       status: res?.status,
//       statusText: "Salary Components Update Successfully. ",
//     });
//   } catch (error) {
//     showAlert({
//       status: 404,
//       statusText: error?.response?.data?.error || "Something went wrong. ",
//     });
//     console.error("In update salary components error", error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// // get single salary components
// export const getSignleSalaryComponents = (id) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
//     const res = await axiosInstance.patch(
//       `/payroll/api/v2/SalaryComponentView/${id}/`
//     );
//     return {
//       status: res?.status,
//       data: res?.data,
//     };
//   } catch (error) {
//     showAlert({
//       status: 404,
//       statusText: error?.response?.data?.error || "Something went wrong. ",
//     });
//     console.error("In single salary components error", error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// // get salary component view
// export const getSalaryComponentViewDrop = () => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
//     const res = await axiosInstance.get(
//       `/payroll/api/v2/SelectedSalaryComponentView/?all_data=True`
//     );
//     dispatch(postDrop(res?.data?.data ? res?.data?.data : res?.data));
//   } catch (error) {
//     showAlert({
//       status: 404,
//       statusText: error?.response?.data?.error || "Something went wrong. ",
//     });
//     console.error("In get salary component view error", error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

// // get salary components filter
// export const getSalaryComponentsFilter = (param) => async (dispatch) => {
//   try {
//     dispatch(setLoading(true));
//     const res = await axiosInstance.get(
//       `/payroll/api/v2/SalaryComponentView/`,
//       { params: param }
//     );
//     dispatch(postFilter(res?.data?.data ? res?.data?.data : res?.data));
//   } catch (error) {
//     showAlert({
//       status: 404,
//       statusText: error?.response?.data?.error || "Something went wrong. ",
//     });
//     console.error("In get salary components error", error);
//   } finally {
//     dispatch(setLoading(false));
//   }
// };

export const { setLoading, postSuccess } = shiftSlice.actions;
export default shiftSlice.reducer;
