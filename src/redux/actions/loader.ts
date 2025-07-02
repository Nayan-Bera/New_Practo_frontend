import { createSlice } from '@reduxjs/toolkit';

interface LoaderState {
  loading: boolean;
}

const initialState: LoaderState = {
  loading: false,
};

const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
    },
    unsetLoading(state) {
      state.loading = false;
    },
  },
});

export const { setLoading, unsetLoading } = loaderSlice.actions;
export default loaderSlice.reducer; 