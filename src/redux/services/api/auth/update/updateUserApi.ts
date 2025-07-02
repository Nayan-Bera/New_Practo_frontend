import { baseApi } from '../../../baseApi';

interface UpdateUserRequest {
  name?: string;
  email?: string;
}

interface UpdatePasswordRequest {
  password: string;
}

export const updateUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation<void, UpdateUserRequest>({
      query: (userData) => ({
        url: '/user',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    updatePassword: builder.mutation<void, UpdatePasswordRequest>({
      query: (passwordData) => ({
        url: '/changepassword',
        method: 'PUT',
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} = updateUserApi; 