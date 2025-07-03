import { baseApi } from '../../../baseApi';

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  type: 'host' | 'candidate';
}

export const signUpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<void, SignUpRequest>({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useSignUpMutation } = signUpApi; 