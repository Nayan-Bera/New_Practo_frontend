import { baseApi } from '../../../baseApi';

export const updateAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateAnswer: builder.mutation<void, { examId: string; answerId: string; answers: number[] }>({
      query: ({ examId, answerId, answers }) => ({
        url: `/answer/${examId}/${answerId}`,
        method: 'PUT',
        body: { answers },
      }),
      invalidatesTags: (result, error, { examId }) => [
        { type: 'Answer', id: examId },
      ],
    }),

    exitAnswer: builder.mutation<void, { examId: string; answerId: string; message: string }>({
      query: ({ examId, answerId, message }) => ({
        url: `/answer/exit/${examId}/${answerId}`,
        method: 'PUT',
        body: { exited: message },
      }),
      invalidatesTags: (result, error, { examId }) => [
        { type: 'Answer', id: examId },
      ],
    }),
  }),
});

export const {
  useUpdateAnswerMutation,
  useExitAnswerMutation,
} = updateAnswerApi; 