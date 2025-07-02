import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertState {
  message: string;
  type: AlertType | null;
  duration: number;
}

const initialState: AlertState = {
  message: '',
  type: null,
  duration: 3000,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<{ message: string; type: AlertType; duration?: number }>) {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.duration = action.payload.duration ?? 3000;
    },
    unsetAlert(state) {
      state.message = '';
      state.type = null;
      state.duration = 3000;
    },
  },
});

export const { setAlert, unsetAlert } = alertSlice.actions;
export default alertSlice.reducer; 