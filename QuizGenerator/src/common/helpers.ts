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

export const dateFormat = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);

  return `${day}/${month}/${year}`;
};

export const timeLimitInSeconds = (timeLimit: number): number => timeLimit * 60;

export const totalScore = (arr): number => arr.reduce((sum, item) => sum + item.score, 0);