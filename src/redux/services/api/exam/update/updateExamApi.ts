import { baseApi } from '../../../baseApi';
import type { Question } from '../../../../types';

interface UpdateExamRequest {
  title?: string;
  description?: string;
  duration?: number;
  startingtime?: string;
  questions?: Question[];
  candidates?: string[];
}

export const updateExamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateExam: builder.mutation<void, { examId: string; body: UpdateExamRequest }>({
      query: ({ examId, body }) => ({
        url: `/exam/${examId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { examId }) => [
        'Exam',
        { type: 'Exam', id: examId },
      ],
    }),
  }),
});

export const { useUpdateExamMutation } = updateExamApi; 