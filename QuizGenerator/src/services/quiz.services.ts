import { get, push, ref, remove, set } from 'firebase/database';
import { database } from '../config/firebase-config';
import { Question } from '../common/interfaces';
import { Quiz } from '../common/interfaces';
import { DataSnapshot } from 'firebase/database';

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

const fromQuizDocument = (snapshot: DataSnapshot): Quiz[] => {
  const quizDocument = snapshot.val();

  return Object.keys(quizDocument).map(key => {
    const quiz = quizDocument[key];

    return {
      ...quiz,
      id: key,
      createdOn: new Date(quiz.createdOn),
    };
  });
};
export const getAllQuizzes = (): Promise<Quiz[]> => {

  return get(ref(database, 'quizzes'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromQuizDocument(snapshot);
    });
};

export const removeFromAssignments = (user: string, id: string): Promise<void> => {

  return remove(ref(database, `/assignments/users/${user}/${id}`));
};
export const removeAssignmentsFromQuiz = (user: string, id: string): Promise<void> => {

  return remove(ref(database, `/quizzes/${id}/assignedUsers/${user}`));
};
export const removeAssignmentsFromUser = (user: string, id: string): Promise<void> => {

  return remove(ref(database, `/users/${user}/assignedQuizzes/${id}`));
};

export const getQuizById = (id: string) => {

  return get(ref(database, `quizzes/${id}`))
    .then(result => {
      if (!result.exists()) {
        throw new Error(`Quiz with id ${id} does not exist!`);
      }

      const quiz = result.val();
      quiz.id = id;
      quiz.createdOn = new Date(quiz.createdOn);
     
      return quiz;
    });
};

export const updatePublicQuizScoreBoard = (quizId: string, attempts: string, score: string) => {
  const updateUserScore = {};
 
  updateUserScore[`/quizzes/${quizId}/scoreBoard/${attempts}`] = { attempts, score } 
  return update(ref(database), updateUserScore);
};