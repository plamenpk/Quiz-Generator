import { get } from 'firebase/database';
import { quizzesRef } from '../services/quiz.services';

export const titleCheck = (title: string): void => {
  get(quizzesRef)
  .then((snapshot) => {
    const quizzes = snapshot.val();
    for (const key in quizzes) {
      if (quizzes[key].title === title) {
        alert('Quiz with the same title already exists!');
        return;
      }
    }
  })
  .catch(console.error);
};