import { baseApi } from '../../../baseApi';

export const signOutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signOut: builder.mutation<void, void>({
      query: () => ({
        url: '/signout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useSignOutMutation } = signOutApi; 