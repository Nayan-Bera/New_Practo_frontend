import { baseApi } from '../../../baseApi';
import { User } from '../../../../types';
import { getUser } from '../../../../../utils/localStorage';

export const getUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query<User[], void>({
      query: () => ({
        url: '/all/user',
        method: 'GET',
      }),
      transformResponse: (response: User[]) => {
        const currentUser = getUser()?.user;
        return response.filter(user => user._id !== currentUser?._id);
      },
      providesTags: ['User'],
    }),
  }),
});

export const { useGetUserListQuery } = getUserApi; 