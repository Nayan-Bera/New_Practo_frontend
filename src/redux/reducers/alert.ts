import { SET_ALERT, UNSET_ALERT } from "../types";
import type { AlertAction } from "../types";

interface AlertState {
  message: string;
  type: string;
  duration: number;
}

const initialState: AlertState = {
  message: "",
  type: "",
  duration: 0,
};

const alertReducer = (
  state: AlertState = initialState, 
  action: AlertAction
): AlertState => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return {
        message: payload.message || "",
        type: payload.type || "success",
        duration: payload.duration || 3000,
      };

    case UNSET_ALERT:
      return {
        message: "",
        type: "",
        duration: 0,
      };

    default:
      return state;
  }
};

export default alertReducer; 