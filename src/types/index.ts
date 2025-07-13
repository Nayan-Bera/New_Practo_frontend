// User Types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  type: 'admin' | 'candidate';
  upcomingExams: string[];
  pastExams: string[];
  createdAt: string;
  updatedAt: string;
}

// Exam Types
export interface IQuestion {
  _id: string;
  examId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
}

export interface ICandidate {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  score?: number;
}

export interface IExam {
  _id: string;
  title: string;
  description?: string;
  host: string;
  startTime: string;
  duration: number;
  questions: IQuestion[];
  candidates: ICandidate[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  settings: Map<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Redux State Types
export interface IAlertState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

export interface IAppState {
  user: IUser | null;
  loader: number;
  alert: IAlertState;
  exam: IExam | null;
}

// Component Props Types
export interface IPrivateRouteProps {
  children?: React.ReactNode;
}

export interface IHeaderFooterProps {
  children: React.ReactNode;
}

// API Response Types
export interface IApiResponse<T> {
  response: T | null;
  headers: any;
  error: string | null;
}

export interface Answer {
  score: number;
  exited?: string;
  candidate?: { name: string };
  answers?: Array<{
    questionid: string;
    optionid: string;
    mark: number;
  }>;
} 