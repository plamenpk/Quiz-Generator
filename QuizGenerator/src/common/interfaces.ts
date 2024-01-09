export interface UserData {
  assignedQuizzes: string[]
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
  assignedUsers: string[]
  id: string
  username: string
  title: string
  description: string
  contestType: string
  timeLimit: number | string
  category: string
  questions: Question[]
  minPassingPoints: number | string
  maxPassingPoints: number | string
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