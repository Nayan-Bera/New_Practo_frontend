import { baseApi } from '../../../baseApi';
import { Exam, Question } from '../../../../types';

interface CreateExamRequest {
  title: string;
  description: string;
  duration: number;
  startingtime: string;
  questions: Question[];
  candidates: string[];
}

export const addExamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createExam: builder.mutation<void, CreateExamRequest>({
      query: (body) => ({
        url: '/exam',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Exam'],
    }),
  }),
});

export const { useCreateExamMutation } = addExamApi; 