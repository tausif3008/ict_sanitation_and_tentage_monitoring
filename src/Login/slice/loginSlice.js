// slices/counterSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { revertAll } from "../../Redux/action";

const initialState = {
  loading: false,
  token_data: null,
};

const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    postToken: (state, action) => {
      state.token_data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
  },
});

// store token
export const storeToken = (data) => async (dispatch) => {
  dispatch(postToken(data));
};

export const { postToken, setLoading } = loginSlice.actions;
export default loginSlice.reducer;
