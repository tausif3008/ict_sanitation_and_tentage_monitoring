import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { basicUrl } from "../Axios/commonAxios";
const initialState = {
  sanitationData: null,
};

export const sanitationSlice = createSlice({
  name: "sanitationSlice",
  initialState,
  reducers: {
    postGet: (state, action) => {
      state.sanitationData = action.payload;
    },
  },
});

// export const GetToilets = () => async (dispatch) => {
//   // const localHeader = {
//   //   "Content-Type": "application/json",
//   //   "x-api-key": "YunHu873jHds83hRujGJKd873",
//   //   "x-api-version": "1.0.1",
//   //   "x-platform": "Web",
//   //   "x-access-token": localStorage.getItem("sessionToken") || "",
//   // };
//   try {
//     // const res = await axios({
//     //   method: "GET",
//     //   url: `${basicUrl}/dashboard/sanitation`,
//     //   headers: localHeader,
//     // });
//     const response = await axiosInstance.post(`${basicUrl}/dashboard/sanitation`, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     dispatch(postGet(response?.data));
//   } catch (error) {
//     console.error("In get Location function error", error);
//   }
// };

export const { postGet } = sanitationSlice.actions;
export default sanitationSlice.reducer;
