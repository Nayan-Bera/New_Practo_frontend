import { baseApi } from '../../../baseApi';

export const antiCheatingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    recordAntiCheatingEvent: builder.mutation<
      { message: string },
      { examId: string; eventType: string; details?: any }
    >({
      query: ({ examId, eventType, details }) => ({
        url: `/exam/${examId}/anti-cheating`,
        method: 'POST',
        body: { eventType, details },
      }),
    }),

    getAntiCheatingReport: builder.query<
      { report: Array<{
        candidateId: string;
        totalEvents: number;
        recentEvents: number;
        eventBreakdown: {
          tabSwitches: number;
          copyPaste: number;
          rightClicks: number;
          devTools: number;
          fullscreenExits: number;
        };
        riskLevel: 'low' | 'medium' | 'high';
        warnings: number;
      }> },
      string
    >({
      query: (examId) => ({
        url: `/exam/${examId}/anti-cheating-report`,
        method: 'GET',
      }),
      providesTags: (_result, _error, examId) => [{ type: 'Exam', id: examId }],
    }),
  }),
});

export const {
  useRecordAntiCheatingEventMutation,
  useGetAntiCheatingReportQuery,
} = antiCheatingApi; 