import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { dateNow } from '../../common/constants';
import RemainingTime from '../RemainingTime/RemainingTime';
import { updateUserScore } from '../../services/users.services';
import {
  removeFromAssignments,
  removeAssignmentsFromQuiz,
  removeAssignmentsFromUser
} from '../../services/quiz.services';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../../common/constants';
import IT from '../../assets/IT.jpg';
import bio from '../../assets/bio.jpg';
import history from '../../assets/history.jpg';
import math from '../../assets/math.jpg';
import base from '../../assets/base.jpg';
import astro from '../../assets/astro.jpg';
import geography from '../../assets/geography.jpg';
import { Question } from '../../common/interfaces';

interface SingleQuizCardProps {
  quiz: {
    id: string;
    username: string;
    title: string;
    description: string;
    contestType: string;
    timeLimit: number | string;
    category: string;
    questions: Question[];
    minPassingPoints: number
    maxPassingPoints: number
  };
}

const SingleQuizCard: React.FC<SingleQuizCardProps> = ({ quiz }) => {

  const { appState } = useContext(AuthContext);
  const [img, setImg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Use a separate function to set the image source based on quiz category
    const setImageSrc = (): void => {
      switch (quiz?.category) {
        case CATEGORIES.IT:
          setImg(IT);
          break;
        case CATEGORIES.BIOLOGY:
          setImg(bio);
          break;
        case CATEGORIES.MATHEMATICS:
          setImg(math);
          break;
        case CATEGORIES.HISTORY:
          setImg(history);
          break;
        case CATEGORIES.ASTRONOMY:
          setImg(astro);
          break;
        case CATEGORIES.GEOGRAPHY:
          setImg(geography);
          break;
        default:
          setImg(base);
      }
    };

    // Call the function to set the image source
    setImageSrc();
  }, [quiz?.category]);

  const showTimer = appState?.userData?.assignedQuizzes ? Object.keys(appState?.userData?.assignedQuizzes).includes(quiz?.id) : false;

  let timeLimit = 0;
  let score = 0;

  if (showTimer) {
    const assignedQuizzes = appState?.userData?.assignedQuizzes;

    if (assignedQuizzes && assignedQuizzes[quiz.id]) {
      timeLimit = Math.floor((assignedQuizzes[quiz.id][1] - dateNow) / 1000);
    }
  }
  const showScore = appState?.userData?.score ? Object.keys(appState?.userData?.score).includes(quiz?.title) : false;

  if (showScore) {
    if (appState?.userData?.score) {
      score = appState?.userData?.score[quiz?.title].score;
    }
  }

  const rejectQuiz = (): void => {

    if (appState?.userData) {
      updateUserScore(appState?.userData.username, quiz.id, quiz.title, score, quiz.category, [], quiz.maxPassingPoints, quiz.minPassingPoints)
        .then(() => {
          navigate(`/singleQuizView/${quiz?.id}`);
          console.log('Quiz result saved successfully');
        })
        .catch((e) => toast.error(e));
    }

    if (appState?.userData) {
      removeFromAssignments(appState?.userData.username, quiz.id)
        .then(() => console.log('Quiz assignment updated successfully'))
        .catch((e) => toast.error(e));
    }

    if (appState?.userData) {
      removeAssignmentsFromQuiz(appState?.userData.username, quiz.id)
        .then(() => console.log('Quiz assignment updated successfully'))
        .catch((e) => toast.error(e));
    }

    if (appState?.userData) {
      removeAssignmentsFromUser(appState?.userData.username, quiz.id)
        .then(() => console.log('Quiz assignment updated successfully'))
        .catch((e) => toast.error(e));
    }
  };

  const showSummary = appState?.userData?.score ? Object.keys(appState?.userData?.score).includes(quiz?.title) : false;

  return (
    <>
      {quiz && appState?.userData?.username && <div className="mb-4 overflow-hidden rounded-lg shadow-xl border-indigo-300">
        <div className="relative">
          <img src={img} alt="" className="h-30 w-full" />
          <div className="absolute top-0 right-0 z-10">
            {showTimer
              ? <RemainingTime
                timeLimit={timeLimit}
                username={appState?.userData?.username}
                id={quiz?.id}
                title={quiz?.title}
                score={0}
                category={quiz?.category} />
              : <div className="text-right mr-2 mt-2 text-lg">You score {score}</div>}
          </div>
        </div>
        <div className="pb-4 bg-white dark:bg-gradient-to-br dark:from-slate-400 dark:to-zinc-500 dark:text-zinc-100 opacity-90">
          <h3>
            <Link
              to={`/singleQuizView/${quiz?.id}`}
              className="mb-4 block text-xl pb-4 text-center font-semibold text-dark hover:text-primary dark:text-white sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]">
              {quiz?.title}
            </Link>
          </h3>
          <p className="mb-5 text-base pb-4 text-center leading-relaxed">
            {quiz?.description}
          </p>
          <p className="pl-3 text-base leading-relaxed">
            {`In this quiz you have ${quiz?.timeLimit} minutes`}
          </p>
          <p className="mb-5 pl-3 text-base leading-relaxed">
            {`to answer ${quiz?.questions?.length} questions.`}
          </p>
          <div className="flex justify-center space-x-4">
            {!showSummary && <Link
              to={`/single-quiz-view/${quiz?.id}`}
              className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
            >
              Enroll
            </Link>}

            {showTimer && <button
              className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
              onClick={rejectQuiz}
            >
              Reject
            </button>}
            {showSummary && <Link
              to={`/single-quiz-view/${quiz?.id}`}
              className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
            >
              Summary
            </Link>}
            <Link
              to={`/quiz-scoreboard/${quiz?.id}`}
              className="rounded-sm px-3 py-2 bg-blue-500 hover:bg-blue-700 text-base text-white dark:text-zinc-200 shadow-sm  dark:hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 hover:scale-105"
            >
              Scoreboard
            </Link>
          </div>
        </div>
      </div>}
    </>
  );
};


export default SingleQuizCard;