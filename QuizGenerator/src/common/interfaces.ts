export interface UserData {
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

export interface Question{
  question: string
  answers: [{ text: string, isCorrect: boolean }]
}
