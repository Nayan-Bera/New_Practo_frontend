import { baseApi } from '../../../baseApi';
import { IUser } from '@/types';

interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: IUser;
}

export const signInApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: (credentials) => ({
        url: '/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useSignInMutation } = signInApi; 