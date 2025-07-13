import { SET_LOADING, UNSET_LOADING } from "../types";
import type { LoaderAction } from "../types";

type LoaderState = number;

const initialState: LoaderState = 0;

const loaderReducer = (
  state: LoaderState = initialState, 
  action: LoaderAction
): LoaderState => {
  const { type } = action;

  switch (type) {
    case SET_LOADING:
      return state + 1;

    case UNSET_LOADING:
      return state - 1;

    default:
      return state;
  }
};

export default loaderReducer; 