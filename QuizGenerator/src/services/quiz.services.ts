import { get, push, ref, set } from 'firebase/database';
import { database } from '../config/firebase-config';
interface Question{
  question: string
  answers: [{ text: string, isCorrect: boolean }]
}

export const addQuiz = (
  username: string,
  title: string,
  description: string,
  contestType: string,
  timeLimit: number | string,
  category: string,
  questions: Question[],
  minPassingPoints: number | string,
  maxPassingPoints: number | string
): Promise<void> => {
  const newQuizRef = push(ref(database, 'quizzes'));
  const quizData = {
    id: newQuizRef.key,
    category,
    title,
    description,
    createdBy: username,
    contestType,
    timeLimit,
    questions,
    createdOn: Date.now(),
    minPassingPoints,
    maxPassingPoints
  };

  // Add quiz to the quizzes collection
  return set(newQuizRef, quizData)
    .then(() => {
      // Add quiz id to the categories collection
      const categoryRef = ref(database, `categories/${category}`);
      return get(categoryRef).then((snapshot) => {
        if (snapshot.exists()) {
          // If category exists, append quiz id to the list
          const existingQuizzes = snapshot.val();
          existingQuizzes[newQuizRef.key] = true;
          return set(categoryRef, existingQuizzes);
        } else {
          // If category does not exist, create a new one with the quiz id
          return set(categoryRef, { [newQuizRef.key]: true });
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const quizzesRef = ref(database, 'quizzes');