import type { Dispatch } from "redux";
import history from "../../utils/createHistory";
import { addUser, removeUser } from "../../utils/localStorage";
import {
  useSignInMutation,
  useSignOutMutation,
  useSignUpMutation,
  useUpdatePasswordMutation,
  useUpdateUserMutation,
} from "../services/api";
import type { UserAction } from "../types";
import { SET_USER } from "../types";

interface SignInDetails {
  email: string;
  password: string;
}

interface SignUpDetails extends SignInDetails {
  name: string;
  type: "host" | "candidate";
}




// Note: These hooks must be used within a React component or custom hook
// They cannot be used directly in action creators
// Instead, we'll create action creators that accept the mutation functions as parameters

export const signIn =
  (
    details: SignInDetails,
    signInMutation: ReturnType<typeof useSignInMutation>[0]
  ) =>
  async (dispatch: Dispatch<UserAction>) => {
    try {
      const response = await signInMutation(details).unwrap();
      await addUser({ token: response.token, user: response.user });
      dispatch({ type: SET_USER, payload: response.user });
      return true;
    } catch (error) {
      return false;
    }
  };

export const signUp =
  (
    details: SignUpDetails,
    signUpMutation: ReturnType<typeof useSignUpMutation>[0]
  ) =>
  async () => {
    try {
      await signUpMutation(details).unwrap();
      history.push("/signin");
      return true;
    } catch (error) {
      return false;
    }
  };

export const signOut =
  (signOutMutation: ReturnType<typeof useSignOutMutation>[0]) =>
  async (dispatch: Dispatch<UserAction>) => {
    try {
      await signOutMutation().unwrap();
      removeUser();
      dispatch({ type: SET_USER, payload: {} });
      history.push("/signin");
      return true;
    } catch (error) {
      return false;
    }
  };

interface UserUpdatePayload {
  name?: string;
  email?: string;
}

export const updateUser =
  (
    payload: UserUpdatePayload,
    updateUserMutation: ReturnType<typeof useUpdateUserMutation>[0]
  ) =>
  async () => {
    try {
      await updateUserMutation(payload).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

export const updateUserPassword =
  (
    password: string,
    updatePasswordMutation: ReturnType<typeof useUpdatePasswordMutation>[0]
  ) =>
  async () => {
    try {
      await updatePasswordMutation({ password }).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };
