// slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const vehicleSlice = createSlice({
  name: "vehicleSlice",
  initialState: {
    vehicleUpdateEl: null,
    isUpdated: false,
  },

  reducers: {
    setUpdateVehicleEl: (state, action) => {
      state.vehicleUpdateEl = action.payload.updateElement;
    },
    setVehicleListIsUpdated: (state, action) => {
      state.isUpdated = action.payload.isUpdated;
    },
  },
});

export const { setUpdateVehicleEl, setVehicleListIsUpdated } =
  vehicleSlice.actions;

export default vehicleSlice.reducer;
