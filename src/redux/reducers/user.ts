import { SET_USER } from "../types";
import type { UserAction } from "../types";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: 'host' | 'candidate';
}

const initialState: User = {};

const userReducer = (
  state: User = initialState, 
  action: UserAction
): User => {
  const { type, payload } = action;

  switch (type) {
    case SET_USER:
      return {
        ...payload,
      };

    default:
      return state;
  }
};

export default userReducer; 