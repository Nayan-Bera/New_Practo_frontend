import {
  SET_HOST_UPCOMING_EXAM,
  SET_HOST_PAST_EXAM,
  SET_UPCOMING_EXAM,
  SET_PAST_EXAM,
  SET_CURR_EXAM,
  ExamAction,
  ExamState,
  Exam
} from "../types";

const initialState: ExamState = {
  hostUpcoming: [],
  hostPast: [],
  upcoming: [],
  past: [],
  currentExam: {} as Exam,
};

const examReducer = (
  state: ExamState = initialState, 
  action: ExamAction
): ExamState => {
  const { type, payload } = action;

  switch (type) {
    case SET_HOST_UPCOMING_EXAM:
      return {
        ...state,
        hostUpcoming: payload as Exam[],
      };

    case SET_HOST_PAST_EXAM:
      return {
        ...state,
        hostPast: payload as Exam[],
      };
    case SET_UPCOMING_EXAM:
      return {
        ...state,
        upcoming: payload as Exam[],
      };

    case SET_PAST_EXAM:
      return {
        ...state,
        past: payload as Exam[],
      };
    case SET_CURR_EXAM:
      return {
        ...state,
        currentExam: payload as Exam,
      };

    default:
      return state;
  }
};

export default examReducer; 