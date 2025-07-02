import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { getUser } from '../../utils/localStorage';



const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  prepareHeaders: (headers: Headers) => {
    const userData = getUser();
    if (userData && 'token' in userData) {
      headers.set('authorization', `Bearer ${userData.token}`);
    }
    return headers;
  },
}) as BaseQueryFn;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  endpoints: () => ({}),
  tagTypes: ['User', 'Exam', 'Answer'],
}); 