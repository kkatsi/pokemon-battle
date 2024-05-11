import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface uiState {
  healthAnimationDuration: number;
}

const initialState: uiState = {
  healthAnimationDuration: 1000,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setHealthAnimationDuration(state, action) {
      state.healthAnimationDuration = action.payload;
    },
  },
});

export const { setHealthAnimationDuration } = uiSlice.actions;

export default uiSlice.reducer;

export const selectHealthAnimationDuration = (state: RootState) =>
  state.ui.healthAnimationDuration;
