import {
  SET_CURR_EXAM,
  SET_PAST_EXAM,
  SET_UPCOMING_EXAM,
  SET_ADMIN_UPCOMING_EXAM,
  SET_ADMIN_PAST_EXAM
} from "../types";
import type { Exam, ExamAction, ExamState } from "../types";

const initialState: ExamState = {
  adminUpcoming: [],
  adminPast: [],
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

    case SET_ADMIN_UPCOMING_EXAM:
      return {
        ...state,
        adminUpcoming: payload as Exam[],
      };

    case SET_ADMIN_PAST_EXAM:
      return {
        ...state,
        adminPast: payload as Exam[],
      };

    default:
      return state;
  }
};

export default examReducer; 