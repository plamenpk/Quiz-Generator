import { ThenableReference, get, push, ref, remove, set, update } from 'firebase/database';
import { database } from '../config/firebase-config';
import { Question, QuizAssignmentsTypes } from '../common/interfaces';
import { Quiz } from '../common/interfaces';
import { DataSnapshot } from 'firebase/database';
import { PublicScoreBoardUpdateTypes } from '../common/interfaces';

export const addQuiz = (
  username: string,
  title: string,
  description: string,
  contestType: string,
  timeLimit: number,
  category: string,
  questions: Question[],
  minPassingPoints: number,
  maxPassingPoints: number
): Promise<void> => {
  // const newQuizRef = push(ref(database, 'quizzes'));
  const newQuizRef: ThenableReference = push(ref(database, 'quizzes'));
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

export const getQuizById = (id: string): Promise<Quiz> => {

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

export const updatePublicQuizScoreBoard = (quizId: string, attempts: number, score: number): Promise<void> => {
  const updateUserScore: PublicScoreBoardUpdateTypes = {};

  updateUserScore[`/quizzes/${quizId}/scoreBoard/${attempts}`] = { attempts, score };
  return update(ref(database), updateUserScore);
};

export const quizAssignments = (user: string, id: string, openFrom: number, openTo: number): Promise<void> => {
  const quizAssignment: QuizAssignmentsTypes = {};
  quizAssignment[`/assignments/users/${user}/${id}`] = [openFrom, openTo];
  quizAssignment[`/quizzes/${id}/assignedUsers/${user}`] = [openFrom, openTo];
  quizAssignment[`/users/${user}/assignedQuizzes/${id}`] = [openFrom, openTo];
  return update(ref(database), quizAssignment);
};

export const deleteQuiz = (id: string): Promise<void> => {
  return remove(ref(database, `quizzes/${id}`));
};

export const updateQuiz = async (quizId: string, quiz: Quiz): Promise<void> => {
  const pathQuestion = `quizzes/${quizId}`;
  try {
    return await update(ref(database), {
      [pathQuestion]: quiz
    });
  } catch (error) {
    console.error('Update failed:', error);
  }
};