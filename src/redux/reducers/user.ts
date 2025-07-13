import { SET_USER } from "../types";
import type { UserAction } from "../types";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'candidate';
}

const initialState: User = {};

const userReducer = (
  state: User = initialState, 
  action: UserAction
): User => {
  const { type } = action;

  switch (type) {
    case SET_USER:
      return {
        _id: action.payload?._id,
        name: action.payload?.name,
        email: action.payload?.email,
        role: action.payload?.role === 'candidate' || action.payload?.role === 'admin' ? action.payload?.role : 'candidate',
      };

    default:
      return state;
  }
};

export default userReducer; 