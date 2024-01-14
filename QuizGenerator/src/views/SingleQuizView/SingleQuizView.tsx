import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { getQuizById, updatePublicQuizScoreBoard } from '../../services/quiz.services';
import Timer from '../../components/Timer/Timer';
import { AuthContext } from '../../context/AuthContext';
import QuizResolved from '../QuizResolved/QuizResolved';
import dice from '../../assets/dice.gif';
import { updateUserScore } from '../../services/users.services';
import toast from 'react-hot-toast';
import {
  removeAssignmentsFromQuiz,
  removeAssignmentsFromUser,
  removeFromAssignments
} from '../../services/quiz.services';
import PublicQuizResolved from '../PublicQuizResolved/PublicQuizResolved';
import { QUIZ_STATUS } from '../../common/constants';
import { Quiz } from '../../common/interfaces';
import { Answer } from '../../common/interfaces';

const SingleQuizView: React.FC = () => {

  const { id } = useParams();
  const { appState } = useContext(AuthContext);
  const [quiz, setQuiz] = useState<Quiz>();
  const [userAnswers, setUserAnswers] = useState<Answer>([]);
  const [score, setScore] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const [isQuizResolved, setIsQuizResolved] = useState(false);
  const activeQuestionIndex = userAnswers.length;
  const [questions, setQuestions] = useState([]);
  const [attempts, setAttempts] = useState(1);

  useEffect(() => {
    if (id) {
      getQuizById(id)
        .then((fetchedQuiz) => {
          setQuiz(fetchedQuiz);
          setQuestions(fetchedQuiz.questions);
          if (fetchedQuiz?.scoreBoard) {
            setAttempts(Object.values(fetchedQuiz?.scoreBoard).length + 1);
          }
        })
        .catch((error) => {
          toast.error('Error fetching quiz details:', error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (appState?.userData?.score) {
     
      setIsQuizResolved(Object.values(appState?.userData?.score).map(el => el.id).includes(id));
    }
  }, [id, appState?.userData?.score]);

  const quizIsComplete = activeQuestionIndex === quiz?.questions.length;

  const handleSelectAnswer = (selectedAnswer) => {
    setUserAnswers((prevUserAnswers) => {
      return [...prevUserAnswers, selectedAnswer];
    });
  };

  const handleRandomizeQuiz = (): void => {
    const randomizedQuestions = [...questions];
    for (let i = randomizedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedQuestions[i], randomizedQuestions[j]] = [randomizedQuestions[j], randomizedQuestions[i]];
    }
    setQuestions(randomizedQuestions);
  };

  useEffect(() => {
  
    if (userAnswers[activeQuestionIndex - 1]?.isCorrect) {
      setScore((score) => score + 1);
    }
  }, [userAnswers, activeQuestionIndex]);

  const handleTimerFinish = (): void => {
    setTimerFinished(true);
  };

  if (isQuizResolved) {

    if (quiz?.contestType === QUIZ_STATUS.INVITATIONAL) {

      const resolvedOn = Object.values(appState?.userData?.score).find(el => el.id === id).resolvedOn;
      const scorePoints = Object.values(appState?.userData?.score).find(el => el.id === id).score;

      return <QuizResolved id={id} score={scorePoints} title={quiz?.title} category={quiz?.category} userAnswers={userAnswers} resolvedOn={resolvedOn} />;
    }
  }

  if (quizIsComplete || timerFinished) {

    const scorePoints = Math.ceil(score / quiz?.questions.length * quiz?.maxPassingPoints);

    if (appState?.user) {
      if (appState?.userData) {
        updateUserScore(
          appState.userData.username,
          id || '',
          quiz?.title || '',
          scorePoints,
          quiz?.category ?? '',
          userAnswers,
          quiz?.maxPassingPoints,
          quiz?.minPassingPoints
        )
          .then(() => console.log('Quiz result saved successfully'))
          .catch((e) => toast.error(e));

        removeFromAssignments(appState.userData.username, id || '')
          .then(() => console.log('Quiz assignment updated successfully'))
          .catch((e) => toast.error(e));

        removeAssignmentsFromQuiz(appState.userData.username, id || '')
          .then(() => console.log('Quiz assignment updated successfully'))
          .catch((e) => toast.error(e));

        removeAssignmentsFromUser(appState.userData.username, id || '')
          .then(() => console.log('Quiz assignment updated successfully'))
          .catch((e) => toast.error(e));
      }
    }
    else {
      updatePublicQuizScoreBoard(id || '', attempts, scorePoints);
    }

    return <PublicQuizResolved id={id} score={scorePoints} userAnswers={userAnswers}></PublicQuizResolved>;
  }

  return (
    <>
      {quiz && <div className="flex flex-col overflow-auto mt-12 pt-2 items-center justify-center">
        <div className="text-center md:pb-2">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter" data-aos="zoom-y-out">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-400">{quiz?.title}title</span>
          </h1>
        </div>
        <div className="flex xl:space-x-96 lg:space-x-28 sm:space-x-24">
          <div className="">
            <button onClick={handleRandomizeQuiz}>
              <img className="h-7 w-7 mix-blend-multiply" src={dice} alt="{dice}" />
              <span className="group-hover:text-gray-700">Randomize quiz</span>
            </button>
          </div>
          <p className="pt-7">Maximum points available - 100</p>
        </div>
        <div id="quiz" className="flex flex-col p-10 opacity-90 w-full md:w-3/4 lg:w-2/3 shadow-xl mx-auto">
          <div className="mb">
            <div className="w-20 h-20 pt-4 pl-2 border border-blue-700 rounded-full">
              <Timer onTimerFinish={handleTimerFinish} timeLimit={quiz?.timeLimit}></Timer>
            </div>
          </div>
          <div id="question" className="text-center mt-10">
            <h2 className="mb-10 font-medium text-2xl">{questions[activeQuestionIndex]?.question}</h2>
            <ul id="answers" className="grid grid-cols-1 md:grid-cols-1 gap-4 mx-auto">
              {questions[activeQuestionIndex]?.answers.map((answer) => (
                <div key={answer.text} className="">
                  <button className="border rounded border-blue-700 px-4 py-2  w-full text-center bg-blue-200 hover:bg-green-300"
                    onClick={() => handleSelectAnswer(answer)}>
                    {answer.text}
                  </button>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>}
    </>
  );

};

export default SingleQuizView;
