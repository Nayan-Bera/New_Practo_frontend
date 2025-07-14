import { baseApi } from '../../../baseApi';
import type { Exam, Question } from '../../../../types';

export const getExamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUpcomingExams: builder.query<Exam[], void>({
      query: () => ({
        url: '/exam/admin/upcoming',
        method: 'GET',
      }),
      transformResponse: (response: Exam[]) => 
        response.sort((a, b) => Date.parse(a.startingtime) - Date.parse(b.startingtime)),
      providesTags: ['Exam'],
    }),

    getAdminPastExams: builder.query<Exam[], void>({
      query: () => ({
        url: '/exam/admin/past',
        method: 'GET',
      }),
      transformResponse: (response: Exam[]) => 
        response.sort((a, b) => Date.parse(b.startingtime) - Date.parse(a.startingtime)),
      providesTags: ['Exam'],
    }),

    getUserUpcomingExams: builder.query<Exam[], void>({
      query: () => ({
        url: '/user/upcomingexam',
        method: 'GET',
      }),
      transformResponse: (response: Exam[]) => 
        response.sort((a, b) => Date.parse(a.startingtime) - Date.parse(b.startingtime)),
      providesTags: ['Exam'],
    }),

    getUserAttendedExams: builder.query<Exam[], void>({
      query: () => ({
        url: '/user/examattained',
        method: 'GET',
      }),
      transformResponse: (response: Exam[]) => 
        response.sort((a, b) => Date.parse(b.startingtime) - Date.parse(a.startingtime)),
      providesTags: ['Exam'],
    }),

    getExam: builder.query<Exam, string>({
      query: (examId) => ({
        url: `/exam/${examId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, examId) => [{ type: 'Exam', id: examId }],
    }),

    getCurrentExam: builder.query<Exam, string>({
      query: (examId) => ({
        url: `/exam/current/${examId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, examId) => [{ type: 'Exam', id: examId }],
    }),

    getRandomizedQuestions: builder.query<{ questions: Question[]; randomizationInfo: any }, string>({
      query: (examId) => ({
        url: `/exam/${examId}/questions/randomized`,
        method: 'GET',
      }),
      providesTags: (_result, _error, examId) => [{ type: 'Exam', id: examId }],
    }),
  }),
});

export const {
  useGetAdminUpcomingExamsQuery,
  useGetAdminPastExamsQuery,
  useGetUserUpcomingExamsQuery,
  useGetUserAttendedExamsQuery,
  useGetExamQuery,
  useGetCurrentExamQuery,
  useGetRandomizedQuestionsQuery,
} = getExamApi; 