import { createSlice } from "@reduxjs/toolkit";

const routeSlice = createSlice({
  name: "routeSlice",
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
routeSlice.actions;

export default routeSlice.reducer;
