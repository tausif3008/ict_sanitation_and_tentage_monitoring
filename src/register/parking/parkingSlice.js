import { createSlice } from "@reduxjs/toolkit";

const parkingSlice = createSlice({
  name: "parking",
  initialState: {
    userUpdateEl: null,
    isUpdated: false,
  },
  reducers: {
    setUpdateUserEl: (state, action) => {
      state.userUpdateEl = action.payload.updateElement;
    },
    setUserListIsUpdated: (state, action) => {
      state.isUpdated = action.payload.isUpdated;
    },
  },
});

export const { setUpdateUserEl, setUserListIsUpdated } = parkingSlice.actions;
export default parkingSlice.reducer;
