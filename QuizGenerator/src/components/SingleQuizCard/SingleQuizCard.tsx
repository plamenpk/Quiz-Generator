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


const SingleQuizCard: React.FC = ({ quiz }) => {

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
    timeLimit = Math.floor((appState?.userData?.assignedQuizzes[quiz?.id][1] - dateNow) / 1000);
  }
  const showScore = appState?.userData?.score ? Object.keys(appState?.userData?.score).includes(quiz?.title) : false;
  if (showScore) {
    score = appState?.userData?.score[quiz?.title].score;
  }

  const rejectQuiz = (): void => {

    updateUserScore(appState?.userData.username, quiz.id, quiz.title, score, quiz.category, [], quiz.maxPassingPoints, quiz.minPassingPoints)
      .then(() => {
        navigate(`/singleQuizView/${quiz?.id}`);
        console.log('Quiz result saved successfully');
      })
      .catch((e) => toast.error(e));

    removeFromAssignments(appState?.userData.username, quiz.id)
      .then(() => console.log('Quiz assignment updated successfully'))
      .catch((e) => toast.error(e));

    removeAssignmentsFromQuiz(appState?.userData.username, quiz.id)
      .then(() => console.log('Quiz assignment updated successfully'))
      .catch((e) => toast.error(e));

    removeAssignmentsFromUser(appState?.userData.username, quiz.id)
      .then(() => console.log('Quiz assignment updated successfully'))
      .catch((e) => toast.error(e));
  };

  const showSummary = appState?.userData?.score ? Object.keys(appState?.userData?.score).includes(quiz?.title) : false;

  return (
    <>
      {quiz && <div className="mb-10 overflow-hidden rounded-lg shadow-xl border-indigo-300">
        <div className="relative">
          <img src={img} alt="" className="h-60 w-full" />
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
        <div className="text-center bg-white dark:bg-gradient-to-br dark:from-slate-400 dark:to-zinc-500 dark:text-zinc-100 opacity-90 pb-8">
          <h3>
            <Link
              to={`/singleQuizView/${quiz?.id}`}
              className="mb-4 block text-xl font-semibold text-dark hover:text-primary dark:text-white sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]">
              {quiz?.title}
            </Link>
          </h3>
          <p className="mb-7 text-base leading-relaxed text-body-color ">
            {quiz?.description}
          </p>
          <p className="mb-7 text-base leading-relaxed text-body-color ">
            {`In this quiz you have ${quiz?.timeLimit} minutes to answer ${quiz?.question?.length} questions.`}
          </p>
          <div className="flex justify-center space-x-4">
            {!showSummary && <Link
              to={`/singleQuizView/${quiz?.id}`}
              className="inline-block mx-1 px-4 py-2 bg-violet-300  rounded-lg text-center font-medium transform transition duration-500 ease-in-out hover:scale-105 hover:bg-violet-500 hover:text-zinc-100 dark:text-black dark:hover:text-zinc-100 dark:bg-indigo-600"
            >
              Enroll
            </Link>}

            {showTimer && <button
              className="inline-block mx-1 px-4 py-2 bg-violet-300 rounded-lg text-center font-medium transform transition duration-500 ease-in-out hover:scale-105 hover:bg-violet-500 hover:text-white dark:text-black dark:hover:text-zinc-100 dark:bg-indigo-600"
              onClick={rejectQuiz}
            >
              Reject
            </button>}
            {showSummary && <Link
              to={`/singleQuizView/${quiz?.id}`}
              className="inline-block mx-1 px-4 py-2 bg-violet-300 rounded-lg text-center font-medium transform transition duration-500 ease-in-out hover:scale-105 hover:bg-violet-500 hover:text-white dark:text-black dark:hover:text-zinc-100 dark:bg-indigo-600"
            >
              Summary
            </Link>}
            <Link
              to={`/singleQuizScoreboard/${quiz?.id}`}
              className="inline-block mx-1 px-4 py-2 bg-violet-300 rounded-lg text-center font-medium transform transition duration-500 ease-in-out hover:scale-105 hover:bg-violet-500 hover:text-white dark:text-black dark:hover:text-zinc-100 dark:bg-indigo-600"
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