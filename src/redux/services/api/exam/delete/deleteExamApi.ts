import { baseApi } from '../../../baseApi';

export const deleteExamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteExam: builder.mutation<void, string>({
      query: (examId) => ({
        url: `/exam/delete/${examId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Exam'],
    }),
  }),
});

export const { useDeleteExamMutation } = deleteExamApi; 