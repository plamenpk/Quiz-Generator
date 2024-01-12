export interface UserData {
  assignedQuizzes: AssignedQuizzesTypes
  address: string
  createdOn: Date
  email: string
  firstName: string
  isBlocked: boolean
  lastName: string
  phoneNumber: string
  profileImgURL: string
  role: string
  username: string
  uid: string
  score?: { [key: string]: UserScore }
}

export interface AssignedQuizzesTypes {
  [key: string]: [number, number];
}
export interface UserScore {
  category: string
  id: string
  maxPassingPoints: number
  minPassingPoints: number
  resolvedOn: number
  score: number
  title: string
  userAnswers: Answer[]
}

export interface ButtonType {
  text: string
  buttonType: 'button' | 'reset' | 'submit' | undefined
  onClickFunction?: (e: React.MouseEvent<HTMLButtonElement>) => void | undefined
}

export interface Answer {
  length?: number
  text: string;
  isCorrect: boolean;
}

export interface Question {
  question: string;
  answers: Answer[];
}

export interface Quiz {
  assignedUsers?: QuizAssignmentsTypes[]
  id: string
  createdOn: number
  username: string
  title: string
  description: string
  contestType: string
  timeLimit: number | string
  category: string
  questions: Question[]
  minPassingPoints: number
  maxPassingPoints: number
  scoreBoard?: scoreBoard[]
}
export interface scoreBoard {
  score: number
  username: string
}

export interface PublicQuizResolvedPropsTypes {
  id?: string
  score: number
  userAnswers?: Answer[]
}

export interface PublicScoreBoardUpdateTypes {
  [key: string]: {
    attempts: number;
    score: number;
  };
}

export interface QuizAssignmentsTypes {
  [key: string]: [number, number];
}

export interface TableTypes {
  quizzes: Quiz[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  headCol1: string
  headCol2: string
  headCol3: string
  headCol4: string
  headCol5: string
  img?: string
}

export interface CommentUserResultsTypes {
  [key: string]: string
}

export interface RemainingTimeTypes {
  timeLimit: number
  username: string
  id: string
  title: string
  score: number
  category: string
}

export interface UpdateUserScore {
  [key: string]: {
    score?: number;
    title?: string;
    id?: string;
    category?: string;
    userAnswers?: string[];
    maxPassingPoints?: number;
    minPassingPoints?: number;
    resolvedOn?: number;
    username?: string
  };
}

export interface AssignedUsersTypes{

}