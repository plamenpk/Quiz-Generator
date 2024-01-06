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
}

export interface ButtonType {
  text: string
  buttonType: 'button' | 'reset' | 'submit' | undefined
  onClickFunction?: (e: React.MouseEvent<HTMLButtonElement>) => void | undefined
}

interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  question: string;
  answers: Answer[];
}

export interface Quiz {
  username: string,
  title: string,
  description: string,
  contestType: string,
  timeLimit: number | string,
  category: string,
  questions: Question[],
  minPassingPoints: number | string,
  maxPassingPoints: number | string
}
