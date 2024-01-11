import React from 'react';
import CardContainer from '../../components/CardContainer/CardContainer';
import { useContext, useEffect, useState } from 'react';
import { getAllQuizzes } from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { QUIZ_STATUS } from '../../common/constants';
import { Quiz } from '../../common/interfaces';

const AssignedQuizzes: React.FC = () => {

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  const { appState } = useContext(AuthContext);
  useEffect(() => {
    getAllQuizzes()
      .then((snapshot) => {
        const invitationalQuizzes = snapshot.filter(quiz => quiz.contestType === QUIZ_STATUS.INVITATIONAL);
        setQuizzes(invitationalQuizzes);
      })
      .catch((e) => toast.error(e));

  }, []);

  if (appState?.userData?.username === 'student') {
    const filteredQuizzes =
      quizzes && appState?.userData
        ? quizzes.filter(
          (quiz) =>
            (!quiz.assignedUsers === false &&
              Object.keys(quiz.assignedUsers).includes(appState?.userData?.username ?? '')) ||
            (!quiz.scoreBoard === false &&
              Object.keys(quiz?.scoreBoard).includes(appState?.userData?.username ?? ''))
        )
        : [];
    setQuizzes(filteredQuizzes);
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-14 rounded-lg">
        <div className=" text-center">
          <h1
            className="text-5xl md:text-6xl font-extrabold leading-tighter dark:text-zinc-300 tracking-tighter"
            data-aos="zoom-y-out"
          >
            Welcome to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-orange-400">
              QuizGe
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
              nerator
            </span>
          </h1>
        </div>
      </div>
      <CardContainer quizzes={quizzes}/>
    </>
  );
};

export default AssignedQuizzes;