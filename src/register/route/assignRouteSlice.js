import { createSlice } from "@reduxjs/toolkit";

const assignRouteSlice = createSlice({
  name: "assignRouteSlice",
  initialState: {
    routeUpdate: null,
    isUpdated: false,
  },

  reducers: {
    setUpdateRoute: (state, action) => {
      state.routeUpdate = action.payload.updateElement;
    },
    setRouteListIsUpdated: (state, action) => {
      state.isUpdated = action.payload.isUpdated;
    },
  },
});

export const { setUpdateRoute, setRouteListIsUpdated } =
assignRouteSlice.actions;

export default assignRouteSlice.reducer;
