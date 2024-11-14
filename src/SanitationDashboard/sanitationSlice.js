import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const initialState = {
    sanitationData: null,
};

export const sanitationSlice = createSlice({
  name: 'sanitationSlice',
  initialState,
  reducers: {
    postGet: (state, action) => {
      state.sanitationData = action.payload;
    },
  },
});

export const GetToilets = () => async (dispatch) => {
  
    const localHeader = {
        "Content-Type": "application/json",
        "x-api-key": "YunHu873jHds83hRujGJKd873",
        "x-api-version": "1.0.1",
        "x-platform": "Web",
        "x-access-token": localStorage.getItem("sessionToken") || "",
      };
  try {
    const res = await axios({
        method: "GET",
        url: "https://kumbhtsmonitoring.in/php-api/dashboard/sanitation",
        headers: localHeader,
      });
    dispatch(postGet(res?.data));
  } catch (error) {
    console.log('In get Location function error', error);
  }
};

export const { postGet } = sanitationSlice.actions;
export default sanitationSlice.reducer;
