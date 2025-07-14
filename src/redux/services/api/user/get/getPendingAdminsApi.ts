import { baseApi } from '../../../baseApi';

export const getPendingAdminsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingAdmins: builder.query<any, void>({
      query: () => ({
        url: '/user/pending-admins',
        method: 'GET',
      }),
    }),
    approveAdmin: builder.mutation<any, string>({
      query: (adminId) => ({
        url: `/user/approve-admin/${adminId}`,
        method: 'PUT',
      }),
    }),
    rejectAdmin: builder.mutation<any, string>({
      query: (adminId) => ({
        url: `/user/reject-admin/${adminId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetPendingAdminsQuery, useApproveAdminMutation, useRejectAdminMutation } = getPendingAdminsApi; 