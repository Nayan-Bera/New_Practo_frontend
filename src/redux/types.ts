// Action Types

// Loader
export const SET_LOADING = "SET_LOADING";
export const UNSET_LOADING = "UNSET_LOADING";

// User
export const SET_USER = "SET_USER";

// ALERT
export const SET_ALERT = "SET_ALERT";
export const UNSET_ALERT = "UNSET_ALERT";

// Exam
export const SET_ADMIN_UPCOMING_EXAM = "SET_ADMIN_UPCOMING_EXAM";
export const SET_ADMIN_PAST_EXAM = "SET_ADMIN_PAST_EXAM";
export const SET_UPCOMING_EXAM = "SET_UPCOMING_EXAM";
export const SET_PAST_EXAM = "SET_PAST_EXAM";
export const SET_CURR_EXAM = "SET_CURR_EXAM";

// Interfaces
export interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: 'admin' | 'candidate';
}

export interface Question {
  question: string;
  options: string[];
  answer: number;
  marks: number;
}

export interface Answer {
  _id: string;
  exam: string;
  candidate: string;
  answers: number[];
  exited?: string;
}

export interface Exam {
  _id?: string;
  title: string;
  description: string;
  duration: number;
  startingtime: string;
  questions: Question[];
  admin?: User;
  candidates?: User[];
}

export interface ExamState {
  adminUpcoming: Exam[];
  adminPast: Exam[];
  upcoming: Exam[];
  past: Exam[];
  currentExam: Exam;
}

// Action Types Interfaces
export interface LoaderAction {
  type: typeof SET_LOADING | typeof UNSET_LOADING;
}

export interface UserAction {
  type: typeof SET_USER;
  payload: User;
}

export interface AlertAction {
  type: typeof SET_ALERT | typeof UNSET_ALERT;
  payload: {
    type?: 'success' | 'error' | 'warning' | 'info';
    message?: string;
    duration?: number;
  };
}

export interface ExamAction {
  type: typeof SET_ADMIN_UPCOMING_EXAM 
    | typeof SET_ADMIN_PAST_EXAM 
    | typeof SET_UPCOMING_EXAM 
    | typeof SET_PAST_EXAM 
    | typeof SET_CURR_EXAM;
  payload: Exam[] | Exam;
}

// Union type for all actions
export type AppActions = LoaderAction | UserAction | AlertAction | ExamAction; 