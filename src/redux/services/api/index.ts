// Auth APIs
export {
  useSignInMutation,
} from './auth/signIn/signInApi';

export {
  useSignUpMutation,
} from './auth/signUp/signUpApi';

export {
  useSignOutMutation,
} from './auth/signOut/signOutApi';

export {
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} from './auth/update/updateUserApi';

// Exam APIs
export {
  useCreateExamMutation,
} from './exam/add/addExamApi';

export {
  useGetAdminUpcomingExamsQuery,
  useGetAdminPastExamsQuery,
  useGetUserUpcomingExamsQuery,
  useGetUserAttendedExamsQuery,
  useGetExamQuery,
} from './exam/get/getExamApi';

export {
  useUpdateExamMutation,
} from './exam/update/updateExamApi';

export {
  useDeleteExamMutation,
} from './exam/delete/deleteExamApi';

// Answer APIs
export {
  useCreateAnswerMutation,
} from './answer/add/addAnswerApi';

export {
  useGetHostedExamAnswersQuery,
  useGetCandidateAnswerQuery,
} from './answer/get/getAnswerApi';

export {
  useUpdateAnswerMutation,
  useExitAnswerMutation,
} from './answer/update/updateAnswerApi';

// User APIs
export {
  useGetUserListQuery,
} from './user/get/getUserApi';

export { useGetPendingAdminsQuery, useApproveAdminMutation, useRejectAdminMutation } from './user/get/getPendingAdminsApi'; 