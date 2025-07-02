import { baseApi } from '../../../baseApi';
import { Answer } from '../../../../types';

export const addAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAnswer: builder.mutation<Answer, string>({
      query: (examId) => ({
        url: `/answer/${examId}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, examId) => [
        { type: 'Answer', id: examId },
      ],
    }),
  }),
});

export const { useCreateAnswerMutation } = addAnswerApi; 