import { baseApi } from '../../../baseApi';
import type { Answer } from '../../../../types';

export const getAnswerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHostedExamAnswers: builder.query<Answer[], string>({
      query: (examId) => ({
        url: `/host/answers/${examId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, examId) => [
        { type: 'Answer', id: examId },
      ],
    }),

    getCandidateAnswer: builder.query<Answer, { examId: string; candidateId?: string }>({
      query: ({ examId, candidateId }) => ({
        url: `/candidate/answer/${examId}`,
        method: 'POST',
        body: candidateId ? { candidateId } : undefined,
      }),
      providesTags: (_result, _error, { examId }) => [
        { type: 'Answer', id: examId },
      ],
    }),
  }),
});

export const {
  useGetHostedExamAnswersQuery,
  useGetCandidateAnswerQuery,
} = getAnswerApi; 